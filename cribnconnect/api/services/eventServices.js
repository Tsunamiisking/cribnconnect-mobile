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
