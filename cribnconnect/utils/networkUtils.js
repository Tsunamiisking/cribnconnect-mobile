import * as Network from 'expo-network';

/**
 * Check if device is connected to internet
 * @returns {Promise<boolean>}
 */
export const isConnected = async () => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected;
  } catch (error) {
    console.error('Error checking network status:', error);
    return false;
  }
};

/**
 * Subscribe to network status changes
 * @param {Function} callback - Called with boolean when network status changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNetworkChanges = (callback) => {
  const subscription = Network.addNetworkStateListener((networkState) => {
    callback(networkState.isConnected);
  });
  
  // Return cleanup function
  return () => {
    subscription?.remove();
  };
};

export default {
  isConnected,
  subscribeToNetworkChanges
};