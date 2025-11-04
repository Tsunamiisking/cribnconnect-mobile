import BackHeader from "@/components/BackHeader";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import {
  markLinkupChatAsRead,
  sendMessageToLinkupChat,
  subscribeLinkupChat,
  subscribeLinkupMessages
} from "@/services/linkupChatService";
import { useLocalSearchParams } from "expo-router";
import { Info, Paperclip, Send, Users } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      setError('You must be logged in to view this chat');
      setLoading(false);
      return;
    }
    
    console.log('Loading chat for linkup ID:', id);
    
    // Subscribe to linkup chat data
    const unsubscribeChat = subscribeLinkupChat(id, (chatData) => {
      if (chatData) {
        console.log('Received linkup chat data:', chatData.name);
        setChatData({
          id: chatData.linkupId,
          type: 'group',
          name: chatData.name,
          participants: chatData.participantIds?.length || 0,
          online: 0, // Could be calculated from lastSeen timestamps
          admin: chatData.creatorId,
          photo: chatData.photo,
        });
        setLoading(false);
        
        // Mark as read when opened
        markLinkupChatAsRead(id, currentUser.uid);
      } else {
        setError('Chat not found');
        setLoading(false);
      }
    });
    
    // Subscribe to linkup messages
    const unsubscribeMessages = subscribeLinkupMessages(id, (messagesData) => {
      console.log('Received messages:', messagesData.length);
      
      // Transform Firestore messages to match component format
      const transformedMessages = messagesData.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.senderId === currentUser.uid ? 'me' : msg.senderId === 'system' ? 'system' : 'other',
        senderName: msg.senderName,
        timestamp: new Date(msg.timestamp),
        delivered: true,
        read: msg.isRead || false,
        type: msg.type || 'text',
        imageUrl: msg.imageUrl,
      }));
      
      setMessages(transformedMessages);
    });
    
    return () => {
      console.log('Cleaning up chat subscriptions');
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [id]);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      console.error('No authenticated user');
      return;
    }
    
    try {
      // Send message to Firebase
      await sendMessageToLinkupChat(id, {
        text: inputText.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        senderPhoto: currentUser.photoURL || null,
        type: 'text',
      });
      
      setInputText("");
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // You could show an error toast here
    }
  };
  
  // Function to view group information
  const handleViewGroupInfo = () => {
    // In a real app, navigate to group info screen
    console.log('View group info for:', chatData?.name);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString();
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender === "me";
    const isSystem = item.sender === "system" || item.type === "system";
    const showDate =
      index === 0 ||
      formatDate(item.timestamp) !== formatDate(messages[index - 1]?.timestamp);
    
    // For group chats, determine if we should show the sender name
    const isGroupChat = chatData?.type === "group";
    const showSenderName = isGroupChat && !isMe && !isSystem && (
      index === 0 || 
      messages[index - 1]?.sender !== item.sender ||
      showDate
    );

    // System messages (user joined, user left, etc.)
    if (isSystem) {
      return (
        <View>
          {showDate && (
            <View style={styles.dateContainer} className="py-2">
              <Text
                style={styles.dateText}
                className="text-center text-gray-500 text-sm"
              >
                {formatDate(item.timestamp)}
              </Text>
            </View>
          )}
          <View style={styles.systemMessageContainer}>
            <Text style={styles.systemMessageText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer} className="py-2">
            <Text
              style={styles.dateText}
              className="text-center text-gray-500 text-sm"
            >
              {formatDate(item.timestamp)}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            isMe ? styles.myMessageContainer : styles.theirMessageContainer,
          ]}
          className="px-4 py-2"
        >
          {/* Show sender name for group chats */}
          {showSenderName && (
            <View style={styles.senderNameContainer}>
              <Text style={styles.senderName}>
                {item.senderName}
              </Text>
            </View>
          )}
          
          <View
            style={[
              styles.messageBubble,
              isMe ? styles.myMessage : styles.theirMessage,
            ]}
            className={`max-w-3/4 p-3 rounded-2xl ${isMe ? "bg-blue-600 self-end" : "bg-gray-200 self-start"}`}
          >
            <Text
              style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.theirMessageText,
              ]}
              className={isMe ? "text-white" : "text-gray-900"}
            >
              {item.text}
            </Text>
          </View>

          <View
            style={styles.messageInfo}
            className="flex-row items-center mt-1"
          >
            <Text style={styles.timestamp} className="text-gray-500 text-xs">
              {formatTime(item.timestamp)}
            </Text>
            {isMe && (
              <Text
                style={styles.deliveryStatus}
                className="text-gray-500 text-xs ml-1"
              >
                {item.read ? "✓✓" : item.delivered ? "✓" : "○"}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View
          style={styles.loadingContainer}
          className="flex-1 justify-center items-center bg-white"
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText} className="text-gray-500 mt-4">
            Loading chat...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View
          style={styles.errorContainer}
          className="flex-1 justify-center items-center bg-white p-4"
        >
          <Text style={styles.errorText} className="text-red-500">
            Error: {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const isGroupChat = chatData?.type === "group";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        className="flex-1 bg-white"
      >
        {/* Chat Header */}
        <BackHeader 
          title={isGroupChat ? chatData?.name : chatData?.participant?.name} 
        />
        
        {/* Group Info Bar (only for group chats) */}
        {isGroupChat && (
          <TouchableOpacity 
            style={styles.groupInfoContainer}
            onPress={handleViewGroupInfo}
            activeOpacity={0.7}
          >
            <View style={styles.groupInfoLeft}>
              <Users size={18} color={Colors.primary} />
              <Text style={styles.groupMemberCount}>
                {chatData?.participants || 0} Members
              </Text>
              {chatData?.online > 0 && (
                <View style={styles.onlineContainer}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>{chatData.online} online</Text>
                </View>
              )}
            </View>
            
            <View style={styles.groupInfoRight}>
              <Info size={18} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        )}
        
        {/* Online Status (only for direct messages) */}
        {!isGroupChat && (
          <View style={styles.onlineStatusContainer}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: chatData?.participant?.isOnline ? Colors.emerald : Colors.gray400 }
            ]} />
            <Text style={styles.onlineStatusText}>
              {chatData?.participant?.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          className="flex-1 bg-gray-50"
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Message Input */}
        <View
          style={styles.inputContainer}
          className="px-4 py-3 bg-white border-t border-gray-200"
        >
          <View
            style={styles.inputRow}
            className="flex-row items-end space-x-3"
          >
            <TouchableOpacity style={styles.attachButton} className="p-2">
              <Paperclip size={20} color="#6b7280" />
            </TouchableOpacity>

            <View
              style={styles.textInputContainer}
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-2"
            >
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={isGroupChat ? "Message to group..." : "Type a message..."}
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={1000}
                className="text-gray-900 text-base"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() && styles.sendButtonActive,
              ]}
              className={`p-3 rounded-full bg-gray-200`}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={16} color={inputText.trim() ? "#fff" : "#6b7280"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    color: "#6b7280",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  messagesContent: {
    paddingVertical: 12,
  },
  dateContainer: {
    paddingVertical: 8,
  },
  dateText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  theirMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: Colors.gray200,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  theirMessageText: {
    color: "#111827",
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    color: "#6b7280",
    fontSize: 12,
  },
  deliveryStatus: {
    color: "#6b7280",
    fontSize: 12,
    marginLeft: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  attachButton: {
    padding: 8,
  },
  attachIcon: {
    color: "#6b7280",
    fontSize: 20,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 40,
  },
  textInput: {
    color: "#111827",
    fontSize: 16,
  },
  sendButton: {
    padding: 12,
    borderRadius: 50,
  },
  sendButtonActive: {
    backgroundColor: Colors.blue600,
  },
  sendIcon: {
    fontSize: 16,
  },
  // Group chat specific styles
  groupInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  groupInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupMemberCount: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.gray800,
    marginLeft: 8,
  },
  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emerald,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.emerald,
  },
  groupInfoRight: {
    padding: 6,
  },
  // Direct message specific styles
  onlineStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineStatusText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  // Sender name for group chats
  senderNameContainer: {
    marginBottom: 2,
    paddingLeft: 4,
  },
  senderName: {
    fontFamily: "Sora-SemiBold",
    fontSize: 13,
    color: Colors.primary,
  },
  // System message styles
  systemMessageContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  systemMessageText: {
    fontSize: 13,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
