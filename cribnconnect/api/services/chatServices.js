import api from "../api";

/**
 * Initiate a new private chat conversation with a user
 * Creates a conversation with 'pending' status in Firestore
 * User can only send ONE message until accepted
 * 
 * POST /api/chats/initiate
 */
export const initiateChat = async (recipientId, message) => {
  try {
    const response = await api.post("/chats/initiate", {
      recipientId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating chat:", error);
    throw error;
  }
};

/**
 * Accept a pending chat request
 * Changes status from 'pending' to 'accepted'
 * Both users can now message freely
 * 
 * PUT /api/chats/:conversationId/accept
 */
export const acceptChatRequest = async (conversationId) => {
  try {
    const response = await api.put(`/chats/${conversationId}/accept`);
    return response.data;
  } catch (error) {
    console.error("Error accepting chat:", error);
    throw error;
  }
};

/**
 * Ignore a pending chat request
 * Changes status to 'ignored'
 * Initiator blocked from sending more messages
 * 
 * PUT /api/chats/:conversationId/ignore
 */
export const ignoreChatRequest = async (conversationId) => {
  try {
    const response = await api.put(`/chats/${conversationId}/ignore`);
    return response.data;
  } catch (error) {
    console.error("Error ignoring chat:", error);
    throw error;
  }
};

/**
 * Get all conversations for the current user
 * Includes pending, accepted, and ignored chats
 * 
 * GET /api/chats
 */
export const getConversations = async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get("/chats", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

/**
 * Get pending chat requests only
 * 
 * GET /api/chats?status=pending
 */
export const getPendingChatRequests = async () => {
  try {
    const response = await api.get("/chats", { params: { status: "pending" } });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw error;
  }
};

/**
 * Get a specific conversation by ID
 * 
 * GET /api/chats/:conversationId
 */
export const getConversation = async (conversationId) => {
  try {
    const response = await api.get(`/chats/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

/**
 * Check if a conversation exists with a user
 * This is a client-side helper that fetches all conversations
 * and filters by the other user's ID
 */
export const checkExistingConversation = async (userId) => {
  try {
    const response = await getConversations();
    const conversations = response.conversations || [];
    
    // Find conversation where the other user matches
    const existing = conversations.find(conv => 
      conv.otherUser?.uid === userId
    );
    
    return existing || null;
  } catch (error) {
    console.error("Error checking conversation:", error);
    throw error;
  }
};

/**
 * Client-side validation: Check if user can send message
 * Based on conversation status and user role
 */
export const canSendMessage = (conversation, currentUserId) => {
  if (!conversation) return false;
  
  // If chat is accepted, anyone can send
  if (conversation.status === 'accepted') {
    return true;
  }
  
  // If chat is pending
  if (conversation.status === 'pending') {
    // Initiator can only send if messageCount is 0 (first message only)
    if (conversation.initiatorId === currentUserId) {
      return conversation.messageCount === 0;
    }
    // Recipient cannot send until they accept
    return false;
  }
  
  // If chat is ignored, no one can send
  if (conversation.status === 'ignored') {
    return false;
  }
  
  return false;
};
