/**
 * Calculates the distance between two geographical points using the Haversine formula
 * @param {Object} pointA - First point with coordinates {latitude, longitude}
 * @param {Object} pointB - Second point with coordinates {latitude, longitude}
 * @returns {Object} - Distance in different formats { kilometers, miles, formatted }
 */
export const calculateDistance = (pointA, pointB) => {
  // If either point is missing, return null
  if (!pointA?.coordinates || !pointB?.coordinates) {
    return null;
  }

  // Convert GeoJSON coordinates [longitude, latitude] to {latitude, longitude}
  const point1 = {
    latitude: pointA.coordinates[1],
    longitude: pointA.coordinates[0]
  };
  const point2 = {
    latitude: pointB.coordinates[1],
    longitude: pointB.coordinates[0]
  };

  // Earth's radius in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const lat1 = toRadians(point1.latitude);
  const lon1 = toRadians(point1.longitude);
  const lat2 = toRadians(point2.latitude);
  const lon2 = toRadians(point2.longitude);

  // Differences in coordinates
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Calculate distances
  const kilometers = R * c;
  const miles = kilometers * 0.621371;

  // Format the distance string
  let formatted;
  if (kilometers < 1) {
    formatted = `${Math.round(kilometers * 1000)}m away`;
  } else if (kilometers < 100) {
    formatted = `${kilometers.toFixed(1)}km away`;
  } else {
    formatted = `${Math.round(kilometers)}km away`;
  }

  return {
    kilometers,
    miles,
    formatted
  };
};

/**
 * Helper function to convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Formats a raw distance in kilometers into a human-readable string
 * @param {number} kilometers - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (kilometers) => {
  if (typeof kilometers !== 'number') return 'Distance unknown';
  
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)}m away`;
  } else if (kilometers < 100) {
    return `${kilometers.toFixed(1)}km away`;
  } else {
    return `${Math.round(kilometers)}km away`;
  }
};
