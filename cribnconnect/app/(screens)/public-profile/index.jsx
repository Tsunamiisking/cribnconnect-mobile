import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import MediaViewer from '@/components/MediaViewer';
import VideoPlayer from '@/components/VideoPlayer';
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationString } from '@/hooks/useLocationString';
import { pickImages, pickVideo } from '@/utils/mediaUtils';
import { getUserLocation } from "@/utils/userLocation";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { Edit, MapPin, Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import CreateProfile from "../create-profile";

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3; // 3 photos per row with gaps

export default function PublicProfile() {
  const { isAuthenticated } = useAuth();
  const userId = auth?.currentUser?.uid;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  
  // Use the location hook to get the formatted address
  const currentProfile = editedProfile || profile;
  const { locationString, loading: locationLoading } = useLocationString(currentProfile?.location);

  const allMedia = React.useMemo(() => {
    const currentProfile = editedProfile || profile;
    const media = [];
    
    // Add images
    if (currentProfile?.images) {
      media.push(...currentProfile.images.map(img => ({
        ...img,
        type: 'image'
      })));
    }
    
    // Add video if exists
    if (currentProfile?.video) {
      media.push({
        ...currentProfile.video,
        type: 'video'
      });
    }
    
    return media;
  }, [editedProfile, profile]);

  const handleMediaPress = (index) => {
    setSelectedMediaIndex(index);
    setShowMediaViewer(true);
  };

  const handleAddImage = async () => {
    const currentImages = editedProfile?.images || profile.images || [];
    const newImages = await pickImages(currentImages.length);
    
    if (newImages) {
      const newProfile = editedProfile ? { ...editedProfile } : { ...profile };
      newProfile.images = [...currentImages, ...newImages].slice(0, 3);
      setEditedProfile(newProfile);
      setIsEditing(true);
    }
  };

  const handleAddVideo = async () => {
    const newVideo = await pickVideo();
    
    if (newVideo) {
      const newProfile = editedProfile ? { ...editedProfile } : { ...profile };
      newProfile.video = newVideo;
      setEditedProfile(newProfile);
      setIsEditing(true);
    }
  };

  const handleRemoveMedia = (type, index) => {
    setIsEditing(true);
    const newProfile = editedProfile ? { ...editedProfile } : { ...profile };
    
    if (type === 'image') {
      const currentImages = newProfile.images || [];
      newProfile.images = currentImages.filter((_, i) => i !== index);
    } else if (type === 'video') {
      newProfile.video = null;
    }
    
    // Close media viewer if open and update edited profile
    setShowMediaViewer(false);
    setSelectedMediaIndex(null);
    setEditedProfile(newProfile);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
      return;
    }
    
    loadProfile();
  }, [isAuthenticated]);

  const handleSaveChanges = async () => {
    if (!editedProfile || !userId) return;
    
    setSaving(true);
    try {
      // Get the ID token for authentication
      const idToken = await auth?.currentUser?.getIdToken(true);
      
      // Create the update object with only the changed fields
      const updateData = {};
      
      if (editedProfile.username) updateData.username = editedProfile.username.trim();
      if (editedProfile.bio) updateData.bio = editedProfile.bio.trim();
      if (editedProfile.interests) updateData.interests = editedProfile.interests;
      if (editedProfile.location) updateData.location = editedProfile.location;
      if (editedProfile.images) updateData.images = editedProfile.images;
      if (editedProfile.video) updateData.video = editedProfile.video;

      // Make the PUT request with the update data
      const response = await api.put(`/public-profiles/${userId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      setProfile(response.data);
      setEditedProfile(null);
      setIsEditing(false);
      Toast.show({
        text1: "Success",
        text2: "Profile updated successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        text1: "Error",
        text2: "Failed to update profile. Please try again.",
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const loadProfile = async () => {
    if (!userId) {
      // Double check - redirect to login if no userId
      router.replace('/(auth)/login');
      return;
    }

    try {
      if (!userId) {
        throw new Error('No user ID available');
      }

      console.log('Attempting to fetch profile for userId:', userId);
      
      // Use the exact URL format that works in Postman
      const response = await api.get(`/public-profiles/${userId}`);
      
      // Log full response for debugging
      console.log("Profile request successful:", {
        status: response.status,
        hasData: !!response.data,
        dataType: typeof response.data
      });
      setProfile(response.data);
      setHasProfile(true);
    } catch (error) {
      console.error("Error loading profile:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 404) {
        setHasProfile(false);
      } else if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        router.replace('/(auth)/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Public Profile" />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // If no profile exists, show the create profile page
  if (!hasProfile) {
    return <CreateProfile />;
  }

  // If profile exists, show the profile view with edit capability
  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="My Public Profile" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Media Section */}
          <View style={styles.mediaSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScroll}
          >
            {(editedProfile?.images || profile.images)?.map((image, index) => (
              <View key={index} style={styles.mediaItem}>
                <TouchableOpacity onPress={() => handleMediaPress(index)}>
                  <Image
                    source={{ uri: image.url }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                {userId === auth?.currentUser?.uid && (
                  <TouchableOpacity 
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveMedia('image', index)}
                  >
                    <X size={20} color={Colors.white} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {/* Add photo placeholder only when images were removed */}
            {userId === auth?.currentUser?.uid && 
             editedProfile && 
             (!editedProfile.images || editedProfile.images.length < (profile.images?.length || 0)) && (
              <TouchableOpacity 
                style={[styles.mediaItem, styles.addMediaButton]}
                onPress={handleAddImage}
              >
                <Plus size={32} color={Colors.gray400} />
                <Text style={styles.addMediaText}>Add Photo</Text>
              </TouchableOpacity>
            )}
            {/* Video section */}
            {(editedProfile?.video || (!editedProfile && profile.video)) && (
              <View style={styles.mediaItem}>
                <TouchableOpacity onPress={() => handleMediaPress(allMedia.length - 1)} style={styles.videoContainer}>
                  <VideoPlayer videoUrl={(editedProfile?.video || profile.video).url} style={styles.mediaImage} />
                </TouchableOpacity>
                {userId === auth?.currentUser?.uid && (
                  <TouchableOpacity 
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveMedia('video', 0)}
                  >
                    <X size={20} color={Colors.white} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            {/* Video placeholder only when video was removed */}
            {userId === auth?.currentUser?.uid && 
             editedProfile?.video === null && 
             profile.video && (
              <TouchableOpacity 
                style={[styles.mediaItem, styles.addMediaButton]}
                onPress={handleAddVideo}
              >
                <Plus size={32} color={Colors.gray400} />
                <Text style={styles.addMediaText}>Add Video</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Profile Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.profileHeader}>
            <Text style={styles.username}>Username: {profile.username}</Text>
            {userId === auth?.currentUser?.uid && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Edit size={24} color={Colors.gray600} />
              </TouchableOpacity>
            )}
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Interests</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile?.interests?.join(", ") || profile.interests.join(", ")}
                onChangeText={(text) => {
                  const interests = text.split(",").map(i => i.trim()).filter(Boolean);
                  setEditedProfile(prev => ({ ...prev, interests }));
                }}
                placeholder="Separate interests with commas"
              />
            ) : (
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bio</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile?.bio || profile.bio}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
                placeholder="Tell others about yourself..."
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.bioText}>{profile.bio}</Text>
            )}
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            {isEditing ? (
              <View style={styles.locationEditContainer}>
                <TouchableOpacity 
                  style={styles.updateLocationButton}
                  onPress={async () => {
                    try {
                      const location = await getUserLocation();
                      const newLocation = {
                        type: "Point",
                        coordinates: [location.longitude, location.latitude]
                      };
                      setEditedProfile(prev => ({
                        ...prev,
                        location: newLocation
                      }));
                      Toast.show({
                        text1: 'Location Updated',
                        text2: 'Your location has been updated successfully',
                        type: 'success',
                        visibilityTime: 2000
                      });
                    } catch (error) {
                      console.error('Error updating location:', error);
                      Toast.show({
                        text1: 'Error',
                        text2: error.message || 'Failed to update location',
                        type: 'error'
                      });
                    }
                  }}
                >
                  <MapPin size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.updateLocationText}>Use Current Location</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>- OR -</Text>

                <View style={styles.addressInputContainer}>
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Enter your address"
                    value={editedProfile?.manualAddress || ''}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, manualAddress: text }))}
                  />
                  <TouchableOpacity 
                    style={styles.searchAddressButton}
                    onPress={async () => {
                      try {
                        if (!editedProfile?.manualAddress) {
                          Toast.show({
                            text1: 'Error',
                            text2: 'Please enter an address',
                            type: 'error'
                          });
                          return;
                        }

                        const [result] = await Location.geocodeAsync(editedProfile.manualAddress);
                        
                        if (!result) {
                          throw new Error('Address not found');
                        }

                        const newLocation = {
                          type: "Point",
                          coordinates: [result.longitude, result.latitude]
                        };

                        setEditedProfile(prev => ({
                          ...prev,
                          location: newLocation
                        }));

                        Toast.show({
                          text1: 'Location Updated',
                          text2: 'Address has been converted to coordinates successfully',
                          type: 'success',
                          visibilityTime: 2000
                        });
                      } catch (error) {
                        console.error('Error geocoding address:', error);
                        Toast.show({
                          text1: 'Error',
                          text2: error.message || 'Failed to convert address to location',
                          type: 'error'
                        });
                      }
                    }}
                  >
                    <Text style={styles.searchAddressButtonText}>Search</Text>
                  </TouchableOpacity>
                </View>

                {editedProfile?.location && !locationLoading ? (
                  <Text style={styles.locationCoordinates}>
                    Current Location: {locationString}
                  </Text>
                ) : editedProfile?.location && locationLoading ? (
                  <View style={styles.locationLoadingContainer}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={[styles.locationCoordinates, { marginLeft: 8 }]}>
                      Getting location details...
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : locationLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.locationText}>
                {locationString}
              </Text>
            )}
          </View>

          {/* Save Changes Button */}
          {isEditing && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <MediaViewer
        visible={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        media={allMedia}
        initialIndex={selectedMediaIndex || 0}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mediaSection: {
    marginVertical: 16,
  },
  mediaScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  mediaItem: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.gray100,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    fontSize: 26,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray900,
    flex: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray900,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  interestText: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
  },
  bioText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    lineHeight: 26,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    lineHeight: 24,
  },
  locationEditContainer: {
    marginTop: 8,
  },
  updateLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    padding: 16,
  },
  updateLocationText: {
    fontSize: 16,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
  },
  locationCoordinates: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  locationLoadingContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    backgroundColor: Colors.gray50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    letterSpacing: 0.5,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.gray500,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    backgroundColor: Colors.white,
  },
  searchAddressButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchAddressButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Sora-Medium",
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
  },
  addMediaText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.gray600,
  },
});
