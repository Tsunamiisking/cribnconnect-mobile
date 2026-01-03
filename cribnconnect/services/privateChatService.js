import { auth, db } from '@/config/firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';

/**
 * Subscribe to all private chat conversations for the current user
 * Listens to Firestore privateChats collection in real-time
 * 
 * @param {string} userId - Current user's Firebase UID
 * @param {function} callback - Function called with updated chats array
 * @returns {function} Unsubscribe function
 */
export const subscribeUserPrivateChats = (userId, callback) => {
  if (!userId) {
    console.error('userId is required for subscribeUserPrivateChats');
    return () => {};
  }

  try {
    // Query for all conversations where user is a participant
    const chatsQuery = query(
      collection(db, 'privateChats'),
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const chats = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Determine the other user in the conversation
          const otherUserId = data.participants.find(id => id !== userId);
          const otherUserDetails = data.participantDetails?.[otherUserId];
          
          // Determine if current user is initiator or recipient
          const isInitiator = data.initiatorId === userId;
          const isRecipient = data.recipientId === userId;
          
          // Determine if user can send messages based on status
          let canSendMessages = false;
          if (data.status === 'accepted') {
            canSendMessages = true;
          } else if (data.status === 'pending' && isInitiator) {
            canSendMessages = data.messageCount === 0;
          }
          
          chats.push({
            conversationId: doc.id,
            participants: data.participants || [],
            participantDetails: data.participantDetails || {},
            initiatorId: data.initiatorId,
            recipientId: data.recipientId,
            status: data.status || 'pending',
            firstMessage: data.firstMessage,
            lastMessage: data.lastMessage,
            messageCount: data.messageCount || 0,
            unreadBy: data.unreadBy || [],
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
            acceptedAt: data.acceptedAt?.toMillis?.() || null,
            ignoredAt: data.ignoredAt?.toMillis?.() || null,
            
            // Computed fields for easier UI use
            otherUser: otherUserDetails || {
              uid: otherUserId,
              name: 'Unknown User',
              photoURL: null,
            },
            isInitiator,
            isRecipient,
            canSendMessages,
            hasUnread: data.unreadBy?.includes(userId) || false,
          });
        });
        
        // Sort by most recent activity
        chats.sort((a, b) => b.updatedAt - a.updatedAt);
        
        console.log(`Loaded ${chats.length} private chats for user ${userId}`);
        callback(chats);
      },
      (error) => {
        console.error('Error in private chats listener:', error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up private chats listener:', error);
    return () => {};
  }
};

/**
 * Subscribe to a specific private chat conversation
 * 
 * @param {string} conversationId - The conversation ID
 * @param {function} callback - Function called with updated conversation data
 * @returns {function} Unsubscribe function
 */
export const subscribeToConversation = (conversationId, callback) => {
  if (!conversationId) {
    console.error('conversationId is required');
    return () => {};
  }

  try {
    const conversationRef = doc(db, 'privateChats', conversationId);

    const unsubscribe = onSnapshot(
      conversationRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const currentUserId = auth.currentUser?.uid;
          
          if (!currentUserId) {
            console.error('No authenticated user');
            callback(null);
            return;
          }
          
          // Check if user is a participant
          if (!data.participants?.includes(currentUserId)) {
            console.error('User is not a participant in this conversation');
            callback(null);
            return;
          }
          
          const otherUserId = data.participants.find(id => id !== currentUserId);
          const otherUserDetails = data.participantDetails?.[otherUserId];
          
          const isInitiator = data.initiatorId === currentUserId;
          const isRecipient = data.recipientId === currentUserId;
          
          let canSendMessages = false;
          if (data.status === 'accepted') {
            canSendMessages = true;
          } else if (data.status === 'pending' && isInitiator) {
            canSendMessages = data.messageCount === 0;
          }
          
          callback({
            conversationId: doc.id,
            participants: data.participants || [],
            participantDetails: data.participantDetails || {},
            initiatorId: data.initiatorId,
            recipientId: data.recipientId,
            status: data.status || 'pending',
            firstMessage: data.firstMessage,
            lastMessage: data.lastMessage,
            messageCount: data.messageCount || 0,
            unreadBy: data.unreadBy || [],
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
            acceptedAt: data.acceptedAt?.toMillis?.() || null,
            ignoredAt: data.ignoredAt?.toMillis?.() || null,
            
            otherUser: otherUserDetails || {
              uid: otherUserId,
              name: 'Unknown User',
              photoURL: null,
            },
            isInitiator,
            isRecipient,
            canSendMessages,
            hasUnread: data.unreadBy?.includes(currentUserId) || false,
          });
        } else {
          console.error('Conversation not found');
          callback(null);
        }
      },
      (error) => {
        console.error('Error in conversation listener:', error);
        callback(null);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up conversation listener:', error);
    return () => {};
  }
};

/**
 * Subscribe to messages in a private chat conversation
 * 
 * @param {string} conversationId - The conversation ID
 * @param {function} callback - Function called with updated messages array
 * @returns {function} Unsubscribe function
 */
export const subscribeToMessages = (conversationId, callback) => {
  if (!conversationId) {
    console.error('conversationId is required');
    return () => {};
  }

  try {
    const messagesRef = collection(db, 'privateChats', conversationId, 'messages');

    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot) => {
        const messages = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            senderId: data.senderId,
            senderName: data.senderName,
            text: data.text,
            timestamp: data.timestamp?.toMillis?.() || Date.now(),
            type: data.type || 'text',
            read: data.read || false,
          });
        });
        
        // Sort by timestamp (oldest first for chat display)
        messages.sort((a, b) => a.timestamp - b.timestamp);
        
        callback(messages);
      },
      (error) => {
        console.error('Error in messages listener:', error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up messages listener:', error);
    return () => {};
  }
};
