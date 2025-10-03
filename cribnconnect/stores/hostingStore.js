import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Initial state for apartment data
const initialApartmentData = {
  apartmentType: "",
  space: "",
  rooms: {
    beds: "",
    rooms: "",
    privateBathIn: "",
    privateBathOut: "",
    sharedBath: "",
  },
  location: {
    complexType: "",
    complexName: "",
    address: "",
    state: "",
    city: "",
    zip: "",
    country: "",
  },
  details: {
    title: "",
    description: "",
  },
  amenities: {
    selected: [],
    other: "",
  },
  pricing: {
    perNight: "",
    perWeek: "",
  },
  media: [],
  specialPerks: [],
  houseRules: [],
  availability: {
    from: null,
    to: null,
  },
  maxGuests: "",
  isAvailable: true,
};

// Initial state for event data
const initialEventData = {
  title: "",
  description: "",
  eventType: "",
  location: {
    address: "",
    city: "",
    state: "",
    venue: "",
    zip: "",
    country: "",
  },
  dateTime: {
    date: null,
    startTime: "",
    endTime: "",
  },
  ticket: {
    price: "",
    isFree: false,
    capacity: "",
  },
  media: [],
  tags: [],
  specialPerks: [],
  safetyTips: [],
  ticketPolicies: {
    refundable: false,
    transferable: false,
    upgradable: false,
    termsAccepted: false,
  },
};

