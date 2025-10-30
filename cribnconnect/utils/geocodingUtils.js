const OPENCAGE_API_KEY = '4fa06087f37c43a2b492c83e2575024b';
const OPENCAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

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
    const query = `${latitude},${longitude}`;
    const url = `${OPENCAGE_API_URL}?q=${query}&key=${OPENCAGE_API_KEY}&no_annotations=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0].components;
      
      // Extract county, state, and country
      const county = result.county;
      const state = result.state;
      const country = result.country;
      
      // Build the address string with available components
      const addressParts = [];
      if (county) addressParts.push(county);
      if (state) addressParts.push(state);
      if (country) addressParts.push(country);
      
      // If no components are available, return default message
      if (addressParts.length === 0) {
        return "Location not available";
      }
      
      return addressParts.join(', ');
    }
    return "Location not available";
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "Location not available";
  }
}

/**
 * Convert address to coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<Array>} - [longitude, latitude]
 */
export const forwardGeocode = async (address) => {
  try {
    const url = `${OPENCAGE_API_URL}?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&no_annotations=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return [lng, lat]; // Return in [longitude, latitude] format for GeoJSON
    }
    return null;
  } catch (error) {
    console.error("Error forward geocoding:", error);
    return null;
  }
};