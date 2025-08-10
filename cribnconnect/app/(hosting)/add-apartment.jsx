import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function AddApartmentScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    type: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Details
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    rent: '',
    deposit: '',
    
    // Amenities
    amenities: [],
    
    // Contact
    contactName: '',
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

  const submitListing = () => {
    // TODO: Add API integration to submit apartment listing
    // Example API call:
    // try {
    //   const response = await api.createApartment(formData);
    //   if (response.success) {
    //     router.push('/(tabs)');
    //   }
    // } catch (error) {
    //   // Handle error
    // }
    
    console.log('Submitting apartment listing:', formData);
    router.push('/(tabs)');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Basic Information
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Listing Title *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., Modern Studio Downtown"
                value={formData.title}
                onChangeText={(value) => updateField('title', value)}
              />
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Description *
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Describe your apartment..."
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </Text>
              <View style={styles.typeButtons} className="flex-row flex-wrap">
                {['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && styles.selectedTypeButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.type === type ? 'bg-blue-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('type', type)}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        formData.type === type && styles.selectedTypeButtonText
                      ]}
                      className={formData.type === type ? 'text-white' : 'text-gray-700'}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Location Details
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="123 Main Street"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
              />
            </View>

            <View style={styles.inputRow} className="flex-row space-x-4 mb-4">
              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  City *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="New York"
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                />
              </View>

              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  State *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="NY"
                  value={formData.state}
                  onChangeText={(value) => updateField('state', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </Text>
              <TextInput
                style={[styles.input, { width: '50%' }]}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="10001"
                value={formData.zipCode}
                onChangeText={(value) => updateField('zipCode', value)}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Property Details
            </Text>
            
            <View style={styles.inputRow} className="flex-row space-x-4 mb-4">
              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="2"
                  value={formData.bedrooms}
                  onChangeText={(value) => updateField('bedrooms', value)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="1.5"
                  value={formData.bathrooms}
                  onChangeText={(value) => updateField('bathrooms', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Square Feet
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="850"
                value={formData.sqft}
                onChangeText={(value) => updateField('sqft', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputRow} className="flex-row space-x-4 mb-6">
              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="2500"
                  value={formData.rent}
                  onChangeText={(value) => updateField('rent', value)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Security Deposit
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="2500"
                  value={formData.deposit}
                  onChangeText={(value) => updateField('deposit', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Amenities & Features
            </Text>
            
            <Text style={styles.sectionSubtitle} className="text-gray-600 mb-4">
              Select all amenities that apply
            </Text>

            <View style={styles.amenitiesGrid} className="flex-row flex-wrap">
              {[
                'Gym/Fitness Center', 'Swimming Pool', 'Parking', 'Laundry',
                'Balcony/Patio', 'Air Conditioning', 'Dishwasher', 'Pet Friendly',
                'Doorman/Concierge', 'Rooftop Access', 'Storage', 'Elevator'
              ].map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityButton,
                    formData.amenities.includes(amenity) && styles.selectedAmenityButton
                  ]}
                  className={`px-4 py-3 rounded-lg mr-2 mb-2 ${
                    formData.amenities.includes(amenity) ? 'bg-blue-600' : 'bg-gray-100'
                  }`}
                  onPress={() => {
                    const currentAmenities = [...formData.amenities];
                    if (currentAmenities.includes(amenity)) {
                      updateField('amenities', currentAmenities.filter(a => a !== amenity));
                    } else {
                      updateField('amenities', [...currentAmenities, amenity]);
                    }
                  }}
                >
                  <Text 
                    style={[
                      styles.amenityButtonText,
                      formData.amenities.includes(amenity) && styles.selectedAmenityButtonText
                    ]}
                    className={formData.amenities.includes(amenity) ? 'text-white' : 'text-gray-700'}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Your full name"
                value={formData.contactName}
                onChangeText={(value) => updateField('contactName', value)}
              />
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="your.email@example.com"
                value={formData.contactEmail}
                onChangeText={(value) => updateField('contactEmail', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="(555) 123-4567"
                value={formData.contactPhone}
                onChangeText={(value) => updateField('contactPhone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.disclaimer} className="bg-blue-50 p-4 rounded-lg">
              <Text style={styles.disclaimerText} className="text-blue-700 text-sm">
                📝 Your listing will be reviewed before being published. We'll notify you once it's live.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Progress Indicator */}
      <View style={styles.progressContainer} className="px-6 py-4 bg-gray-50">
        <Text style={styles.stepCounter} className="text-center text-gray-600 mb-2">
          Step {currentStep} of 5
        </Text>
        <View style={styles.progressBar} className="bg-gray-200 h-2 rounded-full">
          <View 
            style={[styles.progressFill, { width: `${(currentStep / 5) * 100}%` }]} 
            className="bg-blue-600 h-full rounded-full"
          />
        </View>
      </View>

      <ScrollView style={styles.content} className="flex-1 px-6 py-6">
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer} className="px-6 py-4 bg-white border-t border-gray-200">
        <View style={styles.buttonRow} className="flex-row justify-between">
          <TouchableOpacity 
            style={[styles.navButton, styles.backButton]} 
            className="flex-1 bg-gray-100 py-3 rounded-lg mr-3"
            onPress={previousStep}
            disabled={currentStep === 1}
          >
            <Text style={styles.backButtonText} className="text-center text-gray-700 font-medium">
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]} 
            className="flex-1 bg-blue-600 py-3 rounded-lg ml-3"
            onPress={currentStep === 5 ? submitListing : nextStep}
          >
            <Text style={styles.nextButtonText} className="text-center text-white font-medium">
              {currentStep === 5 ? 'Submit Listing' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#2563eb',
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
  sectionSubtitle: {
    color: '#6b7280',
    marginBottom: 16,
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
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: '#2563eb',
  },
  typeButtonText: {
    color: '#374151',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAmenityButton: {
    backgroundColor: '#2563eb',
  },
  amenityButtonText: {
    color: '#374151',
  },
  selectedAmenityButtonText: {
    color: 'white',
  },
  disclaimer: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
  },
  disclaimerText: {
    color: '#1d4ed8',
    fontSize: 14,
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
    backgroundColor: '#2563eb',
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
