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
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Event Information
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., Summer Rooftop Party"
                value={formData.title}
                onChangeText={(value) => updateField('title', value)}
              />
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Event Description *
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Describe your event in detail..."
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Event Category *
              </Text>
              <View style={styles.categoryButtons} className="flex-row flex-wrap">
                {['Party', 'Networking', 'Happy Hour', 'Sports', 'Cultural', 'Music', 'Food & Drink', 'Workshop'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      formData.category === category && styles.selectedCategoryButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.category === category ? 'bg-purple-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('category', category)}
                  >
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        formData.category === category && styles.selectedCategoryButtonText
                      ]}
                      className={formData.category === category ? 'text-white' : 'text-gray-700'}
                    >
                      {category}
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
              Date & Time
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="MM/DD/YYYY"
                value={formData.date}
                onChangeText={(value) => updateField('date', value)}
              />
              <Text style={styles.helper} className="text-xs text-gray-500 mt-1">
                📅 Tap to open date picker (Future enhancement)
              </Text>
            </View>

            <View style={styles.inputRow} className="flex-row space-x-4 mb-4">
              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="7:00 PM"
                  value={formData.startTime}
                  onChangeText={(value) => updateField('startTime', value)}
                />
              </View>

              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  End Time
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="11:00 PM"
                  value={formData.endTime}
                  onChangeText={(value) => updateField('endTime', value)}
                />
              </View>
            </View>

            <View style={styles.timeZoneNote} className="bg-blue-50 p-4 rounded-lg">
              <Text style={styles.timeZoneText} className="text-blue-700 text-sm">
                🕐 All times are in your local timezone. Attendees will see times converted to their timezone.
              </Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Location Details
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., Sky Lounge, Central Park"
                value={formData.venue}
                onChangeText={(value) => updateField('venue', value)}
              />
            </View>

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

            <View style={styles.inputRow} className="flex-row space-x-4 mb-6">
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

            <View style={styles.mapNote} className="bg-green-50 p-4 rounded-lg">
              <Text style={styles.mapText} className="text-green-700 text-sm">
                📍 Location will be verified and displayed on the map for attendees
              </Text>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Event Details
            </Text>
            
            <View style={styles.inputRow} className="flex-row space-x-4 mb-4">
              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Ticket Price
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="0 (Free)"
                  value={formData.ticketPrice}
                  onChangeText={(value) => updateField('ticketPrice', value)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Max Capacity
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="50"
                  value={formData.capacity}
                  onChangeText={(value) => updateField('capacity', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Age Restriction
              </Text>
              <View style={styles.ageButtons} className="flex-row flex-wrap">
                {['All Ages', '18+', '21+', '25+'].map((age) => (
                  <TouchableOpacity
                    key={age}
                    style={[
                      styles.ageButton,
                      formData.ageRestriction === age && styles.selectedAgeButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.ageRestriction === age ? 'bg-purple-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('ageRestriction', age)}
                  >
                    <Text 
                      style={[
                        styles.ageButtonText,
                        formData.ageRestriction === age && styles.selectedAgeButtonText
                      ]}
                      className={formData.ageRestriction === age ? 'text-white' : 'text-gray-700'}
                    >
                      {age}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Dress Code
              </Text>
              <View style={styles.dressCodeButtons} className="flex-row flex-wrap">
                {['Casual', 'Smart Casual', 'Business', 'Cocktail', 'Formal', 'Themed'].map((dress) => (
                  <TouchableOpacity
                    key={dress}
                    style={[
                      styles.dressCodeButton,
                      formData.dressCode === dress && styles.selectedDressCodeButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.dressCode === dress ? 'bg-purple-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('dressCode', dress)}
                  >
                    <Text 
                      style={[
                        styles.dressCodeButtonText,
                        formData.dressCode === dress && styles.selectedDressCodeButtonText
                      ]}
                      className={formData.dressCode === dress ? 'text-white' : 'text-gray-700'}
                    >
                      {dress}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Requirements & Notes
              </Text>
              <View style={styles.requirementsGrid} className="flex-row flex-wrap">
                {[
                  'RSVP Required', 'ID Required', 'Vaccination Proof', 'Pre-payment',
                  'Bring Food/Drink', 'Photography Allowed', 'No Phone Policy'
                ].map((requirement) => (
                  <TouchableOpacity
                    key={requirement}
                    style={[
                      styles.requirementButton,
                      formData.requirements.includes(requirement) && styles.selectedRequirementButton
                    ]}
                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                      formData.requirements.includes(requirement) ? 'bg-purple-600' : 'bg-gray-100'
                    }`}
                    onPress={() => {
                      const currentRequirements = [...formData.requirements];
                      if (currentRequirements.includes(requirement)) {
                        updateField('requirements', currentRequirements.filter(r => r !== requirement));
                      } else {
                        updateField('requirements', [...currentRequirements, requirement]);
                      }
                    }}
                  >
                    <Text 
                      style={[
                        styles.requirementButtonText,
                        formData.requirements.includes(requirement) && styles.selectedRequirementButtonText
                      ]}
                      className={formData.requirements.includes(requirement) ? 'text-white text-xs' : 'text-gray-700 text-xs'}
                    >
                      {requirement}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Organizer Information
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Organizer Name *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Your name or organization"
                value={formData.organizer}
                onChangeText={(value) => updateField('organizer', value)}
              />
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="organizer@example.com"
                value={formData.contactEmail}
                onChangeText={(value) => updateField('contactEmail', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Contact Phone
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

            <View style={styles.disclaimer} className="bg-purple-50 p-4 rounded-lg mb-4">
              <Text style={styles.disclaimerText} className="text-purple-700 text-sm">
                🎉 Your event will be reviewed and published within 24 hours. Attendees can RSVP once it's live.
              </Text>
            </View>

            <View style={styles.termsNote} className="bg-gray-50 p-4 rounded-lg">
              <Text style={styles.termsText} className="text-gray-600 text-xs">
                By submitting this event, you agree to our Event Guidelines and Terms of Service. You're responsible for ensuring your event complies with local laws and regulations.
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
            className="bg-purple-600 h-full rounded-full"
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
            className="flex-1 bg-purple-600 py-3 rounded-lg ml-3"
            onPress={currentStep === 5 ? submitEvent : nextStep}
          >
            <Text style={styles.nextButtonText} className="text-center text-white font-medium">
              {currentStep === 5 ? 'Submit Event' : 'Next'}
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
