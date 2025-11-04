import { db } from '@/config/firebase';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';

/**
 * Linkup Group Chat Service
 * Handles all Firestore operations for linkup group chats
 */

/**
 * Create a new linkup group chat
 * @param {string} linkupId - The ID of the linkup from MongoDB
 * @param {Object} linkupData - Linkup metadata
 * @param {string} linkupData.name - Group name
 * @param {string} linkupData.photo - Group photo URL
 * @param {string} linkupData.description - Group description
 * @param {string} creatorId - Firebase UID of the creator
 * @param {Object} creatorInfo - Creator information
 * @param {string} creatorInfo.name - Creator's username
 * @param {string} creatorInfo.photoURL - Creator's photo URL
 * @returns {Promise<string>} - The group chat ID
 */
export const createLinkupGroupChat = async (linkupId, linkupData, creatorId, creatorInfo) => {
  try {
    // Validate required parameters
    if (!linkupId) {
      throw new Error('Linkup ID is required');
    }
    
    if (!creatorId) {
      throw new Error('Creator ID is required');
    }
    
    if (!linkupData || !linkupData.name) {
      throw new Error('Linkup data with name is required');
    }
    
    console.log('Creating linkup group chat for:', linkupId);
    
    // Use linkupId as the document ID for easy lookup
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    
    // Check if group chat already exists
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (groupChatSnap.exists()) {
      console.log('Group chat already exists for linkup:', linkupId);
      return linkupId;
    }
    
    // Create participant object for creator
    const creatorParticipant = {
      uid: creatorId,
      name: creatorInfo.name || 'Unknown User',
      photoURL: creatorInfo.photoURL || null,
      joinedAt: Date.now(),
      role: 'admin' // Creator is automatically admin
    };
    
    // Create new group chat document
    await setDoc(groupChatRef, {
      linkupId: linkupId,
      name: linkupData.name,
      photo: linkupData.photo || null,
      description: linkupData.description || '',
      creatorId: creatorId,
      admins: [creatorId], // Array of admin UIDs
      participants: [creatorParticipant], // Array of participant objects
      participantIds: [creatorId], // Array of UIDs for easy querying
      unreadBy: [], // Array of UIDs who haven't read latest message
      lastMessage: null,
      messageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    });
    
    console.log('Group chat created successfully for linkup:', linkupId);
    return linkupId;
  } catch (error) {
    console.error('Error creating linkup group chat:', error);
    throw error;
  }
};

/**
 * Add a user to a linkup group chat
 * @param {string} linkupId - The linkup ID
 * @param {string} userId - Firebase UID of user to add
 * @param {Object} userInfo - User information
 * @param {string} userInfo.name - User's username
 * @param {string} userInfo.photoURL - User's photo URL
 * @returns {Promise<void>}
 */
