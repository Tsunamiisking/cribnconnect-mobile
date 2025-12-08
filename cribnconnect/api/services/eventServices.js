import { auth } from "@/config/firebase";
import { createEventGroupChat } from "@/services/eventChatService";
import api from "../api";

export const getEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const createEvent = async (data) => {
  try {
    const formData = new FormData();
    
    // 1. Add simple string fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('eventType', data.eventType);
    
    // 2. Add time fields
    formData.append('time', data.time);
    if (data.endTime) {
      formData.append('endTime', data.endTime);
    }
    if (data.duration) {
      formData.append('duration', data.duration.toString());
    }
    
    // 3. Add date as ISO string
    if (data.date) {
      formData.append('date', new Date(data.date).toISOString());
    }
    
    // 4. Add number fields as strings
    formData.append('capacity', data.capacity.toString());
    
    // 5. Add boolean fields as strings
    formData.append('isFree', data.isFree.toString());
    formData.append('isPublished', data.isPublished.toString());
    formData.append('isActive', data.isActive.toString());
    
    // 6. Add status
    formData.append('status', data.status);
    
    // 7. Add nested objects as JSON strings
    formData.append('location', JSON.stringify(data.location));
    
    // 8. Add arrays as JSON strings
    formData.append('ticketTypes', JSON.stringify(data.ticketTypes || []));
    formData.append('eventSpecialPerks', JSON.stringify(data.eventSpecialPerks || []));
    formData.append('eventSafetyTips', JSON.stringify(data.eventSafetyTips || []));
    
    // 9. ✅ CORRECT: Add actual media files (not metadata)
    if (data.media && data.media.length > 0) {
      for (const mediaItem of data.media) {
        // Create file object from local URI
        formData.append('files', {
          uri: mediaItem.localUri,
          type: mediaItem.mimeType || 'image/jpeg',
          name: mediaItem.filename || `event_media_${Date.now()}.${mediaItem.format || 'jpg'}`
        });
      }
    }
    
    console.log('Submitting Event FormData with', data.media?.length || 0, 'media files');
    
    // 10. Send request
    const res = await api.post("/events", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    // 11. Create event group chat in Firestore
    try {
      const currentUser = auth.currentUser;
      if (currentUser && res.data?.event) {
        const eventId = res.data.event._id;
        const eventPhoto = res.data.event.media?.[0]?.url || null;
        
        console.log('Creating event group chat for event:', eventId);
        
        await createEventGroupChat(
          eventId,
          {
            name: data.title,
            photo: eventPhoto,
            description: data.description,
            isFree: data.isFree,
          },
          currentUser.uid,
          {
            name: currentUser.displayName || 'Unknown User',
            photoURL: currentUser.photoURL || null,
          }
        );
        
        console.log('Event group chat created successfully');
      }
    } catch (chatError) {
      console.error('Failed to create event group chat:', chatError);
      // Don't fail the entire event creation if chat creation fails
    }
    
    return res.data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    throw error;
  }
};

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const getMyEvents = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (params.status) {
      queryParams.append('status', params.status);
    }
    if (params.isPublished !== undefined) {
      queryParams.append('isPublished', params.isPublished);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.order) {
      queryParams.append('order', params.order);
    }
    
    const queryString = queryParams.toString();
    const url = `/events/user/my-events${queryString ? `?${queryString}` : ''}`;
    
    // console.log('Fetching my events from:', url);
    const res = await api.get(url);
    // console.log('Fetched my events response:', JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error('Error fetching my events:', error.response?.data || error.message);
    throw error;
  }
};

// Update event location
export const updateEventLocation = async (eventId, location) => {
  try {
    const res = await api.put(`/events/${eventId}/location`, { location });
    return res.data;
  } catch (error) {
    console.error('Error updating event location:', error.response?.data || error.message);
    throw error;
  }
};

// Update event date and time
export const updateEventDateTime = async (eventId, dateTime) => {
  try {
    const res = await api.put(`/events/${eventId}/datetime`, dateTime);
    return res.data;
  } catch (error) {
    console.error('Error updating event date/time:', error.response?.data || error.message);
    throw error;
  }
};

// Update event safety tips
export const updateEventSafety = async (eventId, safetyTips) => {
  try {
    const res = await api.put(`/events/${eventId}/safety`, { eventSafetyTips: safetyTips });
    return res.data;
  } catch (error) {
    console.error('Error updating event safety tips:', error.response?.data || error.message);
    throw error;
  }
};

// Cancel event (with refunds)
export const cancelEvent = async (eventId) => {
  try {
    const res = await api.put(`/events/${eventId}/cancel`);
    return res.data;
  } catch (error) {
    console.error('Error canceling event:', error.response?.data || error.message);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (eventId) => {
  try {
    const res = await api.delete(`/events/${eventId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting event:', error.response?.data || error.message);
    throw error;
  }
};
