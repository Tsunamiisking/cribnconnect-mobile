import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function AddEventScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: '',
    
    // Date & Time
    date: '',
    startTime: '',
    endTime: '',
    
    // Location
    venue: '',
    address: '',
    city: '',
    state: '',
    
    // Details
    ticketPrice: '',
    capacity: '',
    ageRestriction: '',
    dressCode: '',
    
    // Requirements
    requirements: [],
    
    // Contact
    organizer: '',
    contactEmail: '',
    contactPhone: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitEvent = () => {
    // TODO: Add API integration to submit event
    // Example API call:
    // try {
    //   const response = await api.createEvent(formData);
    //   if (response.success) {
    //     router.push('/(tabs)/events');
    //   }
    // } catch (error) {
    //   // Handle error
    // }
    
    console.log('Submitting event:', formData);
    router.push('/(tabs)/events');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 2:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 3:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 4:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 5:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
          <View>
            <Text>Event Information</Text>
          </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  stepCounter: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    backgroundColor: '#7c3aed',
    height: '100%',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#7c3aed',
  },
  categoryButtonText: {
    color: '#374151',
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  ageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAgeButton: {
    backgroundColor: '#7c3aed',
  },
  ageButtonText: {
    color: '#374151',
  },
  selectedAgeButtonText: {
    color: 'white',
  },
  dressCodeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dressCodeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedDressCodeButton: {
    backgroundColor: '#7c3aed',
  },
  dressCodeButtonText: {
    color: '#374151',
  },
  selectedDressCodeButtonText: {
    color: 'white',
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  requirementButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedRequirementButton: {
    backgroundColor: '#7c3aed',
  },
  requirementButtonText: {
    color: '#374151',
    fontSize: 12,
  },
  selectedRequirementButtonText: {
    color: 'white',
    fontSize: 12,
  },
  timeZoneNote: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
  },
  timeZoneText: {
    color: '#1d4ed8',
    fontSize: 14,
  },
  mapNote: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
  },
  mapText: {
    color: '#15803d',
    fontSize: 14,
  },
  disclaimer: {
    backgroundColor: '#faf5ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    color: '#7c3aed',
    fontSize: 14,
  },
  termsNote: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  termsText: {
    color: '#6b7280',
    fontSize: 12,
  },
  navigationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  nextButton: {
    backgroundColor: '#7c3aed',
    marginLeft: 12,
  },
  backButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  nextButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
});
