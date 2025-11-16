/**
 * Transform apartment data from API response to the format expected by components
 * @param {Object} apiData - Raw apartment data from API
 * @returns {Object} Transformed apartment data
 */
export const transformApartmentData = (apiData) => {
  if (!apiData) return null;

  // Helper to safely access nested properties
  const safeGet = (obj, path, defaultValue = '') => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result?.[key] !== undefined) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    return result;
  };

  return {
    id: apiData._id || apiData.id,
    
    // Basic info
    apartmentType: apiData.apartmentType || 'Apartment',
    space: apiData.apartmentCategory || 'Whole Space',
    
    // Host info
    hostId: apiData.hostId?._id || apiData.hostId || apiData.userId,
    isPublished: apiData.isPublished ?? true,
    isAvailable: apiData.isAvailable ?? true,
    
    // Rooms - map backend fields to component expectations
    rooms: {
      beds: (apiData.bedrooms || 0).toString(),
      rooms: (apiData.bedrooms || 0).toString(),
      privateBathIn: (apiData.privateBathrooms || 0).toString(),
      privateBathOut: '0',
      sharedBath: (apiData.publicBathrooms || apiData.sharedBathrooms || 0).toString(),
    },
    
    // Location - map address and complex
    location: {
      complexType: apiData.complex?.name ? 'yes' : 'no',
      complexName: apiData.complex?.name || '',
      address: apiData.address?.street || apiData.address?.address || '',
      state: apiData.address?.state || '',
      city: apiData.address?.city || '',
      zip: apiData.address?.zipCode || apiData.address?.zip || '',
      country: apiData.address?.country || 'Nigeria',
    },
    
    // Details
    details: {
      title: apiData.title || 'Untitled Apartment',
      description: apiData.description || 'No description available',
    },
    
    // Amenities - keep categories separated
    amenities: {
      basic: apiData.basicAmenities || [],
      luxury: apiData.luxuryAmenities || [],
      shared: apiData.sharedAmenities || [],
      other: (apiData.otherAmenities || []).join(', '),
      specialPerks: apiData.specialPerks || [],
    },
    
    // Pricing
    pricing: {
      perNight: (apiData.pricePerNight || 0).toString(),
      perWeek: apiData.pricePerWeek ? apiData.pricePerWeek.toString() : '',
      perMonth: apiData.pricePerMonth ? apiData.pricePerMonth.toString() : '',
    },
    
    // Stats (may not be available from backend)
    stats: {
      views: apiData.views || 0,
      bookings: apiData.bookings || 0,
      revenue: apiData.revenue || 0,
    },
    
    // Media - transform media array
    media: (apiData.media || []).map((mediaItem, index) => ({
      resource_type: mediaItem.resourceType || mediaItem.resource_type || 'image',
      localUri: mediaItem.url || mediaItem.localUri || mediaItem.uri,
      url: mediaItem.url,
      localThumbnail: mediaItem.thumbnailUrl || mediaItem.thumbnail_url || mediaItem.url,
      thumbnail_url: mediaItem.thumbnailUrl || mediaItem.thumbnail_url,
      width: mediaItem.width || 1920,
      height: mediaItem.height || 1080,
      publicId: mediaItem.publicId,
    })),
    
    // House rules
    houseRules: apiData.houseRules || [],
    
    // Max guests
    maxGuests: (apiData.maxGuests || 1).toString(),
    
    // Availability
    availability: apiData.availability || {},
    
    // Special perks
    specialPerks: apiData.specialPerks || [],
    
    // Parties allowed
    partiesAllowed: apiData.partiesAllowed ?? false,
    
    // Created/Updated timestamps
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
};

/**
 * Validate if apartment data has required fields for display
 * @param {Object} apartment - Transformed apartment data
 * @returns {boolean} True if data is valid
 */
export const validateApartmentData = (apartment) => {
  if (!apartment) return false;
  
  const hasBasicInfo = apartment.details?.title && apartment.apartmentType;
  const hasLocation = apartment.location?.city && apartment.location?.state;
  const hasPricing = apartment.pricing?.perNight;
  
  return hasBasicInfo && hasLocation && hasPricing;
};

/**
 * Get display name for apartment category
 * @param {string} category - Apartment category from backend
 * @returns {string} Display name
 */
export const getSpaceDisplayName = (category) => {
  const categoryMap = {
    'entire': 'Whole Space',
    'private': 'Private Room',
    'shared': 'Shared Room',
  };
  
  return categoryMap[category?.toLowerCase()] || category || 'Whole Space';
};
