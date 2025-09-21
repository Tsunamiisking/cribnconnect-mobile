import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { Info, PaperClip, Send, Smile, Users } from 'lucide-react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';

// Use a named constant component for better debugging
const GroupChatScreen = ({ chatData }) => {
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
      senderName: 'You', // In a real app, this would come from the user profile
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

  // Navigate to group info
  const handleViewGroupInfo = () => {
    // In a real app, navigate to group info screen
    console.log('View group info for:', chatData?.name);
  };

  // Renders a single message bubble
  const renderMessage = ({ item, index }) => {
    const isMe = item.sender === 'me';
    const showDate = index === 0 || 
      formatDate(item.timestamp) !== formatDate(messages[index - 1]?.timestamp);
    
    const showSenderName = !isMe && (
      index === 0 || 
      messages[index - 1]?.sender !== item.sender ||
      showDate
    );

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
          {/* Show sender name for group chats */}
          {showSenderName && (
            <Text style={styles.senderName}>
              {item.senderName}
            </Text>
          )}
          
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
          
          <View style={[
            styles.messageInfo,
            isMe ? styles.myMessageInfo : styles.theirMessageInfo
          ]}>
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
        <BackHeader title="Group Chat" showUser={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading group conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader 
        title={chatData?.name || "Group Chat"} 
        showUser={false}
      />
      
      {/* Group info bar */}
      <TouchableOpacity 
        style={styles.groupInfoContainer}
        onPress={handleViewGroupInfo}
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
              <Text style={styles.emptySubtext}>Be the first to send a message to this group!</Text>
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
              placeholder="Message to group..."
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
GroupChatScreen.displayName = 'GroupChatScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  groupInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  groupInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupMemberCount: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.gray800,
    marginLeft: 8,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Sora-Regular',
    color: Colors.emerald,
  },
  groupInfoRight: {
    padding: 6,
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
  senderName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
    color: Colors.gray700,
    marginBottom: 3,
    marginLeft: 4,
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
  myMessageInfo: {
    justifyContent: 'flex-end',
  },
  theirMessageInfo: {
    justifyContent: 'flex-start',
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

// Export the component as default export
export default GroupChatScreen;