const useHostingStore = create(
  persist(
    (set, get) => ({
      // Current hosting type ('apartment' or 'event')
      hostingType: null,
      
      // Current step in the process
      currentStep: 1,
      
      // Data for apartment hosting
      apartmentData: { ...initialApartmentData },
      
      // Data for event hosting
      eventData: { ...initialEventData },
      
      // Drafts storage
      drafts: [],
      
      // Loading states
      isSubmitting: false,
      isSavingDraft: false,
      
      // Actions
      setHostingType: (type) => set({ hostingType: type }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: state.currentStep + 1 
      })),
      
      previousStep: () => set((state) => ({ 
        currentStep: Math.max(1, state.currentStep - 1) 
      })),
      
      // Apartment data actions
      updateApartmentData: (field, value) => set((state) => ({
        apartmentData: {
          ...state.apartmentData,
          [field]: value,
        },
      })),
      
      updateApartmentNestedData: (parentField, childField, value) => set((state) => ({
        apartmentData: {
          ...state.apartmentData,
          [parentField]: {
            ...state.apartmentData[parentField],
            [childField]: value,
          },
        },
      })),
      
      // Event data actions
      updateEventData: (field, value) => set((state) => ({
        eventData: {
          ...state.eventData,
          [field]: value,
        },
      })),
      
      updateEventNestedData: (parentField, childField, value) => set((state) => ({
        eventData: {
          ...state.eventData,
          [parentField]: {
            ...state.eventData[parentField],
            [childField]: value,
          },
        },
      })),
      
      // Media actions
      addMediaToApartment: (mediaItem) => set((state) => ({
        apartmentData: {
          ...state.apartmentData,
          media: [...state.apartmentData.media, mediaItem],
        },
      })),
      
      removeMediaFromApartment: (index) => set((state) => ({
        apartmentData: {
          ...state.apartmentData,
          media: state.apartmentData.media.filter((_, i) => i !== index),
        },
      })),
      
      updateMediaInApartment: (index, mediaItem) => set((state) => ({
        apartmentData: {
          ...state.apartmentData,
          media: state.apartmentData.media.map((item, i) => 
            i === index ? mediaItem : item
          ),
        },
      })),
      
      addMediaToEvent: (mediaItem) => set((state) => ({
        eventData: {
          ...state.eventData,
          media: [...state.eventData.media, mediaItem],
        },
      })),
      
      removeMediaFromEvent: (index) => set((state) => ({
        eventData: {
          ...state.eventData,
          media: state.eventData.media.filter((_, i) => i !== index),
        },
      })),
      
      updateMediaInEvent: (index, mediaItem) => set((state) => ({
        eventData: {
          ...state.eventData,
          media: state.eventData.media.map((item, i) => 
            i === index ? mediaItem : item
          ),
        },
      })),
      
      // Draft management
      saveAsDraft: () => {
        const state = get();
        const draftData = {
          id: Date.now().toString(),
          type: state.hostingType,
          data: state.hostingType === 'apartment' ? state.apartmentData : state.eventData,
          currentStep: state.currentStep,
          status: 'local', // 'local', 'synced', 'uploading'
          lastSyncedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Clean media data for storage (remove local URIs to save space)
        const cleanedData = {
          ...draftData,
          data: {
            ...draftData.data,
            media: draftData.data.media?.map(item => ({
              ...item,
              // Keep metadata but remove heavy local data
              localUri: null,
              localThumbnail: null,
              // Keep only essential info for reconstruction
              originalFilename: item.filename,
              fileSize: item.size,
              mediaType: item.resource_type
            })) || []
          }
        };
        
        set((state) => ({
          drafts: [...state.drafts.filter(d => d.id !== draftData.id), cleanedData],
          isSavingDraft: false,
        }));
        
        return draftData.id;
      },
      
      updateDraft: (draftId) => {
        const state = get();
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === draftId
              ? {
                  ...draft,
                  data: state.hostingType === 'apartment' ? state.apartmentData : state.eventData,
                  currentStep: state.currentStep,
                  updatedAt: new Date().toISOString(),
                }
              : draft
          ),
        }));
      },
      
      loadDraft: (draftId) => {
        const state = get();
        const draft = state.drafts.find((d) => d.id === draftId);
        
        if (draft) {
          // Restore draft data but handle missing media gracefully
          const restoredData = {
            ...draft.data,
            media: draft.data.media?.map(item => ({
              ...item,
              // If no local URI, show placeholder or prompt for re-selection
              localUri: item.localUri || null,
              localThumbnail: item.localThumbnail || null,
              needsReselection: !item.localUri && !item.url // Flag for UI
            })) || []
          };
          
          set({
            hostingType: draft.type,
            currentStep: draft.currentStep,
            apartmentData: draft.type === 'apartment' ? restoredData : { ...initialApartmentData },
            eventData: draft.type === 'event' ? restoredData : { ...initialEventData },
          });
          
          return { success: true, needsMediaReselection: restoredData.media?.some(m => m.needsReselection) };
        }
        
        return { success: false, error: 'Draft not found' };
      },
      
      deleteDraft: (draftId) => set((state) => ({
        drafts: state.drafts.filter((draft) => draft.id !== draftId),
      })),
      
      // Sync draft to backend
      syncDraftToServer: async (draftId) => {
        const state = get();
        const draft = state.drafts.find(d => d.id === draftId);
        
        if (!draft) return { success: false, error: 'Draft not found' };
        
        try {
          // Mark as uploading
          set((state) => ({
            drafts: state.drafts.map(d => 
              d.id === draftId 
                ? { ...d, status: 'uploading' }
                : d
            )
          }));
          
          // TODO: Replace with actual API call
          console.log('Syncing draft to server:', draft);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mark as synced
          set((state) => ({
            drafts: state.drafts.map(d => 
              d.id === draftId 
                ? { 
                    ...d, 
                    status: 'synced',
                    lastSyncedAt: new Date().toISOString()
                  }
                : d
            )
          }));
          
          return { success: true };
        } catch (error) {
          // Revert to local status on error
          set((state) => ({
            drafts: state.drafts.map(d => 
              d.id === draftId 
                ? { ...d, status: 'local' }
                : d
            )
          }));
          
          return { success: false, error: error.message };
        }
      },
      
      // Load drafts from server
      loadDraftsFromServer: async () => {
        try {
          // TODO: Replace with actual API call
          console.log('Loading drafts from server...');
          
          // Simulate API call
          const serverDrafts = []; // Response from your API
          
          set((state) => ({
            drafts: [...state.drafts, ...serverDrafts.filter(
              serverDraft => !state.drafts.find(localDraft => localDraft.id === serverDraft.id)
            )]
          }));
          
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      
      // Clean up old drafts
      cleanupDrafts: () => {
        const state = get();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const cleanedDrafts = state.drafts.filter(draft => {
          const draftDate = new Date(draft.updatedAt);
          const isOld = draftDate < thirtyDaysAgo;
          
          // Keep synced drafts longer, remove old local-only drafts
          if (draft.status === 'local' && isOld) {
            console.log(`Removing old local draft: ${draft.id}`);
            return false;
          }
          
          return true;
        });
        
        // Also limit total number of drafts to prevent bloat
        const maxDrafts = 50;
        const sortedDrafts = cleanedDrafts
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, maxDrafts);
        
        if (sortedDrafts.length !== state.drafts.length) {
          console.log(`Cleaned up ${state.drafts.length - sortedDrafts.length} old drafts`);
          set({ drafts: sortedDrafts });
          return { 
            success: true, 
            removedCount: state.drafts.length - sortedDrafts.length 
          };
        }
        
        return { success: true, removedCount: 0 };
      },
      
      // Get storage usage info
      getDraftStorageInfo: () => {
        const state = get();
        const draftsString = JSON.stringify(state.drafts);
        const sizeInBytes = new Blob([draftsString]).size;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        
        const statusCounts = state.drafts.reduce((counts, draft) => {
          counts[draft.status] = (counts[draft.status] || 0) + 1;
          return counts;
        }, {});
        
        return {
          totalDrafts: state.drafts.length,
          sizeInMB: parseFloat(sizeInMB),
          sizeInBytes,
          statusCounts,
          oldestDraft: state.drafts.length > 0 
            ? Math.min(...state.drafts.map(d => new Date(d.createdAt).getTime()))
            : null
        };
      },
      
      // Initialize store and run cleanup
      initialize: () => {
        const state = get();
        
        // Run cleanup on app start
        setTimeout(() => {
          const result = state.cleanupDrafts();
          if (result.removedCount > 0) {
            console.log(`Auto-cleaned ${result.removedCount} old drafts on app start`);
          }
        }, 1000);
      },
      
      // Reset functions
      resetApartmentData: () => set({
        apartmentData: { ...initialApartmentData },
        currentStep: 1,
      }),
      
      resetEventData: () => set({
        eventData: { ...initialEventData },
        currentStep: 1,
      }),
      
      resetCurrentHosting: () => {
        const state = get();
        if (state.hostingType === 'apartment') {
          state.resetApartmentData();
        } else if (state.hostingType === 'event') {
          state.resetEventData();
        }
        set({ hostingType: null });
      },
      
      // Validation helpers
      isStepValid: (step) => {
        const state = get();
        const data = state.hostingType === 'apartment' ? state.apartmentData : state.eventData;
        
        if (state.hostingType === 'apartment') {
          switch (step) {
            case 1: return Boolean(data.apartmentType);
            case 2: return Boolean(data.space);
            case 3: return Boolean(data.rooms.beds && data.rooms.rooms);
            case 4: return Boolean(data.location.address && data.location.city && data.location.state);
            case 5: return Boolean(data.details.title && data.details.description);
            case 6: return data.amenities.selected.length > 0;
            case 7: return Boolean(data.pricing.perNight);
            case 8: return data.media.length > 0;
            case 9: return true; // Special perks and house rules are optional
            default: return false;
          }
        } else if (state.hostingType === 'event') {
          switch (step) {
            case 1: return Boolean(data.eventType);
            case 2: return Boolean(data.title);
            case 3: return Boolean(data.location.address && data.location.city && data.location.state);
            case 4: return Boolean(data.ticket.isFree || data.ticket.price);
            case 5: return Boolean(data.dateTime.date && data.dateTime.startTime);
            case 6: return true; // Safety tips are optional
            default: return false;
          }
        }
        
        return false;
      },
      
      // Get current data based on hosting type
      getCurrentData: () => {
        const state = get();
        return state.hostingType === 'apartment' ? state.apartmentData : state.eventData;
      },
      
      // Submission
      submitListing: async () => {
        set({ isSubmitting: true });
        
        try {
          const state = get();
          const data = state.getCurrentData();
          
          // TODO: Replace with actual API call
          console.log('Submitting listing:', {
            type: state.hostingType,
            data,
          });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reset after successful submission
          state.resetCurrentHosting();
          
          return { success: true };
        } catch (error) {
          console.error('Submission error:', error);
          return { success: false, error: error.message };
        } finally {
          set({ isSubmitting: false });
        }
      },
    }),
    {
      name: 'hosting-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        drafts: state.drafts,
        // Don't persist current hosting session, only drafts
      }),
    }
  )
);

export default useHostingStore;