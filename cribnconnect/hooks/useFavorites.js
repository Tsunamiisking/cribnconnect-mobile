import { useState, useEffect, useCallback } from 'react';
import {
  addFavorite,
  removeFavorite,
  syncFavorites,
  getFavoritesFromCache,
  isFavoritedLocally,
  getFavoritesByType,
  getFavoriteIds,
  shouldRefreshCache,
  processPendingQueue
} from '../api/services/favoriteServices';
import { subscribeToNetworkChanges } from '../utils/networkUtils';

/**
 * Custom hook for managing favorites with offline support
 * Provides optimistic UI updates and automatic syncing
 * 
 * @returns {Object} Favorites state and operations
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load favorites from cache on mount
   */
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const cached = await getFavoritesFromCache();
      setFavorites(cached);
      
      // Create Set of IDs for fast lookup
      const ids = new Set(cached.map(fav => fav.itemId));
      setFavoriteIds(ids);
      
      setError(null);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sync favorites with server
   */
  const handleSync = useCallback(async (force = false) => {
    try {
      // Check if sync is needed
      if (!force) {
        const needsRefresh = await shouldRefreshCache();
        if (!needsRefresh) {
          return { success: true, skipped: true };
        }
      }

      setSyncing(true);
      const result = await syncFavorites();
      
      if (result.success) {
        setFavorites(result.favorites);
        const ids = new Set(result.favorites.map(fav => fav.itemId));
        setFavoriteIds(ids);
        setError(null);
      } else {
        setError(result.error || 'Sync failed');
      }
      
      return result;
    } catch (err) {
      console.error('Error syncing favorites:', err);
      setError('Sync failed');
      return { success: false, error: err.message };
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * Toggle favorite status for an item
   * @param {string} itemType - Type of item (event, linkup, apartment, person)
   * @param {string} itemId - ID of item
   * @param {Object} metadata - Optional metadata about the item
   */
  const toggleFavorite = useCallback(async (itemType, itemId, metadata = {}) => {
    try {
      const isCurrentlyFavorited = favoriteIds.has(itemId);
      
      // Optimistic UI update
      if (isCurrentlyFavorited) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.itemId !== itemId));
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        
        // Remove from server/cache
        const result = await removeFavorite(itemType, itemId);
        
        if (!result.success) {
          // Revert on failure
          await loadFavorites();
          throw new Error(result.error || 'Failed to remove favorite');
        }
        
        return { success: true, action: 'removed', synced: result.synced };
      } else {
        // Add to local state
        const tempFavorite = {
          id: `temp_${Date.now()}`,
          itemType,
          itemId,
          metadata,
          createdAt: new Date().toISOString(),
          _pending: true
        };
        
        setFavorites(prev => [...prev, tempFavorite]);
        setFavoriteIds(prev => new Set([...prev, itemId]));
        
        // Add to server/cache
        const result = await addFavorite(itemType, itemId, metadata);
        
        if (!result.success) {
          // Revert on failure
          await loadFavorites();
          throw new Error('Failed to add favorite');
        }
        
        // Update with server response if available
        if (result.favorite && !result.favorite.id.startsWith('temp_')) {
          setFavorites(prev => 
            prev.map(fav => fav.id === tempFavorite.id ? result.favorite : fav)
          );
        }
        
        return { success: true, action: 'added', synced: result.synced };
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.message);
      throw err;
    }
  }, [favoriteIds, loadFavorites]);

  /**
   * Check if an item is favorited
   * @param {string} itemId - ID of item to check
   * @returns {boolean}
   */
  const isFavorite = useCallback((itemId) => {
    return favoriteIds.has(itemId);
  }, [favoriteIds]);

  /**
   * Get favorites filtered by type
   * @param {string} itemType - Type to filter by
   * @returns {Array}
   */
  const getFavorites = useCallback((itemType = null) => {
    if (!itemType) return favorites;
    return favorites.filter(fav => fav.itemType === itemType);
  }, [favorites]);

  /**
   * Get count of favorites by type
   * @param {string} itemType - Optional type filter
   * @returns {number}
   */
  const getFavoriteCount = useCallback((itemType = null) => {
    if (!itemType) return favorites.length;
    return favorites.filter(fav => fav.itemType === itemType).length;
  }, [favorites]);

  /**
   * Refresh favorites - force sync with server
   */
  const refresh = useCallback(async () => {
    return await handleSync(true);
  }, [handleSync]);

  // Initial load on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Auto-sync on mount if cache is stale
  useEffect(() => {
    const autoSync = async () => {
      await handleSync(false);
    };
    autoSync();
  }, [handleSync]);

  // Listen for network changes and process pending queue when online
  useEffect(() => {
    const unsubscribe = subscribeToNetworkChanges(async (isOnline) => {
      if (isOnline) {
        console.log('Network connected - processing pending favorites...');
        try {
          await processPendingQueue();
          await handleSync(true);
        } catch (err) {
          console.error('Error processing pending queue:', err);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [handleSync]);

  return {
    // State
    favorites,
    loading,
    syncing,
    error,
    
    // Operations
    toggleFavorite,
    isFavorite,
    getFavorites,
    getFavoriteCount,
    refresh,
    
    // Raw data for advanced use
    favoriteIds
  };
};

export default useFavorites;
