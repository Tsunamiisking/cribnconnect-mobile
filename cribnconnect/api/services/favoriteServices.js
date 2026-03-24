import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isConnected } from '../../utils/networkUtils';

// AsyncStorage keys for favorites system
const FAVORITES_CACHE_KEY = 'favorites_cache';
const FAVORITES_LAST_SYNC_KEY = 'favorites_last_sync';
const FAVORITES_PENDING_QUEUE_KEY = 'favorites_pending_queue';

// Cache configuration
const CACHE_EXPIRY_HOURS = 24; // Refresh cache every 24 hours

// ============================================
// SERVER API CALLS
// ============================================

/**
 * Fetch all favorites from server for the current user
 * @returns {Promise<Array>} Array of favorite items
 */
export const fetchFavoritesFromServer = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites from server:', error);
    throw error;
  }
};

/**
 * Add item to favorites on server
 * @param {string} itemType - Type of item (event, linkup, apartment, person)
 * @param {string} itemId - ID of the item to favorite
 * @param {Object} metadata - Optional metadata about the favorited item
 * @returns {Promise<Object>} Created favorite object
 */
export const addFavoriteToServer = async (itemType, itemId, metadata = {}) => {
  try {
    const response = await api.post('/favorites', {
      itemType,
      itemId,
      metadata
    });
    return response.data.favorite;
  } catch (error) {
    console.error('Error adding favorite to server:', error);
    throw error;
  }
};

/**
 * Remove item from favorites on server
 * @param {string} favoriteId - ID of the favorite record to delete
 * @returns {Promise<void>}
 */
export const removeFavoriteFromServer = async (favoriteId) => {
  try {
    await api.delete(`/favorites/${favoriteId}`);
  } catch (error) {
    console.error('Error removing favorite from server:', error);
    throw error;
  }
};

/**
 * Batch sync favorites with server
 * @param {number} lastSyncTimestamp - Last sync timestamp in milliseconds
 * @returns {Promise<Object>} Server sync response with additions/deletions
 */
export const batchSyncFavorites = async (lastSyncTimestamp) => {
  try {
    const response = await api.get('/favorites/sync', {
      params: { since: lastSyncTimestamp }
    });
    return response.data;
  } catch (error) {
    console.error('Error syncing favorites with server:', error);
    throw error;
  }
};

/**
 * Batch add favorites to server
 * @param {Array} favorites - Array of favorites to add
 * @returns {Promise<Object>} Batch operation result
 */
export const batchAddFavorites = async (favorites) => {
  try {
    const response = await api.post('/favorites/batch', { favorites });
    return response.data;
  } catch (error) {
    console.error('Error batch adding favorites:', error);
    throw error;
  }
};

/**
 * Batch delete favorites from server
 * @param {Array} favoriteIds - Array of favorite IDs to delete
 * @returns {Promise<void>}
 */
export const batchDeleteFavorites = async (favoriteIds) => {
  try {
    await api.delete('/favorites/batch', { data: { favoriteIds } });
  } catch (error) {
    console.error('Error batch deleting favorites:', error);
    throw error;
  }
};

// ============================================
// LOCAL CACHE MANAGEMENT
// ============================================

/**
 * Get favorites from local cache
 * @returns {Promise<Array>} Cached favorites array
 */
export const getFavoritesFromCache = async () => {
  try {
    const cached = await AsyncStorage.getItem(FAVORITES_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error reading favorites cache:', error);
    return [];
  }
};

/**
 * Save favorites to local cache
 * @param {Array} favorites - Favorites array to cache
 * @returns {Promise<void>}
 */
export const saveFavoritesToCache = async (favorites) => {
  try {
    await AsyncStorage.setItem(FAVORITES_CACHE_KEY, JSON.stringify(favorites));
    await AsyncStorage.setItem(FAVORITES_LAST_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving favorites to cache:', error);
  }
};

/**
 * Get last sync timestamp
 * @returns {Promise<number>} Timestamp in milliseconds
 */
export const getLastSyncTimestamp = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(FAVORITES_LAST_SYNC_KEY);
    return timestamp ? parseInt(timestamp, 10) : 0;
  } catch (error) {
    console.error('Error reading last sync timestamp:', error);
    return 0;
  }
};

/**
 * Check if cache should be refreshed
 * @returns {Promise<boolean>}
 */
export const shouldRefreshCache = async () => {
  try {
    const lastSync = await getLastSyncTimestamp();
    if (lastSync === 0) return true;
    
    const hoursSinceSync = (Date.now() - lastSync) / (1000 * 60 * 60);
    return hoursSinceSync >= CACHE_EXPIRY_HOURS;
  } catch (error) {
    console.error('Error checking cache freshness:', error);
    return true;
  }
};

/**
 * Clear favorites cache
 * @returns {Promise<void>}
 */
