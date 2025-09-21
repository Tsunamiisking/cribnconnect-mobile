import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { PaperClip, Send, Smile } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Use a named constant component for better debugging
const DirectMessageScreen = ({ chatData }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(chatData?.messages || []);
  const flatListRef = useRef(null);

  // Format time to 12-hour format with AM/PM
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date for date headers (Today, Yesterday, or date)
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
    
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

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

  // Renders a single message bubble
  const renderMessage = ({ item, index }) => {
    const isMe = item.sender === 'me';
    const showDate = index === 0 || 
      formatDate(item.timestamp) !== formatDate(messages[index - 1]?.timestamp);

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatDate(item.timestamp)}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer, 
          isMe ? styles.myMessageContainer : styles.theirMessageContainer
        ]}>
          <View style={[
            styles.messageBubble, 
            isMe ? styles.myMessage : styles.theirMessage
          ]}>
            <Text style={[
              styles.messageText, 
              isMe ? styles.myMessageText : styles.theirMessageText
            ]}>
              {item.text}
            </Text>
          </View>
          
          <View style={styles.messageInfo}>
            <Text style={styles.timestamp}>
              {formatTime(item.timestamp)}
            </Text>
            {isMe && (
              <Text style={styles.deliveryStatus}>
                {item.read ? '✓✓' : item.delivered ? '✓' : '○'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!chatData) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Chat" showUser={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { participant } = chatData;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader 
        title={participant?.name || "Chat"} 
        showUser={false}
      />
      
      <View style={styles.onlineStatusContainer}>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: participant?.isOnline ? Colors.emerald : Colors.gray400 }
        ]} />
        <Text style={styles.onlineStatusText}>
          {participant?.isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Say hello to start the conversation!</Text>
            </View>
          }
        />

        {/* Message input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <PaperClip color={Colors.gray500} size={22} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message..."
              placeholderTextColor={Colors.gray500}
              multiline
              maxLength={1000}
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Smile color={Colors.gray500} size={22} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? Colors.white : Colors.gray400} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Set the displayName explicitly for better debugging and component identification
DirectMessageScreen.displayName = 'DirectMessageScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray600,
  },
  messagesList: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray600,
    backgroundColor: 'rgba(229,231,235,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    fontFamily: 'Sora-Regular',
    color: Colors.white,
  },
  theirMessageText: {
    fontFamily: 'Sora-Regular',
    color: Colors.gray900,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
  },
  deliveryStatus: {
    color: Colors.gray500,
    fontSize: 12,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  attachButton: {
    padding: 10,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray900,
    paddingVertical: 10,
    maxHeight: 100,
  },
  emojiButton: {
    padding: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray700,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
  },
});

// Export the component as both default and named export
export default DirectMessageScreen;