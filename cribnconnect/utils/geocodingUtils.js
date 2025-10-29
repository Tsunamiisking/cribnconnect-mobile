import NodeGeocoder from 'node-geocoder';

const OPENCAGE_API_KEY = '4fa06087f37c43a2b492c83e2575024b';

const geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: OPENCAGE_API_KEY
});

/**
 * Convert coordinates to address
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {Promise<string>} - Formatted address
 */
export const reverseGeocode = async (coordinates) => {
  try {
    if (!coordinates || coordinates.length !== 2) {
      return "Location not available";
    }
    
    // OpenCage expects "latitude, longitude"
    const [longitude, latitude] = coordinates;
    const res = await geocoder.reverse({ lat: latitude, lon: longitude });
    
    if (res && res.length > 0) {
      // Format the address to show only city and state/country
      const { city, state, country } = res[0];
      if (city && (state || country)) {
        return `${city}, ${state || country}`;
      }
      return res[0].formattedAddress;
    }
    return "Location not available";
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "Location not available";
  }
};

/**
 * Convert address to coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<Array>} - [longitude, latitude]
 */
export const forwardGeocode = async (address) => {
  try {
    const res = await geocoder.geocode(address);
    if (res && res.length > 0) {
      const { latitude, longitude } = res[0];
      return [longitude, latitude]; // Return in [longitude, latitude] format for GeoJSON
    }
    return null;
  } catch (error) {
    console.error("Error forward geocoding:", error);
    return null;
  }
};