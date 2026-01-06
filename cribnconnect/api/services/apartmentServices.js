import api from "../api";

export const getApartments = async () => {
  const res = await api.get("/apartments");
  return res.data;
};

export const createApartment = async (data) => {
  try {
    const formData = new FormData();
    
    // 1. Add simple string fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('apartmentType', data.apartmentType);
    formData.append('apartmentCategory', data.apartmentCategory);
    
    // 2. Add number fields as strings
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('privateBathrooms', data.privateBathrooms.toString());
    formData.append('publicBathrooms', data.publicBathrooms.toString());
    formData.append('sharedBathrooms', data.sharedBathrooms.toString());
    formData.append('pricePerNight', data.pricePerNight.toString());
    formData.append('pricePerWeek', data.pricePerWeek.toString());
    formData.append('maxGuests', data.maxGuests.toString());
    
    // 3. Add boolean fields as strings
    formData.append('isAvailable', data.isAvailable.toString());
    formData.append('isPublished', data.isPublished.toString());
    formData.append('partiesAllowed', data.partiesAllowed.toString());
    
    // 4. Add nested objects as JSON strings
    formData.append('address', JSON.stringify(data.address));
    formData.append('complex', JSON.stringify(data.complex));
    
    // 5. Add availability with ISO string dates
    formData.append('availability', JSON.stringify({
      from: data.availability?.from ? new Date(data.availability.from).toISOString() : null,
      to: data.availability?.to ? new Date(data.availability.to).toISOString() : null
    }));
    
    // 6. Add arrays as JSON strings
    formData.append('basicAmenities', JSON.stringify(data.basicAmenities));
    formData.append('sharedAmenities', JSON.stringify(data.sharedAmenities));
    formData.append('luxuryAmenities', JSON.stringify(data.luxuryAmenities));
    formData.append('otherAmenities', JSON.stringify(data.otherAmenities));
    formData.append('specialPerks', JSON.stringify(data.specialPerks));
    formData.append('houseRules', JSON.stringify(data.houseRules));
    
    // 7. ✅ CORRECT: Add actual media files (not metadata)
    if (data.media && data.media.length > 0) {
      for (const mediaItem of data.media) {
        // Create file object from local URI
        formData.append('files', {
          uri: mediaItem.localUri,
          type: mediaItem.mimeType || 'image/jpeg',
          name: mediaItem.filename || `media_${Date.now()}.${mediaItem.format || 'jpg'}`
        });
      }
    }
    
    console.log('Submitting FormData with', data.media?.length || 0, 'media files');
    
    // 8. Send request
    const res = await api.post("/apartments", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error creating apartment:', error.response?.data || error.message);
    throw error;
  }
};

export const getApartmentById = async (id) => {
  const res = await api.get(`/apartments/${id}`);
  return res.data;
};

export const getMyApartments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (params.isPublished !== undefined) {
      queryParams.append('isPublished', params.isPublished);
    }
    if (params.isAvailable !== undefined) {
      queryParams.append('isAvailable', params.isAvailable);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.order) {
      queryParams.append('order', params.order);
    }
    
    const queryString = queryParams.toString();
    const url = `/apartments/user/my-apartments${queryString ? `?${queryString}` : ''}`;
    
    // console.log('Fetching my apartments from:', url);
    const res = await api.get(url);
    // console.log('Fetched my apartments response:', JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error('Error fetching my apartments:', error.response?.data || error.message);
    throw error;
  }
};

export const updateApartment = async (id, data) => {
  try {
    // Send partial update as JSON. Backend should accept fields such as
    // basicAmenities, luxuryAmenities, sharedAmenities, otherAmenities.
    const res = await api.put(`/apartments/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating apartment:', error.response?.data || error.message);
    throw error;
  }
};

export const getHotApartments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.apartmentCategory) queryParams.append('apartmentCategory', params.apartmentCategory);
    
    const res = await api.get(`/apartments/hot?${queryParams.toString()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching hot apartments:', error.response?.data || error.message);
    throw error;
  }
};

export const getNearbyApartments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters for location-based search
    if (params.latitude) queryParams.append('latitude', params.latitude);
    if (params.longitude) queryParams.append('longitude', params.longitude);
    if (params.radius) queryParams.append('radius', params.radius); // in kilometers
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const res = await api.get(`/apartments/nearby?${queryParams.toString()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching nearby apartments:', error.response?.data || error.message);
    throw error;
  }
};
