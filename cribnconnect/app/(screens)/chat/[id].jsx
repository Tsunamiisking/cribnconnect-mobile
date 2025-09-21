import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
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
    // TODO: Fetch chat data from API
    // Example API call:
    // const fetchChatData = async () => {
    //   try {
    //     const response = await api.getChatData(id);
    //     setChatData(response.data);
    //     setMessages(response.data.messages);
    //   } catch (error) {
    //     console.error('Error fetching chat data:', error);
    //     setError('Failed to load chat data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchChatData();

    // Mock data - Determine if group chat based on ID
    // In a real app, you'd get this from your API
    setTimeout(() => {
      try {
        // For testing, treat any ID with "group" in it as a group chat
        const isGroup = id.includes("group") || id === "2" || id === "3" || id === "7" || id === "5";
        
        if (isGroup) {
          // Mock group chat data
          const groupData = {
            id,
            type: "group",
            name: id === "group1" ? "Coffee & Code Buddies" : 
                  id === "group2" ? "Downtown Apartment Hunters" : 
                  id === "2" ? "Tech Enthusiasts" :
                  id === "4" ? "Fitness Group" :
                  id === "7" ? "Book Club" :
                  "Photography Meetup",
            participants: id === "group1" ? 12 : id === "group2" ? 8 : 
                         id === "2" ? 18 : id === "4" ? 9 : id === "7" ? 14 : 15,
            online: Math.floor(Math.random() * 5) + 1,
            admin: "Alex Chen",
            messages: [
              {
                id: "1",
                text: "Hey everyone! Welcome to the group chat.",
                sender: "other",
                senderName: "Alex",
                timestamp: new Date(Date.now() - 86400000),
                delivered: true,
                read: true,
              },
              {
                id: "2",
                text: "Thanks for adding me! Looking forward to connecting with you all.",
                sender: "me",
                senderName: "You",
                timestamp: new Date(Date.now() - 76400000),
                delivered: true,
                read: true,
              },
              {
                id: "3",
                text: "Has anyone checked out the new resources I shared last week?",
                sender: "other",
                senderName: "Emma",
                timestamp: new Date(Date.now() - 36400000),
                delivered: true,
                read: true,
              },
              {
                id: "4",
                text: "Yes! They were really helpful. Thanks for sharing.",
                sender: "other",
                senderName: "Michael",
                timestamp: new Date(Date.now() - 26400000),
                delivered: true,
                read: true,
              },
              {
                id: "5",
                text: "I'm thinking of organizing another meetup soon. What days work best for everyone?",
                sender: "other",
                senderName: "Alex",
                timestamp: new Date(Date.now() - 3600000),
                delivered: true,
                read: true,
              },
              {
                id: "6",
                text: "Weekends work best for me. Saturday afternoon?",
                sender: "other",
                senderName: "Jessica",
                timestamp: new Date(Date.now() - 2400000),
                delivered: true,
                read: true,
              },
              {
                id: "7",
                text: "I could do Sunday too if that works better for everyone.",
                sender: "other",
                senderName: "David",
                timestamp: new Date(Date.now() - 1200000),
                delivered: true,
                read: true,
              },
              {
                id: "8",
                text: "Saturday works for me as well!",
                sender: "me",
                senderName: "You",
                timestamp: new Date(Date.now() - 600000),
                delivered: true,
                read: true,
              },
            ],
          };
          setChatData(groupData);
          setMessages(groupData.messages);
        } else {
          // Mock direct message data
          const directMessageData = {
            id,
            type: "direct",
            participant: {
              id: id,
              name: id === "organizer" ? "Sarah Johnson" :
                   id === "host" ? "Alex Chen" : 
                   id === "user1" ? "Mike Johnson" :
                   id === "user2" ? "Lisa Rodriguez" : "Chat Partner",
              isOnline: Math.random() > 0.5,
              lastSeen: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
            },
            messages: [
              {
                id: "1",
                text: "Hey! Thanks for your interest in the event/linkup!",
                sender: "them",
                timestamp: new Date(Date.now() - 3600000),
                delivered: true,
                read: true,
              },
              {
                id: "2",
                text: "Hi! I'm really excited about it. Can you tell me more details?",
                sender: "me",
                timestamp: new Date(Date.now() - 3500000),
                delivered: true,
                read: true,
              },
              {
                id: "3",
                text: "Absolutely! We usually meet around 7 PM and the vibe is really friendly. Perfect for meeting new people.",
                sender: "them",
                timestamp: new Date(Date.now() - 3400000),
                delivered: true,
                read: true,
              },
              {
                id: "4",
                text: "That sounds perfect! What should I bring or prepare?",
                sender: "me",
                timestamp: new Date(Date.now() - 3300000),
                delivered: true,
                read: false,
              },
            ],
          };
          setChatData(directMessageData);
          setMessages(directMessageData.messages);
        }
      } catch (error) {
        console.error('Error creating mock data:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    }, 800); // Simulate loading delay
  }, [id]);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    // TODO: Add API integration to send message
    // Example API call:
    // try {
    //   const response = await api.sendMessage(id, inputText.trim());
    //   if (response.success) {
    //     // Message sent successfully
    //   }
    // } catch (error) {
    //   console.error('Error sending message:', error);
    // }

    const isGroupChat = chatData?.type === "group";
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "me",
      ...(isGroupChat && { senderName: "You" }), // Add sender name for group chats
      timestamp: new Date(),
      delivered: false,
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, delivered: true } : msg
        )
      );
    }, 1000);

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
    const showDate =
      index === 0 ||
      formatDate(item.timestamp) !== formatDate(messages[index - 1]?.timestamp);
    
    // For group chats, determine if we should show the sender name
    const isGroupChat = chatData?.type === "group";
    const showSenderName = isGroupChat && !isMe && (
      index === 0 || 
      messages[index - 1]?.sender !== item.sender ||
      showDate
    );

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
});
