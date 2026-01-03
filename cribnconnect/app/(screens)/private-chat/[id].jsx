import BackHeader from "@/components/BackHeader";
import { acceptChatRequest, ignoreChatRequest } from "@/api/services/chatServices";
import { auth, db } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeToConversation,
  subscribeToMessages,
} from "@/services/privateChatService";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { Check, Send, X, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivateChatScreen() {
  const { id } = useLocalSearchParams(); // Conversation ID
  const { publicProfile } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);
  const flatListRef = useRef(null);

  // Helper function to extract profile photo URL
  const getProfilePhotoUrl = (userData) => {
    if (!userData) return null;
    
    if (userData.profilePicture) return userData.profilePicture;
    if (userData.photoURL) return userData.photoURL;
    
    if (userData.images && userData.images.length > 0) {
      const primaryImage = userData.images.find(img => img.isPrimary);
      const imageToUse = primaryImage || userData.images[0];
      return imageToUse.url || imageToUse.thumbnail_url;
    }
    
    if (userData.video && userData.video.thumbnail_url) {
      return userData.video.thumbnail_url;
    }
    
    return null;
  };

  useEffect(() => {
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      setError('You must be logged in to view this chat');
      setLoading(false);
      return;
    }
    
    console.log('Loading private chat:', id);
    
    // Subscribe to conversation
    const unsubscribeConversation = subscribeToConversation(id, (conversationData) => {
      if (conversationData) {
        console.log('Found conversation:', conversationData.conversationId);
        setConversation(conversationData);
        setLoading(false);
      } else {
        setError('Conversation not found');
        setLoading(false);
      }
    });
    
    // Subscribe to messages
    const unsubscribeMessages = subscribeToMessages(id, (messagesData) => {
      console.log('Received messages:', messagesData.length);
      const transformedMessages = messagesData.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.senderId === currentUser.uid ? 'me' : 'other',
        senderId: msg.senderId,
        senderName: msg.senderName,
        timestamp: new Date(msg.timestamp),
        delivered: true,
        read: msg.read || false,
        type: msg.type || 'text',
      }));
      setMessages(transformedMessages);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 50);
    });
    
    return () => {
      console.log('Cleaning up private chat subscriptions');
      unsubscribeConversation();
      unsubscribeMessages();
    };
  }, [id]);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await acceptChatRequest(id);
      
      Alert.alert(
        "Chat Accepted!",
        `You can now chat with ${conversation?.otherUser?.name || 'this user'}`
      );
    } catch (error) {
      console.error("Error accepting chat:", error);
      Alert.alert("Error", "Failed to accept chat request");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleIgnore = async () => {
    Alert.alert(
      "Ignore Request?",
      `This will prevent ${conversation?.otherUser?.name || 'this user'} from sending more messages.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ignore",
          style: "destructive",
          onPress: async () => {
            try {
              setIsIgnoring(true);
              await ignoreChatRequest(id);
            } catch (error) {
              console.error("Error ignoring chat:", error);
              Alert.alert("Error", "Failed to ignore chat request");
            } finally {
              setIsIgnoring(false);
            }
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    if (conversation?.otherUser?.uid) {
      router.push(`/(screens)/public-profile/${conversation.otherUser.uid}`);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      console.error('No authenticated user');
      return;
    }

    // Check if user can send messages
    if (!conversation?.canSendMessages) {
      Alert.alert(
        "Cannot Send Message",
        conversation?.status === 'pending' 
          ? "Waiting for the recipient to accept your request."
          : "You cannot send messages in this conversation."
      );
      return;
    }
    
    const username = publicProfile?.username || 
                     publicProfile?.firstName || 
                     currentUser.displayName || 
                     'Anonymous';
    
    const messageText = inputText.trim();
    setInputText("");
    
    try {
      const conversationRef = doc(db, 'privateChats', id);
      const messagesRef = collection(conversationRef, 'messages');
      
      // Add message to Firestore
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: username,
        text: messageText,
        timestamp: serverTimestamp(),
        type: 'text',
        read: false,
      });
      
      // Update conversation lastMessage and metadata
      const otherUserId = conversation.participants.find(uid => uid !== currentUser.uid);
      await updateDoc(conversationRef, {
        lastMessage: {
          senderId: currentUser.uid,
          senderName: username,
          text: messageText,
          timestamp: Date.now(),
          type: 'text',
        },
        messageCount: increment(1),
        unreadBy: arrayUnion(otherUserId),
        updatedAt: serverTimestamp(),
      });
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setInputText(messageText);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isMyMessage = item.sender === "me";
    const showSenderInfo = !isMyMessage && (index === 0 || messages[index - 1]?.senderId !== item.senderId);
    
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        {!isMyMessage && showSenderInfo && (
          <View style={styles.senderInfo}>
            <TouchableOpacity onPress={handleProfilePress}>
              {conversation?.otherUser?.photoURL ? (
                <Image
                  source={{ uri: conversation.otherUser.photoURL }}
                  style={styles.senderPhoto}
                />
              ) : (
                <View style={[styles.senderPhoto, styles.photoPlaceholder]}>
                  <Text style={styles.photoPlaceholderText}>
                    {conversation?.otherUser?.name?.[0]?.toUpperCase() || "?"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {!isMyMessage && !showSenderInfo && <View style={styles.messageSpacer} />}
        
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.theirMessage,
          ]}
        >
          {!isMyMessage && showSenderInfo && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.text}
          </Text>
          <View style={[
            styles.messageInfo,
            isMyMessage ? styles.myMessageInfo : styles.theirMessageInfo
          ]}>
            <Text
              style={[
                styles.timestamp,
                isMyMessage ? styles.myTimestamp : styles.theirTimestamp,
              ]}
            >
              {item.timestamp.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
            {isMyMessage && (
              <Text style={styles.deliveryStatus}>
                {item.read ? "✓✓" : item.delivered ? "✓" : "⏱"}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Chat" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Chat" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const showPendingBanner = conversation?.status === 'pending';
  const isRecipient = conversation?.isRecipient;
  const canSend = conversation?.canSendMessages;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackHeader 
          title={conversation?.otherUser?.name || 'Chat'} 
          rightComponent={
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={handleProfilePress}
            >
              <User size={24} color={Colors.primary} />
            </TouchableOpacity>
          }
        />
      </View>

      {/* Pending Request Banner */}
      {showPendingBanner && isRecipient && (
        <View style={styles.requestBanner}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>Chat Request</Text>
            <Text style={styles.requestText}>
              {conversation.otherUser?.name || 'This user'} wants to connect with you
            </Text>
          </View>
          <View style={styles.requestActions}>
            <TouchableOpacity
              style={[styles.requestButton, styles.ignoreButton]}
              onPress={handleIgnore}
              disabled={isIgnoring || isAccepting}
            >
              {isIgnoring ? (
                <ActivityIndicator size="small" color={Colors.gray600} />
              ) : (
                <>
                  <X size={18} color={Colors.gray600} />
                  <Text style={styles.ignoreButtonText}>Ignore</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.requestButton, styles.acceptButton]}
              onPress={handleAccept}
              disabled={isAccepting || isIgnoring}
            >
              {isAccepting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Check size={18} color={Colors.white} />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Status info for initiator */}
      {showPendingBanner && !isRecipient && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            {canSend 
              ? "You can send one message. Waiting for them to accept."
              : "Request sent. Waiting for them to accept."}
          </Text>
        </View>
      )}

      {/* Ignored status */}
      {conversation?.status === 'ignored' && (
        <View style={styles.ignoredBanner}>
          <Text style={styles.ignoredText}>
            This conversation has been closed.
          </Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              !canSend 
                ? (conversation?.status === 'ignored' 
                    ? "Cannot send messages" 
                    : "Waiting for acceptance...")
                : "Type a message..."
            }
            placeholderTextColor={Colors.gray400}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            editable={canSend}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || !canSend) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || !canSend}
          >
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  profileButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: "center",
  },
  requestBanner: {
    backgroundColor: Colors.blue50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue200,
    padding: 16,
  },
  requestInfo: {
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: 4,
  },
  requestText: {
    fontSize: 14,
    color: Colors.gray600,
  },
  requestActions: {
    flexDirection: "row",
    gap: 12,
  },
  requestButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  ignoreButton: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  ignoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray600,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  infoBanner: {
    backgroundColor: Colors.warning + "20",
    borderBottomWidth: 1,
    borderBottomColor: Colors.warning + "40",
    padding: 12,
  },
  infoText: {
    fontSize: 13,
    color: Colors.gray700,
    textAlign: "center",
  },
  ignoredBanner: {
    backgroundColor: Colors.gray100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    padding: 12,
  },
  ignoredText: {
    fontSize: 13,
    color: Colors.gray600,
    textAlign: "center",
    fontStyle: "italic",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  myMessageContainer: {
    justifyContent: "flex-end",
  },
  theirMessageContainer: {
    justifyContent: "flex-start",
  },
  senderInfo: {
    marginRight: 8,
  },
  senderPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  photoPlaceholder: {
    backgroundColor: Colors.gray300,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  messageSpacer: {
    width: 40,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  myMessage: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: Colors.gray200,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.white,
  },
  theirMessageText: {
    color: Colors.gray900,
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  myMessageInfo: {
    justifyContent: "flex-end",
  },
  theirMessageInfo: {
    justifyContent: "flex-start",
  },
  timestamp: {
    fontSize: 11,
  },
  myTimestamp: {
    color: Colors.white + "CC",
  },
  theirTimestamp: {
    color: Colors.gray500,
  },
  deliveryStatus: {
    fontSize: 11,
    color: Colors.white + "CC",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: Colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.gray900,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
});