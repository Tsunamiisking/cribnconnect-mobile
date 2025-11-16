import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Store for tracking items being processed in the background
 * Used for optimistic UI updates during uploads
 */
const useProcessingStore = create(
  persist(
    (set, get) => ({
      // Array of processing items
      processingItems: [],
      
      /**
       * Add a new item to processing queue
       * @param {Object} item - Item data
       * @param {string} item.id - Unique temporary ID
       * @param {string} item.type - 'apartment' or 'event'
       * @param {Object} item.data - Item data to display
       * @param {string} item.status - 'uploading' | 'processing' | 'completed' | 'failed'
       * @param {number} item.progress - Upload progress (0-100)
       */
      addProcessingItem: (item) => {
        const processingItem = {
          ...item,
          id: item.id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          status: item.status || 'uploading',
          progress: item.progress || 0,
        };
        
        set((state) => ({
          processingItems: [processingItem, ...state.processingItems],
        }));
        
        return processingItem.id;
      },
      
      /**
       * Update processing item status/progress
       */
      updateProcessingItem: (id, updates) => {
        set((state) => ({
          processingItems: state.processingItems.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: Date.now() }
              : item
          ),
        }));
      },
      
      /**
       * Remove item from processing queue
       */
      removeProcessingItem: (id) => {
        set((state) => ({
          processingItems: state.processingItems.filter((item) => item.id !== id),
        }));
      },
      
      /**
       * Mark item as completed and replace temp ID with real ID
       */
      completeProcessingItem: (tempId, realId, finalData) => {
        set((state) => ({
          processingItems: state.processingItems.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  id: realId,
                  realId: realId,
                  status: 'completed',
                  progress: 100,
                  completedAt: Date.now(),
                  data: { ...item.data, ...finalData },
                }
              : item
          ),
        }));
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
          get().removeProcessingItem(realId);
        }, 3000);
      },
      
      /**
       * Mark item as failed
       */
      failProcessingItem: (id, error) => {
        set((state) => ({
          processingItems: state.processingItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'failed',
                  error: error,
                  failedAt: Date.now(),
                }
              : item
          ),
        }));
      },
      
      /**
       * Get all processing items
       */
      getProcessingItems: () => {
        return get().processingItems;
      },
      
      /**
       * Get processing items by type
       */
      getProcessingItemsByType: (type) => {
        return get().processingItems.filter((item) => item.type === type);
      },
      
      /**
       * Get processing item count
       */
      getProcessingCount: () => {
        return get().processingItems.length;
      },
      
      /**
       * Clear all completed items
       */
      clearCompleted: () => {
        set((state) => ({
          processingItems: state.processingItems.filter(
            (item) => item.status !== 'completed'
          ),
        }));
      },
      
      /**
       * Clear all items
       */
      clearAll: () => {
        set({ processingItems: [] });
      },
    }),
    {
      name: 'processing-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useProcessingStore;
