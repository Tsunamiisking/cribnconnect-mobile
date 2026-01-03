import BackHeader from "@/components/BackHeader";
import UserProfileModal from "@/components/UserProfileModal";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import {
  markEventChatAsRead,
  sendMessageToEventChat,
  subscribeEventChat,
  subscribeEventMessages
} from "@/services/eventChatService";
import {
  markLinkupChatAsRead,
  sendMessageToLinkupChat,
  subscribeLinkupChat,
  subscribeLinkupMessages
} from "@/services/linkupChatService";
import { getUserData } from "@/api/services/publicProfileServices";
import { useLocalSearchParams } from "expo-router";
import { Info, Paperclip, Send, Users } from "lucide-react-native";
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
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id, type } = useLocalSearchParams(); // Get both id and type from params
  const { publicProfileId, publicProfile, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatType, setChatType] = useState(type || null); // Use type from params
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const flatListRef = useRef(null);
  const router = useRouter();

  // Helper function to extract profile photo URL from various data structures
  const getProfilePhotoUrl = (userData) => {
    if (!userData) return null;
    
    // 1. Check for direct profilePicture or photoURL
    if (userData.profilePicture) return userData.profilePicture;
    if (userData.photoURL) return userData.photoURL;
    
    // 2. Check for images array (public profile structure)
    if (userData.images && userData.images.length > 0) {
      const primaryImage = userData.images.find(img => img.isPrimary);
      const imageToUse = primaryImage || userData.images[0];
      return imageToUse.url || imageToUse.thumbnail_url;
    }
    
    // 3. Fallback to video thumbnail
    if (userData.video && userData.video.thumbnail_url) {
      return userData.video.thumbnail_url;
    }
    
    return null;
  };

  useEffect(() => {
    setLoading(true);
    
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      setError('You must be logged in to view this chat');
      setLoading(false);
      return;
    }
    
    console.log('Loading chat for ID:', id, 'Type:', type);
    
    // Validate chat type
    if (!type || !['linkup', 'event', 'apartment'].includes(type)) {
      setError('Invalid chat type');
      setLoading(false);
      return;
    }
    
    let unsubscribeChat = () => {};
    let unsubscribeMessages = () => {};
    
    // Subscribe based on chat type
    if (type === 'linkup') {
      console.log('Subscribing to linkup chat...');
      
      unsubscribeChat = subscribeLinkupChat(id, (linkupChatData) => {
        if (linkupChatData) {
          console.log('Found linkup chat:', linkupChatData.name);
          setChatData({
            id: linkupChatData.linkupId,
            type: 'group',
            name: linkupChatData.name,
            participants: linkupChatData.participantIds?.length || 0,
            participantsList: linkupChatData.participants || [], // Store full participant objects
            online: 0,
            admin: linkupChatData.creatorId,
            photo: linkupChatData.photo,
          });
          setLoading(false);
          
          // Mark as read
          markLinkupChatAsRead(id, currentUser.uid);
        } else {
          setError('Linkup chat not found');
          setLoading(false);
        }
      });
      
      unsubscribeMessages = subscribeLinkupMessages(id, (messagesData) => {
        console.log('Received linkup messages:', messagesData.length);
        const transformedMessages = messagesData.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.senderId === currentUser.uid ? 'me' : msg.senderId === 'system' ? 'system' : 'other',
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderPhoto: msg.senderPhoto || null,
          timestamp: new Date(msg.timestamp),
          delivered: true,
          read: msg.isRead || false,
          type: msg.type || 'text',
          imageUrl: msg.imageUrl,
        }));
        setMessages(transformedMessages);
          // Auto-scroll to bottom when messages load
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 50);
      });
      
    } else if (type === 'event') {
      console.log('Subscribing to event chat...');
      
      unsubscribeChat = subscribeEventChat(id, (eventChatData) => {
        if (eventChatData) {
          console.log('Found event chat:', eventChatData.name);
          setChatData({
            id: eventChatData.eventId,
            type: 'group',
            name: eventChatData.name,
            participants: eventChatData.participantIds?.length || 0,
            participantsList: eventChatData.participants || [], // Store full participant objects
            online: 0,
            admin: eventChatData.creatorId,
            photo: eventChatData.photo,
          });
          setLoading(false);
          
          // Mark as read
          markEventChatAsRead(id, currentUser.uid);
        } else {
          setError('Event chat not found');
          setLoading(false);
        }
      });
      
      unsubscribeMessages = subscribeEventMessages(id, (messagesData) => {
        console.log('Received event messages:', messagesData.length);
        const transformedMessages = messagesData.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.senderId === currentUser.uid ? 'me' : msg.senderId === 'system' ? 'system' : 'other',
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderPhoto: msg.senderPhoto || null,
          timestamp: new Date(msg.timestamp),
          delivered: true,
          read: msg.isRead || false,
          type: msg.type || 'text',
          imageUrl: msg.imageUrl,
        }));
        setMessages(transformedMessages);
          // Auto-scroll to bottom when messages load
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 50);
      });
      
    } else if (type === 'apartment') {
      // TODO: Implement apartment chat when ready
      setError('Apartment chats not yet implemented');
      setLoading(false);
    }
    
    return () => {
      console.log('Cleaning up chat subscriptions');
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [id, type]);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      console.error('No authenticated user');
      return;
    }
    
    // Get username from publicProfile (context) or fallback to displayName
    const username = publicProfile?.username || 
                     publicProfile?.firstName || 
                     currentUser.displayName || 
                     'Anonymous';
    
    // Get profile photo using helper function
    const senderPhoto = getProfilePhotoUrl(publicProfile) || currentUser.photoURL || null;
    
    // Store message text and clear input immediately for better UX
    const messageText = inputText.trim();
    setInputText("");
    
    try {
      const messageData = {
        text: messageText,
        senderId: currentUser.uid,
        senderName: username,
        senderPhoto: senderPhoto,
        type: 'text',
      };
      
      // Send message based on chat type
      if (chatType === 'linkup') {
        await sendMessageToLinkupChat(id, messageData);
      } else if (chatType === 'event') {
        await sendMessageToEventChat(id, messageData);
      } else {
        console.error('Unknown chat type:', chatType);
        // Restore message if chat type is invalid
        setInputText(messageText);
        return;
      }
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message to input if send failed
      setInputText(messageText);
      // You could show an error toast here
    }
  };
  
  // Function to view group information
  const handleViewGroupInfo = () => {
    if (!chatData?.id) return;
    
    // Navigate to appropriate details screen based on chat type
    if (chatType === 'linkup') {
      router.push(`/(screens)/linkup-details/${chatData.id}`);
    } else if (chatType === 'event') {
      router.push(`/(screens)/event-details/${chatData.id}`);
    } else if (chatType === 'apartment') {
      router.push(`/(screens)/apartment-details/${chatData.id}`);
    }
  };

  // Function to handle profile photo click
  const handleProfilePhotoClick = async (senderId) => {
    if (!senderId || senderId === 'system') return;
    
    setLoadingUserData(true);
    setShowUserModal(true);
    
    try {
      const result = await getUserData(senderId);
      console.log('Fetched user data:', result.data);
      setSelectedUser(result.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Unable to load user profile');
      setShowUserModal(false);
    } finally {
      setLoadingUserData(false);
    }
  };

  // Function to close user modal
  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
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
    
    // For group chats, determine if we should show the sender name and photo
    const isGroupChat = chatData?.type === "group";
    const showSenderInfo = isGroupChat && !isMe && !isSystem && (
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
          {/* Message row with profile photo for group chats */}
          <View style={[
            styles.messageRow,
            isMe ? styles.myMessageRow : styles.theirMessageRow
          ]}>
            {/* Profile photo (only for other users in group chats) */}
            {isGroupChat && !isMe && (
              <View style={styles.profilePhotoContainer}>
                {showSenderInfo ? (
                  <TouchableOpacity
                    onPress={() => handleProfilePhotoClick(item.senderId)}
                    activeOpacity={0.7}
                  >
                    {item.senderPhoto ? (
                      <Image
                        source={{ uri: item.senderPhoto }}
                        style={styles.profilePhoto}
                      />
                    ) : (
                      <View style={styles.profilePhotoPlaceholder}>
                        <Text style={styles.profilePhotoInitial}>
                          {(item.senderName || 'U').charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={styles.profilePhotoSpacer} />
                )}
              </View>
            )}

            {/* Message content */}
            <View style={styles.messageContent}>
              {/* Show sender name for group chats (above the message bubble) */}
              {showSenderInfo && (
                <View style={styles.senderNameContainer}>
                  <Text style={styles.senderName}>
                    {item.senderName || 'Unknown'}
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
                style={[
                  styles.messageInfo,
                  isMe ? styles.myMessageInfo : styles.theirMessageInfo
                ]}
              >
                <Text style={[
                  styles.timestamp,
                  isMe && styles.myTimestamp
                ]}>
                  {formatTime(item.timestamp)}
                </Text>
                {isMe && (
                  <Text style={styles.deliveryStatus}>
                    {item.read ? "✓✓" : item.delivered ? "✓" : "○"}
                  </Text>
                )}
              </View>
            </View>
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

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showUserModal}
        onClose={handleCloseUserModal}
        userData={selectedUser}
        loading={loadingUserData}
      />
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
    marginTop: 2,
    gap: 4,
  },
  myMessageInfo: {
    justifyContent: 'flex-end',
  },
  theirMessageInfo: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    color: "#9ca3af",
    fontSize: 11,
    fontFamily: "Sora-Regular",
  },
  myTimestamp: {
    color: "#9ca3af",
  },
  deliveryStatus: {
    color: "#9ca3af",
    fontSize: 11,
    fontFamily: "Sora-Regular",
    lineHeight: 11,
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
  // Profile photo styles for group chats
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  profilePhotoContainer: {
    width: 32,
    height: 32,
    marginRight: 8,
    marginBottom: 20, // Align with timestamp area
  },
  profilePhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray200,
  },
  profilePhotoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoInitial: {
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
  profilePhotoSpacer: {
    width: 32,
    height: 32,
  },
  messageContent: {
    flex: 1,
    maxWidth: '85%',
  },
});
