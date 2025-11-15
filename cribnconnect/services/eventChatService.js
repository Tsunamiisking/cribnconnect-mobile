/**
 * Event Group Chat Service
 * Handles all Firestore operations for event group chats
 */

import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Create a new event group chat
 * @param {string} eventId - The ID of the event from MongoDB
 * @param {Object} eventData - Event metadata
 * @param {string} eventData.name - Event name
 * @param {string} eventData.photo - Event photo URL
 * @param {string} eventData.description - Event description
 * @param {boolean} eventData.isFree - Whether the event is free
 * @param {string} creatorId - Firebase UID of the creator
 * @param {Object} creatorInfo - Creator information
 * @param {string} creatorInfo.name - Creator's username
 * @param {string} creatorInfo.photoURL - Creator's photo URL
 * @returns {Promise<string>} - The group chat ID
 */
export const createEventGroupChat = async (eventId, eventData, creatorId, creatorInfo) => {
  try {
    // Validate required parameters
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    
    if (!creatorId) {
      throw new Error('Creator ID is required');
    }
    
    if (!eventData || !eventData.name) {
      throw new Error('Event data with name is required');
    }
    
    console.log('Creating event group chat for:', eventId);
    
    // Use eventId as the document ID for easy lookup
    const groupChatRef = doc(db, 'eventChats', eventId);
    
    // Check if group chat already exists
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (groupChatSnap.exists()) {
      console.log('Event group chat already exists');
      return eventId;
    }
    
    // Create participant object for creator
    const creatorParticipant = {
      uid: creatorId,
      name: creatorInfo.name || 'Unknown User',
      photoURL: creatorInfo.photoURL || null,
      joinedAt: Date.now(),
      role: 'admin', // Creator is admin
    };
    
    // Create new event group chat document
    await setDoc(groupChatRef, {
      eventId: eventId,
      name: eventData.name,
      photo: eventData.photo || null,
      description: eventData.description || '',
      isFree: eventData.isFree || false,
      creatorId: creatorId,
      admins: [creatorId], // Creator is admin
      participants: [creatorParticipant], // Array of participant objects
      participantIds: [creatorId], // For quick lookup
      unreadBy: [], // Users who have unread messages
      lastMessage: null,
      messageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    });
    
    console.log('Event group chat created successfully for event:', eventId);
    return eventId;
  } catch (error) {
    console.error('Error creating event group chat:', error);
    throw error;
  }
};

/**
 * Add a user to an event group chat
 * @param {string} eventId - The event ID
 * @param {string} userId - Firebase UID of user to add
 * @param {Object} userInfo - User information
 * @param {string} userInfo.name - User's username
 * @param {string} userInfo.photoURL - User's photo URL
 * @returns {Promise<void>}
 */
