import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function AddLinkupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    type: '',
    
    // Details
    groupSize: '',
    duration: '',
    ageRange: '',
    genderPreference: '',
    
    // Schedule
    frequency: '',
    preferredTimes: [],
    flexibleSchedule: false,
    
    // Preferences
    interests: [],
    location: '',
    meetingSpot: '',
    
    // Contact
    hostName: '',
    contactMethod: '',
    contactInfo: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitLinkup = () => {
    // TODO: Add API integration to submit linkup
    // Example API call:
    // try {
    //   const response = await api.createLinkup(formData);
    //   if (response.success) {
    //     router.push('/(tabs)/linkups');
    //   }
    // } catch (error) {
    //   // Handle error
    // }
    
    console.log('Submitting linkup:', formData);
    router.push('/(tabs)/linkups');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Linkup Information
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Linkup Title *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., Weekend Hiking Group"
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
                placeholder="What kind of people are you looking to connect with? What activities will you do together?"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Linkup Type *
              </Text>
              <View style={styles.typeButtons} className="flex-row flex-wrap">
                {[
                  'Activity Partner', 'Study Group', 'Workout Buddy', 'Social Circle', 
                  'Professional Network', 'Hobby Group', 'Travel Companion', 'Food Explorer'
                ].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && styles.selectedTypeButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.type === type ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('type', type)}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        formData.type === type && styles.selectedTypeButtonText
                      ]}
                      className={formData.type === type ? 'text-white text-xs' : 'text-gray-700 text-xs'}
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
              Group Preferences
            </Text>
            
            <View style={styles.inputRow} className="flex-row space-x-4 mb-4">
              <View style={styles.inputGroup} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Ideal Group Size
                </Text>
                <View style={styles.sizeButtons} className="flex-row flex-wrap">
                  {['2-3 people', '4-6 people', '7-10 people', '10+ people'].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        formData.groupSize === size && styles.selectedSizeButton
                      ]}
                      className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                        formData.groupSize === size ? 'bg-green-600' : 'bg-gray-100'
                      }`}
                      onPress={() => updateField('groupSize', size)}
                    >
                      <Text 
                        style={[
                          styles.sizeButtonText,
                          formData.groupSize === size && styles.selectedSizeButtonText
                        ]}
                        className={formData.groupSize === size ? 'text-white text-xs' : 'text-gray-700 text-xs'}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Commitment Level
              </Text>
              <View style={styles.durationButtons} className="flex-row flex-wrap">
                {['One-time', 'Weekly', 'Bi-weekly', 'Monthly', 'Ongoing/Flexible'].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationButton,
                      formData.duration === duration && styles.selectedDurationButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.duration === duration ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('duration', duration)}
                  >
                    <Text 
                      style={[
                        styles.durationButtonText,
                        formData.duration === duration && styles.selectedDurationButtonText
                      ]}
                      className={formData.duration === duration ? 'text-white text-xs' : 'text-gray-700 text-xs'}
                    >
                      {duration}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Age Range Preference
              </Text>
              <View style={styles.ageButtons} className="flex-row flex-wrap">
                {['Any Age', '18-25', '26-35', '36-45', '46+'].map((age) => (
                  <TouchableOpacity
                    key={age}
                    style={[
                      styles.ageButton,
                      formData.ageRange === age && styles.selectedAgeButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.ageRange === age ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('ageRange', age)}
                  >
                    <Text 
                      style={[
                        styles.ageButtonText,
                        formData.ageRange === age && styles.selectedAgeButtonText
                      ]}
                      className={formData.ageRange === age ? 'text-white' : 'text-gray-700'}
                    >
                      {age}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Gender Preference
              </Text>
              <View style={styles.genderButtons} className="flex-row flex-wrap">
                {['No Preference', 'Women Only', 'Men Only', 'Mixed Group'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      formData.genderPreference === gender && styles.selectedGenderButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.genderPreference === gender ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('genderPreference', gender)}
                  >
                    <Text 
                      style={[
                        styles.genderButtonText,
                        formData.genderPreference === gender && styles.selectedGenderButtonText
                      ]}
                      className={formData.genderPreference === gender ? 'text-white' : 'text-gray-700'}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Interests & Location
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Shared Interests *
              </Text>
              <Text style={styles.helper} className="text-xs text-gray-500 mb-3">
                Select activities or topics you'd like to explore together
              </Text>
              <View style={styles.interestsGrid} className="flex-row flex-wrap">
                {[
                  'Hiking', 'Fitness', 'Photography', 'Cooking', 'Reading', 'Movies',
                  'Music', 'Travel', 'Art', 'Gaming', 'Sports', 'Dancing',
                  'Yoga', 'Food Tours', 'Museums', 'Networking', 'Tech', 'Fashion'
                ].map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestButton,
                      formData.interests.includes(interest) && styles.selectedInterestButton
                    ]}
                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                      formData.interests.includes(interest) ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                    onPress={() => {
                      const currentInterests = [...formData.interests];
                      if (currentInterests.includes(interest)) {
                        updateField('interests', currentInterests.filter(i => i !== interest));
                      } else {
                        updateField('interests', [...currentInterests, interest]);
                      }
                    }}
                  >
                    <Text 
                      style={[
                        styles.interestButtonText,
                        formData.interests.includes(interest) && styles.selectedInterestButtonText
                      ]}
                      className={formData.interests.includes(interest) ? 'text-white text-xs' : 'text-gray-700 text-xs'}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Preferred Area/Neighborhood *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="e.g., Manhattan, Brooklyn Heights, etc."
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Typical Meeting Spots
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Coffee shops, parks, gyms, etc. Where would you usually meet?"
                value={formData.meetingSpot}
                onChangeText={(value) => updateField('meetingSpot', value)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.scheduleNote} className="bg-green-50 p-4 rounded-lg">
              <Text style={styles.scheduleText} className="text-green-700 text-sm">
                🗓️ Don't worry about exact schedules yet - you can coordinate timing with interested members later!
              </Text>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} className="text-2xl font-bold text-gray-900 mb-6">
              Contact & Final Details
            </Text>
            
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Your Name (Host) *
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="How should people refer to you?"
                value={formData.hostName}
                onChangeText={(value) => updateField('hostName', value)}
              />
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method *
              </Text>
              <View style={styles.contactButtons} className="flex-row flex-wrap">
                {['App Messaging', 'WhatsApp', 'Email', 'Instagram', 'Phone'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.contactButton,
                      formData.contactMethod === method && styles.selectedContactButton
                    ]}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.contactMethod === method ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                    onPress={() => updateField('contactMethod', method)}
                  >
                    <Text 
                      style={[
                        styles.contactButtonText,
                        formData.contactMethod === method && styles.selectedContactButtonText
                      ]}
                      className={formData.contactMethod === method ? 'text-white' : 'text-gray-700'}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {formData.contactMethod && formData.contactMethod !== 'App Messaging' && (
              <View style={styles.inputGroup} className="mb-4">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  {formData.contactMethod === 'WhatsApp' || formData.contactMethod === 'Phone' ? 'Phone Number' :
                   formData.contactMethod === 'Email' ? 'Email Address' :
                   formData.contactMethod === 'Instagram' ? 'Instagram Handle' : 'Contact Info'} *
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder={
                    formData.contactMethod === 'WhatsApp' || formData.contactMethod === 'Phone' ? '(555) 123-4567' :
                    formData.contactMethod === 'Email' ? 'your.email@example.com' :
                    formData.contactMethod === 'Instagram' ? '@username' : 'Your contact info'
                  }
                  value={formData.contactInfo}
                  onChangeText={(value) => updateField('contactInfo', value)}
                  keyboardType={
                    formData.contactMethod === 'WhatsApp' || formData.contactMethod === 'Phone' ? 'phone-pad' :
                    formData.contactMethod === 'Email' ? 'email-address' : 'default'
                  }
                  autoCapitalize={formData.contactMethod === 'Email' ? 'none' : 'sentences'}
                />
              </View>
            )}

            <View style={styles.privacyNote} className="bg-blue-50 p-4 rounded-lg mb-4">
              <Text style={styles.privacyText} className="text-blue-700 text-sm">
                🔒 Your contact info will only be shared with people you approve to join your linkup group.
              </Text>
            </View>

            <View style={styles.disclaimer} className="bg-green-50 p-4 rounded-lg mb-4">
              <Text style={styles.disclaimerText} className="text-green-700 text-sm">
                🤝 Your linkup will be live immediately! People can express interest and you'll get notified to approve or decline.
              </Text>
            </View>

            <View style={styles.safetyNote} className="bg-yellow-50 p-4 rounded-lg">
              <Text style={styles.safetyText} className="text-yellow-700 text-xs">
                Safety Reminder: Always meet in public places first, trust your instincts, and let someone know where you're going. Read our Safety Guidelines for more tips.
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
          Step {currentStep} of 4
        </Text>
        <View style={styles.progressBar} className="bg-gray-200 h-2 rounded-full">
          <View 
            style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} 
            className="bg-green-600 h-full rounded-full"
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
            className="flex-1 bg-green-600 py-3 rounded-lg ml-3"
            onPress={currentStep === 4 ? submitLinkup : nextStep}
          >
            <Text style={styles.nextButtonText} className="text-center text-white font-medium">
              {currentStep === 4 ? 'Create Linkup' : 'Next'}
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
    backgroundColor: '#059669',
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
    marginBottom: 12,
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
    height: 80,
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
    backgroundColor: '#059669',
  },
  typeButtonText: {
    color: '#374151',
    fontSize: 12,
  },
  selectedTypeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  sizeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSizeButton: {
    backgroundColor: '#059669',
  },
  sizeButtonText: {
    color: '#374151',
    fontSize: 12,
  },
  selectedSizeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedDurationButton: {
    backgroundColor: '#059669',
  },
  durationButtonText: {
    color: '#374151',
    fontSize: 12,
  },
  selectedDurationButtonText: {
    color: 'white',
    fontSize: 12,
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
    backgroundColor: '#059669',
  },
  ageButtonText: {
    color: '#374151',
  },
  selectedAgeButtonText: {
    color: 'white',
  },
  genderButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedGenderButton: {
    backgroundColor: '#059669',
  },
  genderButtonText: {
    color: '#374151',
  },
  selectedGenderButtonText: {
    color: 'white',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedInterestButton: {
    backgroundColor: '#059669',
  },
  interestButtonText: {
    color: '#374151',
    fontSize: 12,
  },
  selectedInterestButtonText: {
    color: 'white',
    fontSize: 12,
  },
  contactButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedContactButton: {
    backgroundColor: '#059669',
  },
  contactButtonText: {
    color: '#374151',
  },
  selectedContactButtonText: {
    color: 'white',
  },
  scheduleNote: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
  },
  scheduleText: {
    color: '#15803d',
    fontSize: 14,
  },
  privacyNote: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
  },
  privacyText: {
    color: '#1d4ed8',
    fontSize: 14,
  },
  disclaimer: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
  },
  disclaimerText: {
    color: '#15803d',
    fontSize: 14,
  },
  safetyNote: {
    backgroundColor: '#fefce8',
    padding: 16,
    borderRadius: 8,
  },
  safetyText: {
    color: '#a16207',
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
    backgroundColor: '#059669',
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
