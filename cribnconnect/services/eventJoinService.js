/**
 * Event Join Service
 * Handles joining events and automatically adding users to event group chats
 */

import { addUserToEventChat } from './eventChatService';

/**
 * Join a free event and add user to event group chat
 * @param {string} eventId - The event ID
 * @param {string} userId - User's Firebase UID
 * @param {Object} userInfo - User information
 * @param {string} userInfo.name - User's username
 * @param {string} userInfo.photoURL - User's photo URL
 * @param {boolean} isFree - Whether the event is free
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const joinEvent = async (eventId, userId, userInfo, isFree) => {
  try {
    if (!isFree) {
      return {
        success: false,
        message: 'This is a paid event. Please purchase a ticket to join.',
      };
    }

    // TODO: Add MongoDB logic to mark user as attending the event
    // This will be implemented when you add the backend endpoint
    // Example: await api.post(`/events/${eventId}/join`);

    // Add user to event group chat
    await addUserToEventChat(eventId, userId, userInfo);

    return {
      success: true,
      message: 'Successfully joined the event! You can now chat with other attendees.',
    };
  } catch (error) {
    console.error('Error joining event:', error);
    return {
      success: false,
      message: error.message || 'Failed to join event. Please try again.',
    };
  }
};

/**
 * Leave an event and remove user from event group chat
 * @param {string} eventId - The event ID
 * @param {string} userId - User's Firebase UID
 * @param {string} userName - User's name
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const leaveEvent = async (eventId, userId, userName) => {
  try {
    // TODO: Add MongoDB logic to mark user as not attending the event
    // This will be implemented when you add the backend endpoint
    // Example: await api.post(`/events/${eventId}/leave`);

    // Remove user from event group chat
    const { removeUserFromEventChat } = require('./eventChatService');
    await removeUserFromEventChat(eventId, userId, userName);

    return {
      success: true,
      message: 'Successfully left the event.',
    };
  } catch (error) {
    console.error('Error leaving event:', error);
    return {
      success: false,
      message: error.message || 'Failed to leave event. Please try again.',
    };
  }
};

export default {
  joinEvent,
  leaveEvent,
};