export const addUserToLinkupChat = async (linkupId, userId, userInfo) => {
  try {
    if (!linkupId || !userId) {
      throw new Error('Linkup ID and User ID are required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Group chat does not exist');
    }
    
    const groupData = groupChatSnap.data();
    
    // Check if user is already a participant
    if (groupData.participantIds?.includes(userId)) {
      console.log('User already in group chat');
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
    await addSystemMessage(linkupId, `${userInfo.name || 'A user'} joined the group`);
    
    console.log('User added to group chat successfully');
  } catch (error) {
    console.error('Error adding user to group chat:', error);
    throw error;
  }
};

/**
 * Remove a user from a linkup group chat
 * @param {string} linkupId - The linkup ID
 * @param {string} userId - Firebase UID of user to remove
 * @param {string} userName - User's name for system message
 * @returns {Promise<void>}
 */
export const removeUserFromLinkupChat = async (linkupId, userId, userName) => {
  try {
    if (!linkupId || !userId) {
      throw new Error('Linkup ID and User ID are required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Group chat does not exist');
    }
    
    const groupData = groupChatSnap.data();
    
    // Find the participant object to remove
    const participantToRemove = groupData.participants?.find(p => p.uid === userId);
    
    if (!participantToRemove) {
      console.log('User not found in group chat');
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
    await addSystemMessage(linkupId, `${userName || 'A user'} left the group`);
    
    console.log('User removed from group chat successfully');
  } catch (error) {
    console.error('Error removing user from group chat:', error);
    throw error;
  }
};

/**
 * Send a message to a linkup group chat
 * @param {string} linkupId - The linkup ID
 * @param {Object} messageData - Message data
 * @param {string} messageData.text - Message text
 * @param {string} messageData.senderId - Sender's Firebase UID
 * @param {string} messageData.senderName - Sender's username
 * @param {string} messageData.senderPhoto - Sender's photo URL
 * @param {string} messageData.type - Message type (text, image, system)
 * @param {string} messageData.imageUrl - Image URL if type is image
 * @returns {Promise<string>} - The message ID
 */
export const sendMessageToLinkupChat = async (linkupId, messageData) => {
  try {
    if (!linkupId) {
      throw new Error('Linkup ID is required');
    }
    
    if (!messageData.text && !messageData.imageUrl) {
      throw new Error('Message text or image is required');
    }
    
    if (!messageData.senderId) {
      throw new Error('Sender ID is required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
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
      reactions: [], // Array of {userId, emoji}
    };
    
    // Add message to subcollection
    const messageDoc = await addDoc(messagesRef, message);
    
    // Get current participants to set unreadBy
    const groupChatSnap = await getDoc(groupChatRef);
    const groupData = groupChatSnap.data();
    const otherParticipants = groupData.participantIds?.filter(id => id !== messageData.senderId) || [];
    
    // Update group chat with last message
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
    
    console.log('Message sent successfully');
    return messageDoc.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Add a system message (e.g., user joined, user left)
 * @param {string} linkupId - The linkup ID
 * @param {string} text - System message text
 * @returns {Promise<string>} - The message ID
 */
export const addSystemMessage = async (linkupId, text) => {
  try {
    const groupChatRef = doc(db, 'linkupChats', linkupId);
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
    console.error('Error adding system message:', error);
    throw error;
  }
};

/**
 * Get real-time updates for a linkup group chat
 * @param {string} linkupId - The linkup ID
 * @param {Function} callback - Callback function to receive chat data
 * @returns {Function} - Unsubscribe function
 */
export const subscribeLinkupChat = (linkupId, callback) => {
  try {
    if (!linkupId) {
      throw new Error('Linkup ID is required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    
    const unsubscribe = onSnapshot(groupChatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Linkup chat data updated:', linkupId);
        callback(data);
      } else {
        console.log('Linkup chat does not exist:', linkupId);
        callback(null);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to linkup chat:', error);
    return () => {};
  }
};

/**
 * Get real-time messages for a linkup group chat
 * @param {string} linkupId - The linkup ID
 * @param {Function} callback - Callback function to receive messages
 * @param {number} messageLimit - Number of messages to fetch (default: 50)
 * @returns {Function} - Unsubscribe function
 */
export const subscribeLinkupMessages = (linkupId, callback, messageLimit = 50) => {
  try {
    if (!linkupId) {
      throw new Error('Linkup ID is required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const messagesRef = collection(groupChatRef, 'messages');
    const messagesQuery = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Reverse to show oldest first
      callback(messages.reverse());
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    return () => {};
  }
};

/**
 * Mark linkup chat as read for current user
 * @param {string} linkupId - The linkup ID
 * @param {string} userId - Current user's Firebase UID
 * @returns {Promise<void>}
 */
export const markLinkupChatAsRead = async (linkupId, userId) => {
  try {
    if (!linkupId || !userId) {
      throw new Error('Linkup ID and User ID are required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      return;
    }
    
    const currentUnreadBy = groupChatSnap.data()?.unreadBy || [];
    const updatedUnreadBy = currentUnreadBy.filter(id => id !== userId);
    
    await updateDoc(groupChatRef, {
      unreadBy: updatedUnreadBy,
    });
    
    console.log('Linkup chat marked as read');
  } catch (error) {
    console.error('Error marking linkup chat as read:', error);
  }
};

/**
 * Get all linkup chats for a user
 * @param {string} userId - User's Firebase UID
 * @param {Function} callback - Callback function to receive chats
 * @returns {Function} - Unsubscribe function
 */
export const subscribeUserLinkupChats = (userId, callback) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const chatsRef = collection(db, 'linkupChats');
    const chatsQuery = query(
      chatsRef,
      where('participantIds', 'array-contains', userId),
      where('isActive', '==', true),
      orderBy('updatedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const chats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      callback(chats);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to user linkup chats:', error);
    return () => {};
  }
};

/**
 * Promote a user to admin
 * @param {string} linkupId - The linkup ID
 * @param {string} userId - User's Firebase UID to promote
 * @param {string} currentUserId - Current user's Firebase UID (must be admin)
 * @returns {Promise<void>}
 */
export const promoteToAdmin = async (linkupId, userId, currentUserId) => {
  try {
    if (!linkupId || !userId || !currentUserId) {
      throw new Error('Linkup ID, User ID, and Current User ID are required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Group chat does not exist');
    }
    
    const groupData = groupChatSnap.data();
    
    // Check if current user is admin
    if (!groupData.admins?.includes(currentUserId)) {
      throw new Error('Only admins can promote users');
    }
    
    // Check if user is already admin
    if (groupData.admins?.includes(userId)) {
      console.log('User is already an admin');
      return;
    }
    
    // Update participant role
    const updatedParticipants = groupData.participants.map(p => 
      p.uid === userId ? { ...p, role: 'admin' } : p
    );
    
    await updateDoc(groupChatRef, {
      admins: arrayUnion(userId),
      participants: updatedParticipants,
      updatedAt: serverTimestamp(),
    });
    
    const userName = groupData.participants.find(p => p.uid === userId)?.name || 'A user';
    await addSystemMessage(linkupId, `${userName} was promoted to admin`);
    
    console.log('User promoted to admin successfully');
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
};

/**
 * Remove admin privileges from a user
 * @param {string} linkupId - The linkup ID
 * @param {string} userId - User's Firebase UID to demote
 * @param {string} currentUserId - Current user's Firebase UID (must be creator)
 * @returns {Promise<void>}
 */
export const demoteFromAdmin = async (linkupId, userId, currentUserId) => {
  try {
    if (!linkupId || !userId || !currentUserId) {
      throw new Error('Linkup ID, User ID, and Current User ID are required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Group chat does not exist');
    }
    
    const groupData = groupChatSnap.data();
    
    // Only creator can demote admins
    if (groupData.creatorId !== currentUserId) {
      throw new Error('Only the creator can demote admins');
    }
    
    // Cannot demote creator
    if (userId === groupData.creatorId) {
      throw new Error('Cannot demote the creator');
    }
    
    // Update participant role
    const updatedParticipants = groupData.participants.map(p => 
      p.uid === userId ? { ...p, role: 'member' } : p
    );
    
    await updateDoc(groupChatRef, {
      admins: arrayRemove(userId),
      participants: updatedParticipants,
      updatedAt: serverTimestamp(),
    });
    
    const userName = groupData.participants.find(p => p.uid === userId)?.name || 'A user';
    await addSystemMessage(linkupId, `${userName} was demoted from admin`);
    
    console.log('User demoted from admin successfully');
  } catch (error) {
    console.error('Error demoting user from admin:', error);
    throw error;
  }
};

/**
 * Delete a message (admin only)
 * @param {string} linkupId - The linkup ID
 * @param {string} messageId - Message ID to delete
 * @param {string} userId - Current user's Firebase UID (must be admin)
 * @returns {Promise<void>}
 */
export const deleteMessage = async (linkupId, messageId, userId) => {
  try {
    if (!linkupId || !messageId || !userId) {
      throw new Error('Linkup ID, Message ID, and User ID are required');
    }
    
    const groupChatRef = doc(db, 'linkupChats', linkupId);
    const groupChatSnap = await getDoc(groupChatRef);
    
    if (!groupChatSnap.exists()) {
      throw new Error('Group chat does not exist');
    }
    
    const groupData = groupChatSnap.data();
    
    // Check if user is admin
    if (!groupData.admins?.includes(userId)) {
      throw new Error('Only admins can delete messages');
    }
    
    const messageRef = doc(db, 'linkupChats', linkupId, 'messages', messageId);
    await deleteDoc(messageRef);
    
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

/**
 * Get unread count for all user's linkup chats
 * @param {string} userId - User's Firebase UID
 * @returns {Promise<number>} - Total unread count
 */
export const getUnreadLinkupChatsCount = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const chatsRef = collection(db, 'linkupChats');
    const chatsQuery = query(
      chatsRef,
      where('participantIds', 'array-contains', userId),
      where('unreadBy', 'array-contains', userId),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(chatsQuery);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

export default {
  createLinkupGroupChat,
  addUserToLinkupChat,
  removeUserFromLinkupChat,
  sendMessageToLinkupChat,
  addSystemMessage,
  subscribeLinkupChat,
  subscribeLinkupMessages,
  markLinkupChatAsRead,
  subscribeUserLinkupChats,
  promoteToAdmin,
  demoteFromAdmin,
  deleteMessage,
  getUnreadLinkupChatsCount,
};
