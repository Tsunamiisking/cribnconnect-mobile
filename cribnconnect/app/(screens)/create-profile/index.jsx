import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Camera, ImagePlus, UserRound, Video, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    username: '',
    biography: '',
    interests: '',
    images: [],
    video: null,
  });
  
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const maxBioChars = 300;
  const maxImages = 3;

  // Handle form input changes
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'biography') {
      setCharacterCount(value.length);
    }
  };

  // Mock function to add image
  const handleAddImage = () => {
    if (formData.images.length >= maxImages) return;
    
    // In a real app, you'd integrate with image picker
    // For now, we'll add a mock image
    const mockImages = [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
    ];
    
    const newImage = mockImages[formData.images.length];
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage],
    }));
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Mock function to add video
  const handleAddVideo = () => {
    // In a real app, you'd integrate with video picker
    setFormData(prev => ({
      ...prev,
      video: 'https://example.com/mock-video.mp4', // Mock video URL
    }));
  };

  // Remove video
  const handleRemoveVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: null,
    }));
  };

  // Submit profile creation form
  const handleSubmit = () => {
    setLoading(true);
    
    // Process the interests string into an array (for API compatibility)
    const processedFormData = {
      ...formData,
      interests: formData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest !== '')
    };
    
    // TODO: Add API integration for profile creation
    // Example API call:
    // try {
    //   const response = await api.createProfile(processedFormData);
    //   if (response.success) {
    //     // Navigate to main app
    //     router.replace('/(tabs)');
    //   }
    // } catch (error) {
    //   // Handle profile creation error
    // }
    
    console.log('Submitting profile with interests:', processedFormData.interests);
    
    // Temporary navigation for demo
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <BackHeader title="Create Profile" />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Photo & Video Section */}
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Profile Media</Text>
            <Text style={styles.sectionSubtitle}>
              Add up to 3 photos and 1 video to showcase your personality
            </Text>
            
            <View style={styles.imagesContainer}>
              {formData.images.map((image, index) => (
                <View key={`image-${index}`} style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <X size={16} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {formData.images.length < maxImages && (
                <TouchableOpacity 
                  style={styles.addMediaButton}
                  onPress={handleAddImage}
                >
                  <ImagePlus size={32} color={Colors.primary} />
                  <Text style={styles.addMediaText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.videoContainer}>
              {formData.video ? (
                <View style={styles.videoWrapper}>
                  {/* In a real app, you'd show a video thumbnail or player */}
                  <View style={styles.videoPreview}>
                    <Video size={32} color={Colors.white} />
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={handleRemoveVideo}
                  >
                    <X size={16} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.addMediaButton, styles.videoButton]}
                  onPress={handleAddVideo}
                >
                  <Camera size={32} color={Colors.primary} />
                  <Text style={styles.addMediaText}>Add Video</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Username Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Username</Text>
            <Text style={styles.sectionSubtitle}>
              Choose a unique username for your profile
            </Text>
            
            <View style={styles.inputContainer}>
              <UserRound size={20} color={Colors.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your username"
                value={formData.username}
                onChangeText={(value) => updateField('username', value)}
                autoCapitalize="none"
              />
            </View>
          </View>
          
          {/* Interests Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionSubtitle}>
              Enter your interests separated by commas (e.g., Fitness, Travel, Music)
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Fitness, Travel, Music, Gaming..."
                value={formData.interests}
                onChangeText={(value) => updateField('interests', value)}
              />
            </View>
          </View>
          
          {/* Biography Section */}
          <View style={styles.formSection}>
            <View style={styles.bioHeader}>
              <Text style={styles.sectionTitle}>Biography</Text>
              <Text style={styles.characterCount}>
                {characterCount}/{maxBioChars}
              </Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Tell others about yourself, your lifestyle, and what you're looking for
            </Text>
            
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Share a bit about yourself..."
                value={formData.biography}
                onChangeText={(value) => {
                  if (value.length <= maxBioChars) {
                    updateField('biography', value);
                  }
                }}
                multiline
                numberOfLines={5}
                maxLength={maxBioChars}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Create Profile Button */}
          <TouchableOpacity 
            style={styles.createProfileButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Create Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mediaSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: Colors.gray900,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 3/4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMediaButton: {
    width: '30%',
    aspectRatio: 3/4,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoButton: {
    width: '100%',
    aspectRatio: 16/9,
  },
  addMediaText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  videoContainer: {
    width: '100%',
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray50,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray800,
  },

  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    backgroundColor: Colors.gray50,
    padding: 16,
  },
  textArea: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray800,
    minHeight: 120,
  },
  createProfileButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  }
});