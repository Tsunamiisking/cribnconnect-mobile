import NetInfo from '@react-native-community/netinfo';

/**
 * Check if device is connected to internet
 * @returns {Promise<boolean>}
 */
export const isConnected = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
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
  return NetInfo.addEventListener(state => {
    callback(state.isConnected && state.isInternetReachable);
  });
};

export default {
  isConnected,
  subscribeToNetworkChanges
};
