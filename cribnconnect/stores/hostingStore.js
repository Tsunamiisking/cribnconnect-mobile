import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Initial state for apartment data
const initialApartmentData = {
  // Basic Info
  apartmentType: "",
  apartmentCategory: "", // Changed from "space"
  
  // Rooms
  bedrooms: "", // Changed from "rooms.rooms"
  bathrooms: "", // Total bathrooms
  privateBathrooms: "", // Changed from "privateBathIn + privateBathOut"
  publicBathrooms: "",
  sharedBathrooms: "", // Changed from "sharedBath"
  
  // Location
  address: {
    street: "", // Changed from "location.address"
    city: "",
    state: "",
    lga: "", // Local Government Area
    country: "",
  },
  complex: {
    name: "", // Changed from "location.complexName"
  },
  
  // Details (flattened)
  title: "", // Flattened from details.title
  description: "", // Flattened from details.description
  
  // Amenities (split by category)
  basicAmenities: [], // Changed from amenities.selected
  sharedAmenities: [],
  luxuryAmenities: [],
  otherAmenities: [], // Changed from amenities.other (now array)
  
  // Pricing (flattened)
  pricePerNight: "", // Flattened from pricing.perNight
  pricePerWeek: "", // Flattened from pricing.perWeek
  
  // Media & Others
  media: [],
  specialPerks: [],
  houseRules: [],
  partiesAllowed: false,
  availability: {
    from: new Date(), // Default to today
    to: null,
  },
  maxGuests: "",
  isAvailable: true,
  isPublished: false,
  
  // Will be set by backend from Firebase auth
  // hostId: null
};

// Initial state for event data
const initialEventData = {
  title: "",
  description: "",
  category: "", // Maps to backend category enum
  eventType: "", // Maps to backend eventType (specific type within category)
  location: {
    street: "", // Changed from 'address' to match backend
    city: "",
    state: "",
    country: "", // Default country
    venue: "",
  },
  date: null, // Changed from dateTime.date to match backend
  time: "", // Changed from dateTime.startTime to match backend
  endTime: "", // Keep for frontend, will calculate duration for backend
  capacity: "", // Moved from ticket.capacity to match backend
  isFree: false, // Changed from ticket.isFree to match backend
  ticketTypes: [], // New field for multiple ticket types
  media: [],
  eventSpecialPerks: [], // Changed from specialPerks to match backend
  eventSafetyTips: [], // Changed from safetyTips to match backend
};

