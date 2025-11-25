import api from '../api';

/**
 * Get all notifications for the current user
 */
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Approve a join request
 */
export const approveJoinRequest = async (linkupId, requestId) => {
  try {
    const response = await api.post(`/linkups/${linkupId}/approve-request`, {
      requestId
    });
    return response.data;
  } catch (error) {
    console.error('Error approving join request:', error);
    throw error;
  }
};

/**
 * Reject a join request
 */
export const rejectJoinRequest = async (linkupId, requestId) => {
  try {
    const response = await api.post(`/linkups/${linkupId}/reject-request`, {
      requestId
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting join request:', error);
    throw error;
  }
};
