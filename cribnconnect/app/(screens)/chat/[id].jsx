import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // TODO: Fetch chat history and partner info from API
    // Example API call:
    // const fetchChatData = async () => {
    //   try {
    //     const chatResponse = await api.getChatHistory(id);
    //     const partnerResponse = await api.getUserInfo(id);
    //     setMessages(chatResponse.data);
    //     setChatPartner(partnerResponse.data);
    //   } catch (error) {
    //     console.error('Error fetching chat data:', error);
    //   }
    // };
    // fetchChatData();

    // Mock data for now
    setChatPartner({
      id: id,
      name: id === 'organizer' ? 'Sarah Johnson' : id === 'host' ? 'Alex Chen' : 'Chat Partner',
      isOnline: true,
      lastSeen: new Date(),
    });

    setMessages([
      {
        id: '1',
        text: 'Hey! Thanks for your interest in the event/linkup!',
        sender: 'them',
        timestamp: new Date(Date.now() - 3600000),
        delivered: true,
        read: true,
      },
      {
        id: '2',
        text: 'Hi! I\'m really excited about it. Can you tell me more details?',
        sender: 'me',
        timestamp: new Date(Date.now() - 3500000),
        delivered: true,
        read: true,
      },
      {
        id: '3',
        text: 'Absolutely! We usually meet around 7 PM and the vibe is really friendly. Perfect for meeting new people.',
        sender: 'them',
        timestamp: new Date(Date.now() - 3400000),
        delivered: true,
        read: true,
      },
      {
        id: '4',
        text: 'That sounds perfect! What should I bring or prepare?',
        sender: 'me',
        timestamp: new Date(Date.now() - 3300000),
        delivered: true,
        read: false,
      },
    ]);
  }, [id]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

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

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date(),
      delivered: false,
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, delivered: true } : msg
      ));
    }, 1000);

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender === 'me';
    const showDate = index === 0 || 
      formatDate(item.timestamp) !== formatDate(messages[index - 1].timestamp);

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer} className="py-2">
            <Text style={styles.dateText} className="text-center text-gray-500 text-sm">
              {formatDate(item.timestamp)}
            </Text>
          </View>
        )}
        
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.theirMessageContainer]} className="px-4 py-2">
          <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]} 
                className={`max-w-3/4 p-3 rounded-2xl ${isMe ? 'bg-blue-600 self-end' : 'bg-gray-200 self-start'}`}>
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]} 
                  className={isMe ? 'text-white' : 'text-gray-900'}>
              {item.text}
            </Text>
          </View>
          
          <View style={styles.messageInfo} className="flex-row items-center mt-1">
            <Text style={styles.timestamp} className="text-gray-500 text-xs">
              {formatTime(item.timestamp)}
            </Text>
            {isMe && (
              <Text style={styles.deliveryStatus} className="text-gray-500 text-xs ml-1">
                {item.read ? '✓✓' : item.delivered ? '✓' : '○'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!chatPartner) {
    return (
      <View style={styles.loadingContainer} className="flex-1 justify-center items-center bg-white">
        <Text style={styles.loadingText} className="text-gray-500">Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      className="flex-1 bg-white"
    >
      {/* Chat Header */}
      <View style={styles.chatHeader} className="px-4 py-3 bg-white border-b border-gray-200">
        <View style={styles.headerContent} className="flex-row items-center">
          <View style={styles.partnerInfo} className="flex-1">
            <Text style={styles.partnerName} className="text-lg font-semibold text-gray-900">
              {chatPartner.name}
            </Text>
            <Text style={styles.onlineStatus} className="text-sm text-gray-500">
              {chatPartner.isOnline ? 'Online' : `Last seen ${formatTime(chatPartner.lastSeen)}`}
            </Text>
          </View>
          
          <View style={styles.headerActions} className="flex-row space-x-3">
            <TouchableOpacity style={styles.headerButton} className="p-2">
              <Text style={styles.headerButtonText} className="text-blue-600">📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} className="p-2">
              <Text style={styles.headerButtonText} className="text-blue-600">📹</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer} className="px-4 py-3 bg-white border-t border-gray-200">
        <View style={styles.inputRow} className="flex-row items-end space-x-3">
          <TouchableOpacity style={styles.attachButton} className="p-2">
            <Text style={styles.attachIcon} className="text-gray-500">📎</Text>
          </TouchableOpacity>
          
          <View style={styles.textInputContainer} className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={1000}
              className="text-gray-900 text-base"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]} 
            className={`p-3 rounded-full ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon} className={inputText.trim() ? 'text-white' : 'text-gray-500'}>
              ➤
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    color: '#6b7280',
  },
  chatHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  onlineStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: '#2563eb',
    fontSize: 18,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesContent: {
    paddingVertical: 12,
  },
  dateContainer: {
    paddingVertical: 8,
  },
  dateText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: '#111827',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    color: '#6b7280',
    fontSize: 12,
  },
  deliveryStatus: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  attachButton: {
    padding: 8,
  },
  attachIcon: {
    color: '#6b7280',
    fontSize: 20,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    color: '#111827',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 12,
    borderRadius: 50,
  },
  sendButtonActive: {
    backgroundColor: '#2563eb',
  },
  sendIcon: {
    fontSize: 16,
  },
});