const useHostingStore = create(
  persist(
    (set, get) => ({
      // Current hosting type ('apartment' or 'event')
      hostingType: null,
      
      // Current step for each hosting type
      apartmentCurrentStep: 1,
      eventCurrentStep: 1,
      
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
      
      // Get current step based on hosting type
      getCurrentStep: () => {
        const state = get();
        return state.hostingType === 'apartment' ? state.apartmentCurrentStep : state.eventCurrentStep;
      },
      
      setCurrentStep: (step) => {
        const state = get();
        if (state.hostingType === 'apartment') {
          set({ apartmentCurrentStep: step });
        } else if (state.hostingType === 'event') {
          set({ eventCurrentStep: step });
        }
      },
      
      nextStep: () => {
        const state = get();
        if (state.hostingType === 'apartment') {
          set((state) => ({ apartmentCurrentStep: state.apartmentCurrentStep + 1 }));
        } else if (state.hostingType === 'event') {
          set((state) => ({ eventCurrentStep: state.eventCurrentStep + 1 }));
        }
      },
      
      previousStep: () => {
        const state = get();
        if (state.hostingType === 'apartment') {
          set((state) => ({ apartmentCurrentStep: Math.max(1, state.apartmentCurrentStep - 1) }));
        } else if (state.hostingType === 'event') {
          set((state) => ({ eventCurrentStep: Math.max(1, state.eventCurrentStep - 1) }));
        }
      },
      
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
          currentStep: state.hostingType === 'apartment' ? state.apartmentCurrentStep : state.eventCurrentStep,
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
        const currentStep = state.hostingType === 'apartment' ? state.apartmentCurrentStep : state.eventCurrentStep;
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === draftId
              ? {
                  ...draft,
                  data: state.hostingType === 'apartment' ? state.apartmentData : state.eventData,
                  currentStep: currentStep,
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
            apartmentCurrentStep: draft.type === 'apartment' ? draft.currentStep : 1,
            eventCurrentStep: draft.type === 'event' ? draft.currentStep : 1,
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
        const maxDrafts = 20;
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
        apartmentCurrentStep: 1,
      }),
      
      resetEventData: () => set({
        eventData: { ...initialEventData },
        eventCurrentStep: 1,
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
            case 2: return Boolean(data.apartmentCategory);
            case 3: {
              // Validate based on apartment category
              const category = data.apartmentCategory;
              if (category === "Whole Space ") {
                return Boolean(data.bedrooms && data.bathrooms);
              } else if (category === "One Room") {
                return Boolean(data.bedrooms && (data.privateBathrooms || data.sharedBathrooms));
              } else if (category === "Shared Room") {
                return Boolean(data.bedrooms && data.sharedBathrooms);
              }
              return false;
            }
            case 4: return Boolean(data.address.street && data.address.city && data.address.state);
            case 5: return Boolean(data.title && data.description);
            case 6: return (data.basicAmenities.length > 0 || data.sharedAmenities.length > 0 || data.luxuryAmenities.length > 0);
            case 7: return Boolean(data.pricePerNight && data.availability?.from); // Price and start date required
            case 8: return data.media.length > 0;
            case 9: return Boolean(data.maxGuests); // Max guests is required
            default: return false;
          }
        } else if (state.hostingType === 'event') {
          switch (step) {
            case 1: return Boolean(data.category && data.eventType); // EventType
            case 2: return Boolean(data.title && data.description); // EventTitle
            case 3: return Boolean(data.location.street && data.location.city && data.location.state); // EventAddress
            case 4: return true; // EventImages - optional
            case 5: return Boolean(data.isFree || (data.ticketTypes && data.ticketTypes.length > 0)); // EventTicket
            case 6: return Boolean(data.date && data.time); // EventDate
            case 7: return Boolean(data.capacity); // EventSpecialPerks - capacity is required
            case 8: return true; // EventSafetyTips are optional
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

      // Transform apartment data for backend submission
      getBackendApartmentData: () => {
        const state = get();
        const apartmentData = state.apartmentData;
        
        // Map frontend category names to backend enum values
        const categoryMapping = {
          "Whole Space ": "whole",
          "Whole Space": "whole",
          "One Room": "private",
          "Shared Room": "shared"
        };
        
        // Transform frontend structure to match backend schema
        return {
          title: apartmentData.title,
          description: apartmentData.description,
          apartmentCategory: categoryMapping[apartmentData.apartmentCategory] || "whole",
          apartmentType: apartmentData.apartmentType,
          media: apartmentData.media || [],
          address: {
            street: apartmentData.address?.street || "",
            city: apartmentData.address?.city || "",
            state: apartmentData.address?.state || "",
            lga: apartmentData.address?.lga || "",
            country: apartmentData.address?.country || "Nigeria",
          },
          complex: {
            name: apartmentData.complex?.name || "",
          },
          bedrooms: parseInt(apartmentData.bedrooms) || 0,
          bathrooms: parseInt(apartmentData.bathrooms) || 0,
          privateBathrooms: parseInt(apartmentData.privateBathrooms) || 0,
          publicBathrooms: parseInt(apartmentData.publicBathrooms) || 0,
          sharedBathrooms: parseInt(apartmentData.sharedBathrooms) || 0,
          pricePerNight: parseFloat(apartmentData.pricePerNight) || 0,
          pricePerWeek: parseFloat(apartmentData.pricePerWeek) || 0,
          maxGuests: parseInt(apartmentData.maxGuests) || 1,
          basicAmenities: apartmentData.basicAmenities || [],
          sharedAmenities: apartmentData.sharedAmenities || [],
          luxuryAmenities: apartmentData.luxuryAmenities || [],
          otherAmenities: apartmentData.otherAmenities || [],
          specialPerks: apartmentData.specialPerks || [],
          availability: {
            from: apartmentData.availability?.from || new Date(),
            to: apartmentData.availability?.to || null,
          },
          isAvailable: apartmentData.isAvailable !== false,
          houseRules: apartmentData.houseRules || [],
          partiesAllowed: apartmentData.partiesAllowed || false,
          isPublished: true,
          // Media files are handled separately in the service (not included here)
          media: apartmentData.media || [],
        };
      },

      // Transform event data for backend submission
      getBackendEventData: () => {
        const state = get();
        const eventData = state.eventData;
        
        // Helper function to convert 12-hour time to 24-hour format
        const convertTo24Hour = (time12h) => {
          if (!time12h) return null;
          
          // If already in 24-hour format (HH:MM), return as is
          if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time12h)) {
            return time12h;
          }
          
          // Handle 12-hour format (e.g., "5:00 PM")
          const [time, modifier] = time12h.split(' ');
          let [hours, minutes] = time.split(':');
          
          if (hours === '12') {
            hours = '00';
          }
          
          if (modifier === 'PM' || modifier === 'pm') {
            hours = parseInt(hours, 10) + 12;
          }
          
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        };
        
        // Convert times to 24-hour format
        const time24 = convertTo24Hour(eventData.time);
        const endTime24 = eventData.endTime ? convertTo24Hour(eventData.endTime) : null;
        
        // Calculate duration in minutes from time and endTime
        let duration = null;
        if (time24 && endTime24) {
          const [startHour, startMin] = time24.split(':').map(Number);
          const [endHour, endMin] = endTime24.split(':').map(Number);
          const startMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;
          duration = endMinutes - startMinutes;
          // Handle overnight events
          if (duration < 0) duration += 24 * 60;
        }
        
        // Transform frontend structure to match backend schema
        return {
          title: eventData.title,
          description: eventData.description,
          category: eventData.category.toLowerCase(), // Convert to lowercase for backend
          eventType: eventData.eventType.toLowerCase(), // Convert to lowercase for backend
          location: {
            street: eventData.location.street,
            city: eventData.location.city,
            state: eventData.location.state,
            country: eventData.location.country,
            venue: eventData.location.venue,
          },
          date: eventData.date, // Should be a Date object
          time: time24,
          endTime: endTime24,
          duration: duration,
          isFree: eventData.isFree,
          capacity: parseInt(eventData.capacity) || 0,
          ticketTypes: eventData.ticketTypes || [],
          media: eventData.media || [],
          eventSpecialPerks: eventData.eventSpecialPerks || [],
          eventSafetyTips: eventData.eventSafetyTips || [],
          isPublished: true,
          isActive: true,
          status: 'draft',
        };
      },
      
      // Submission
      submitListing: async () => {
        set({ isSubmitting: true });
        
        try {
          const state = get();
          
          if (state.hostingType === 'apartment') {
            // Import apartment service dynamically to avoid circular deps
            const { createApartment } = await import('../api/services/apartmentServices');
            
            // Transform data for backend
            const backendData = state.getBackendApartmentData();
            
            console.log('Submitting apartment:', backendData);
            
            // Submit to backend
            const response = await createApartment(backendData);
            
            console.log('Apartment created successfully:', response);
            
            // Reset after successful submission
            state.resetCurrentHosting();
            
            return { 
              success: true, 
              data: response,
              message: 'Apartment listing created successfully!' 
            };
            
          } else if (state.hostingType === 'event') {
            // Import event service dynamically
            const { createEvent } = await import('../api/services/eventServices');
            
            // Transform data for backend
            const backendData = state.getBackendEventData();
            
            console.log('Submitting event:', backendData);
            
            // Submit to backend
            const response = await createEvent(backendData);
            
            console.log('Event created successfully:', response);
            
            // Reset after successful submission
            state.resetCurrentHosting();
            
            return { 
              success: true, 
              data: response,
              message: 'Event created successfully!' 
            };
          }
          
          throw new Error('Invalid hosting type');
          
        } catch (error) {
          console.error('Submission error:', error);
          
          // Extract meaningful error message
          const errorMessage = error.response?.data?.message 
            || error.response?.data?.error 
            || error.message 
            || 'Failed to submit listing';
          
          return { 
            success: false, 
            error: errorMessage,
            details: error.response?.data 
          };
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