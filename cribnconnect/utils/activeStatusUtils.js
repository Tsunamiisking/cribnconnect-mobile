/**
 * Utility functions for active status display
 */

/**
 * Check if a user is currently online based on lastSeen timestamp
 * User is considered online if lastSeen is within the last 5 minutes
 * 
 * @param {Date|string} lastSeen - The last seen timestamp
 * @returns {boolean} - Whether the user is online
 */
export const isUserOnline = (lastSeen) => {
  if (!lastSeen) return false;
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  return lastSeenDate >= fiveMinutesAgo;
};

/**
 * Get human-readable status text from lastSeen timestamp
 * 
 * @param {Date|string} lastSeen - The last seen timestamp
 * @param {boolean} isOnline - Whether the user is currently online
 * @returns {string} - Human-readable status text
 */
export const getStatusText = (lastSeen, isOnline = null) => {
  // If isOnline is explicitly passed, use it
  if (isOnline === true) return 'Active now';
  
  // Otherwise check lastSeen
  if (!lastSeen) return 'Offline';
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const minutesAgo = Math.floor((now - lastSeenDate) / 60000);
  
  // Less than 5 minutes = Active now
  if (minutesAgo < 5) return 'Active now';
  
  // Less than 60 minutes = X minutes ago
  if (minutesAgo < 60) return `Active ${minutesAgo}m ago`;
  
  // Less than 24 hours = X hours ago
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `Active ${hoursAgo}h ago`;
  
  // More than 24 hours = X days ago
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return `Active ${daysAgo}d ago`;
  
  // More than 7 days = show date
  return `Last seen ${lastSeenDate.toLocaleDateString()}`;
};

/**
 * Get relative time string (e.g., "2m ago", "1h ago")
 * 
 * @param {Date|string} timestamp - The timestamp
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);
  
  if (secondsAgo < 60) return 'just now';
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return `${daysAgo}d ago`;
  
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) return `${weeksAgo}w ago`;
  
  return date.toLocaleDateString();
};

/**
 * Format last seen for display in lists/cards
 * 
 * @param {Date|string} lastSeen - The last seen timestamp
 * @returns {string} - Formatted last seen text
 */
export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return 'Never';
  
  if (isUserOnline(lastSeen)) return 'Online';
  
  return getRelativeTime(lastSeen);
};
