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
    time: "",
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
      
      // Draft management
      saveAsDraft: () => {
        const state = get();
        const draftData = {
          id: Date.now().toString(),
          type: state.hostingType,
          data: state.hostingType === 'apartment' ? state.apartmentData : state.eventData,
          currentStep: state.currentStep,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          drafts: [...state.drafts, draftData],
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
          set({
            hostingType: draft.type,
            currentStep: draft.currentStep,
            apartmentData: draft.type === 'apartment' ? draft.data : { ...initialApartmentData },
            eventData: draft.type === 'event' ? draft.data : { ...initialEventData },
          });
        }
      },
      
      deleteDraft: (draftId) => set((state) => ({
        drafts: state.drafts.filter((draft) => draft.id !== draftId),
      })),
      
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
            case 1: return Boolean(data.title);
            case 2: return Boolean(data.eventType);
            case 3: return Boolean(data.location.address && data.location.city);
            case 4: return Boolean(data.dateTime.date && data.dateTime.time);
            case 5: return Boolean(data.ticket.isFree || data.ticket.price);
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