export const clearFavoritesCache = async () => {
  try {
    await AsyncStorage.multiRemove([
      FAVORITES_CACHE_KEY,
      FAVORITES_LAST_SYNC_KEY,
      FAVORITES_PENDING_QUEUE_KEY
    ]);
  } catch (error) {
    console.error('Error clearing favorites cache:', error);
  }
};

// ============================================
// PENDING QUEUE FOR OFFLINE OPERATIONS
// ============================================

/**
 * Get pending operations queue
 * @returns {Promise<Array>} Array of pending operations
 */
export const getPendingQueue = async () => {
  try {
    const queue = await AsyncStorage.getItem(FAVORITES_PENDING_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error reading pending queue:', error);
    return [];
  }
};

/**
 * Add operation to pending queue
 * @param {Object} operation - Operation object {type: 'add'|'remove', itemType, itemId, favoriteId, timestamp}
 * @returns {Promise<void>}
 */
export const addToPendingQueue = async (operation) => {
  try {
    const queue = await getPendingQueue();
    queue.push({
      ...operation,
      timestamp: Date.now()
    });
    await AsyncStorage.setItem(FAVORITES_PENDING_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to pending queue:', error);
  }
};

/**
 * Process pending operations queue
 * Attempts to sync all pending favorites operations with server
 * @returns {Promise<Object>} Result object with success count and failures
 */
export const processPendingQueue = async () => {
  try {
    const queue = await getPendingQueue();
    if (queue.length === 0) {
      return { processed: 0, failed: 0 };
    }

    const results = {
      processed: 0,
      failed: 0,
      failures: []
    };

    // Process each pending operation
    for (const operation of queue) {
      try {
        if (operation.type === 'add') {
          await addFavoriteToServer(operation.itemType, operation.itemId, operation.metadata);
        } else if (operation.type === 'remove') {
          await removeFavoriteFromServer(operation.favoriteId);
        }
        results.processed++;
      } catch (error) {
        results.failed++;
        results.failures.push({
          operation,
          error: error.message
        });
      }
    }

    // Clear successfully processed operations
    if (results.failed === 0) {
      await AsyncStorage.removeItem(FAVORITES_PENDING_QUEUE_KEY);
    } else {
      // Keep failed operations in queue
      await AsyncStorage.setItem(
        FAVORITES_PENDING_QUEUE_KEY,
        JSON.stringify(results.failures.map(f => f.operation))
      );
    }

    return results;
  } catch (error) {
    console.error('Error processing pending queue:', error);
    return { processed: 0, failed: queue.length };
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if item is favorited (checks local cache + pending queue)
 * @param {string} itemType - Type of item
 * @param {string} itemId - ID of item
 * @returns {Promise<boolean>}
 */
export const isFavoritedLocally = async (itemType, itemId) => {
  try {
    // Check cache
    const favorites = await getFavoritesFromCache();
    const inCache = favorites.some(
      fav => fav.itemType === itemType && fav.itemId === itemId
    );
    
    if (inCache) return true;

    // Check pending queue for add operations
    const queue = await getPendingQueue();
    const inQueue = queue.some(
      op => op.type === 'add' && op.itemType === itemType && op.itemId === itemId
    );

    return inQueue;
  } catch (error) {
    console.error('Error checking if favorited locally:', error);
    return false;
  }
};

/**
 * Get favorites by type
 * @param {string} itemType - Type to filter by (event, linkup, apartment, person)
 * @returns {Promise<Array>} Filtered favorites
 */
export const getFavoritesByType = async (itemType) => {
  try {
    const favorites = await getFavoritesFromCache();
    return favorites.filter(fav => fav.itemType === itemType);
  } catch (error) {
    console.error('Error getting favorites by type:', error);
    return [];
  }
};

/**
 * Get favorite IDs for quick lookup
 * @param {string} itemType - Optional type filter
 * @returns {Promise<Set>} Set of favorite item IDs
 */
export const getFavoriteIds = async (itemType = null) => {
  try {
    const favorites = await getFavoritesFromCache();
    const filtered = itemType 
      ? favorites.filter(fav => fav.itemType === itemType)
      : favorites;
    
    return new Set(filtered.map(fav => fav.itemId));
  } catch (error) {
    console.error('Error getting favorite IDs:', error);
    return new Set();
  }
};

/**
 * Get cache statistics for monitoring
 * @returns {Promise<Object>} Cache stats
 */
export const getFavoritesStats = async () => {
  try {
    const favorites = await getFavoritesFromCache();
    const lastSync = await getLastSyncTimestamp();
    const queue = await getPendingQueue();
    
    const hoursSinceSync = lastSync > 0 
      ? (Date.now() - lastSync) / (1000 * 60 * 60)
      : null;

    return {
      totalFavorites: favorites.length,
      byType: favorites.reduce((acc, fav) => {
        acc[fav.itemType] = (acc[fav.itemType] || 0) + 1;
        return acc;
      }, {}),
      lastSyncHoursAgo: hoursSinceSync,
      pendingOperations: queue.length,
      cacheNeedsRefresh: hoursSinceSync >= CACHE_EXPIRY_HOURS
    };
  } catch (error) {
    console.error('Error getting favorites stats:', error);
    return null;
  }
};

// ============================================
// MAIN FAVORITES OPERATIONS
// ============================================

/**
 * Add item to favorites with offline support
 * @param {string} itemType - Type of item
 * @param {string} itemId - ID of item
 * @param {Object} metadata - Optional metadata
 * @returns {Promise<Object>} Operation result
 */
export const addFavorite = async (itemType, itemId, metadata = {}) => {
  try {
    const online = await isConnected();
    
    // Optimistic update to cache
    const favorites = await getFavoritesFromCache();
    const newFavorite = {
      id: `temp_${Date.now()}`, // Temporary ID until synced
      itemType,
      itemId,
      metadata,
      userId: 'current', // Will be set by server
      createdAt: new Date().toISOString(),
      _pending: !online
    };
    
    favorites.push(newFavorite);
    await saveFavoritesToCache(favorites);

    if (online) {
      // Try to sync immediately
      try {
        const serverFavorite = await addFavoriteToServer(itemType, itemId, metadata);
        
        // Update cache with server response
        const updatedFavorites = favorites.map(fav => 
          fav.id === newFavorite.id ? serverFavorite : fav
        );
        await saveFavoritesToCache(updatedFavorites);
        
        return { success: true, favorite: serverFavorite, synced: true };
      } catch (error) {
        // If server fails, queue for later
        await addToPendingQueue({ type: 'add', itemType, itemId, metadata });
        return { success: true, favorite: newFavorite, synced: false };
      }
    } else {
      // Queue for sync when online
      await addToPendingQueue({ type: 'add', itemType, itemId, metadata });
      return { success: true, favorite: newFavorite, synced: false };
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

/**
 * Remove item from favorites with offline support
 * @param {string} itemType - Type of item
 * @param {string} itemId - ID of item
 * @returns {Promise<Object>} Operation result
 */
export const removeFavorite = async (itemType, itemId) => {
  try {
    const online = await isConnected();
    
    // Get current favorites
    const favorites = await getFavoritesFromCache();
    const favorite = favorites.find(
      fav => fav.itemType === itemType && fav.itemId === itemId
    );
    
    if (!favorite) {
      return { success: false, error: 'Favorite not found' };
    }

    // Optimistic removal from cache
    const updatedFavorites = favorites.filter(
      fav => !(fav.itemType === itemType && fav.itemId === itemId)
    );
    await saveFavoritesToCache(updatedFavorites);

    if (online && !favorite.id.startsWith('temp_')) {
      // Try to sync immediately
      try {
        await removeFavoriteFromServer(favorite.id);
        return { success: true, synced: true };
      } catch (error) {
        // If server fails, queue for later
        await addToPendingQueue({ type: 'remove', favoriteId: favorite.id });
        return { success: true, synced: false };
      }
    } else {
      // Queue for sync when online (or if it's a temp ID)
      if (!favorite.id.startsWith('temp_')) {
        await addToPendingQueue({ type: 'remove', favoriteId: favorite.id });
      }
      return { success: true, synced: false };
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

/**
 * Sync favorites with server - fetch latest and process pending queue
 * @returns {Promise<Object>} Sync result
 */
export const syncFavorites = async () => {
  try {
    const online = await isConnected();
    if (!online) {
      return { success: false, error: 'No internet connection' };
    }

    // Process pending queue first
    const queueResult = await processPendingQueue();

    // Fetch latest from server
    const serverFavorites = await fetchFavoritesFromServer();
    await saveFavoritesToCache(serverFavorites);

    return {
      success: true,
      favorites: serverFavorites,
      queueProcessed: queueResult.processed,
      queueFailed: queueResult.failed
    };
  } catch (error) {
    console.error('Error syncing favorites:', error);
    return { success: false, error: error.message };
  }
};

export default {
  // Server operations
  fetchFavoritesFromServer,
  addFavoriteToServer,
  removeFavoriteFromServer,
  batchSyncFavorites,
  batchAddFavorites,
  batchDeleteFavorites,
  
  // Cache operations
  getFavoritesFromCache,
  saveFavoritesToCache,
  getLastSyncTimestamp,
  shouldRefreshCache,
  clearFavoritesCache,
  
  // Queue operations
  getPendingQueue,
  addToPendingQueue,
  processPendingQueue,
  
  // Utilities
  isFavoritedLocally,
  getFavoritesByType,
  getFavoriteIds,
  getFavoritesStats,
  
  // Main operations
  addFavorite,
  removeFavorite,
  syncFavorites
};