export const addUserToEventChat = async (eventId, userId, userInfo) => {
  try {
    if (!eventId || !userId) {
      throw new Error('Event ID and user ID are required');
    }
    
    const groupChatRef = doc(db, 'eventChats', eventId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Event group chat not found');
    }
    
    const groupData = groupChatSnap.data();
    
    // Check if user is already a participant
    if (groupData.participantIds?.includes(userId)) {
      console.log('User is already a participant');
      return;
    }
    
    const newParticipant = {
      uid: userId,
      name: userInfo.name || 'Unknown User',
      photoURL: userInfo.photoURL || null,
      joinedAt: Date.now(),
      role: 'member'
    };
    
    await updateDoc(groupChatRef, {
      participants: arrayUnion(newParticipant),
      participantIds: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
    
    // Add system message about user joining
    await addSystemMessageToEvent(eventId, `${userInfo.name || 'A user'} joined the event`);
    
    console.log('User added to event group chat successfully');
  } catch (error) {
    console.error('Error adding user to event group chat:', error);
    throw error;
  }
};

/**
 * Remove a user from an event group chat
 * @param {string} eventId - The event ID
 * @param {string} userId - Firebase UID of user to remove
 * @param {string} userName - User's name for system message
 * @returns {Promise<void>}
 */
export const removeUserFromEventChat = async (eventId, userId, userName) => {
  try {
    if (!eventId || !userId) {
      throw new Error('Event ID and user ID are required');
    }
    
    const groupChatRef = doc(db, 'eventChats', eventId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Event group chat not found');
    }
    
    const groupData = groupChatSnap.data();
    
    // Find the participant object to remove
    const participantToRemove = groupData.participants?.find(p => p.uid === userId);
    
    if (!participantToRemove) {
      console.log('User is not a participant');
      return;
    }
    
    // Remove from admins if they are admin
    const updates = {
      participants: arrayRemove(participantToRemove),
      participantIds: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    };
    
    if (groupData.admins?.includes(userId)) {
      updates.admins = arrayRemove(userId);
    }
    
    await updateDoc(groupChatRef, updates);
    
    // Add system message about user leaving
    await addSystemMessageToEvent(eventId, `${userName || 'A user'} left the event`);
    
    console.log('User removed from event group chat successfully');
  } catch (error) {
    console.error('Error removing user from event group chat:', error);
    throw error;
  }
};

/**
 * Send a message to an event group chat
 * @param {string} eventId - The event ID
 * @param {Object} messageData - Message data
 * @param {string} messageData.text - Message text
 * @param {string} messageData.senderId - Sender's Firebase UID
 * @param {string} messageData.senderName - Sender's username
 * @param {string} messageData.senderPhoto - Sender's photo URL
 * @param {string} messageData.type - Message type (text, image, system)
 * @param {string} messageData.imageUrl - Image URL if type is image
 * @returns {Promise<string>} - The message ID
 */
export const sendMessageToEventChat = async (eventId, messageData) => {
  try {
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    
    if (!messageData.text && !messageData.imageUrl) {
      throw new Error('Message text or image URL is required');
    }
    
    if (!messageData.senderId) {
      throw new Error('Sender ID is required');
    }
    
    const groupChatRef = doc(db, 'eventChats', eventId);
    const messagesRef = collection(groupChatRef, 'messages');
    
    // Create message object
    const message = {
      text: messageData.text || '',
      senderId: messageData.senderId,
      senderName: messageData.senderName || 'Unknown User',
      senderPhoto: messageData.senderPhoto || null,
      type: messageData.type || 'text', // text, image, system
      imageUrl: messageData.imageUrl || null,
      timestamp: Date.now(),
      createdAt: serverTimestamp(),
      isRead: false,
      reactions: [], // For future emoji reactions
    };
    
    // Add message to subcollection
    const messageDoc = await addDoc(messagesRef, message);
    
    // Get current participants to set unreadBy
    const groupChatSnap = await getDoc(groupChatRef);
    const groupData = groupChatSnap.data();
    const otherParticipants = groupData.participantIds?.filter(id => id !== messageData.senderId) || [];
    
    // Update event group chat with last message
    await updateDoc(groupChatRef, {
      lastMessage: {
        text: messageData.text || '📷 Image',
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: Date.now(),
        type: messageData.type || 'text',
      },
      unreadBy: otherParticipants,
      messageCount: (groupData.messageCount || 0) + 1,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Message sent successfully to event chat');
    return messageDoc.id;
  } catch (error) {
    console.error('Error sending message to event chat:', error);
    throw error;
  }
};

/**
 * Add a system message (e.g., user joined, user left)
 * @param {string} eventId - The event ID
 * @param {string} text - System message text
 * @returns {Promise<string>} - The message ID
 */
export const addSystemMessageToEvent = async (eventId, text) => {
  try {
    const groupChatRef = doc(db, 'eventChats', eventId);
    const messagesRef = collection(groupChatRef, 'messages');
    
    const systemMessage = {
      text: text,
      senderId: 'system',
      senderName: 'System',
      senderPhoto: null,
      type: 'system',
      timestamp: Date.now(),
      createdAt: serverTimestamp(),
      isRead: false,
    };
    
    const messageDoc = await addDoc(messagesRef, systemMessage);
    
    // Update last message
    const groupChatSnap = await getDoc(groupChatRef);
    const groupData = groupChatSnap.data();
    
    await updateDoc(groupChatRef, {
      lastMessage: {
        text: text,
        senderId: 'system',
        senderName: 'System',
        timestamp: Date.now(),
        type: 'system',
      },
      messageCount: (groupData.messageCount || 0) + 1,
      updatedAt: serverTimestamp(),
    });
    
    return messageDoc.id;
  } catch (error) {
    console.error('Error adding system message to event chat:', error);
    throw error;
  }
};

/**
 * Get real-time updates for an event group chat
 * @param {string} eventId - The event ID
 * @param {Function} callback - Callback function to receive chat data
 * @returns {Function} - Unsubscribe function
 */
export const subscribeEventChat = (eventId, callback) => {
  try {
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    
    const groupChatRef = doc(db, 'eventChats', eventId);
    
    const unsubscribe = onSnapshot(groupChatRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        console.log('Event group chat not found');
        callback(null);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to event chat:', error);
    return () => {};
  }
};

/**
 * Get real-time messages for an event group chat
 * @param {string} eventId - The event ID
 * @param {Function} callback - Callback function to receive messages
 * @param {number} messageLimit - Number of messages to fetch (default: 50)
 * @returns {Function} - Unsubscribe function
 */
export const subscribeEventMessages = (eventId, callback, messageLimit = 50) => {
  try {
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    
    const groupChatRef = doc(db, 'eventChats', eventId);
    const messagesRef = collection(groupChatRef, 'messages');
    const messagesQuery = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages.reverse()); // Reverse to show oldest first
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to event messages:', error);
    return () => {};
  }
};

/**
 * Mark event chat as read for current user
 * @param {string} eventId - The event ID
 * @param {string} userId - Current user's Firebase UID
 * @returns {Promise<void>}
 */
export const markEventChatAsRead = async (eventId, userId) => {
  try {
    if (!eventId || !userId) {
      throw new Error('Event ID and user ID are required');
    }
    
    const groupChatRef = doc(db, 'eventChats', eventId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Event group chat not found');
    }
    
    const currentUnreadBy = groupChatSnap.data()?.unreadBy || [];
    const updatedUnreadBy = currentUnreadBy.filter(id => id !== userId);
    
    await updateDoc(groupChatRef, {
      unreadBy: updatedUnreadBy,
    });
    
    console.log('Event chat marked as read');
  } catch (error) {
    console.error('Error marking event chat as read:', error);
  }
};

/**
 * Get all event chats for a user
 * @param {string} userId - User's Firebase UID
 * @param {Function} callback - Callback function to receive chats
 * @returns {Function} - Unsubscribe function
 */
export const subscribeUserEventChats = (userId, callback) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const chatsRef = collection(db, 'eventChats');
    const chatsQuery = query(
      chatsRef,
      where('participantIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      callback(chats);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to user event chats:', error);
    return () => {};
  }
};

export default {
  createEventGroupChat,
  addUserToEventChat,
  removeUserFromEventChat,
  sendMessageToEventChat,
  addSystemMessageToEvent,
  subscribeEventChat,
  subscribeEventMessages,
  markEventChatAsRead,
  subscribeUserEventChats,
};
