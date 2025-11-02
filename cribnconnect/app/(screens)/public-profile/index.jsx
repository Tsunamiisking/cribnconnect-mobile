import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import MediaViewer from '@/components/MediaViewer';
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationString } from '@/hooks/useLocationString';
import { pickImages, pickVideo } from '@/utils/mediaUtils';
import { getUserLocation } from "@/utils/userLocation";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { Edit, MapPin, Play, Plus, X } from "lucide-react-native";
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
    if (currentProfile?.images && Array.isArray(currentProfile.images)) {
      const validImages = currentProfile.images.filter(img => {
        if (!img) return false;
        const hasValidUrl = typeof img.url === 'string' && img.url.length > 0;
        if (!hasValidUrl) {
          console.warn('Invalid image found:', img);
        }
        return hasValidUrl;
      });
      media.push(...validImages.map(img => ({
        type: 'image',
        url: img.url,
        resource_type: img.resource_type || 'image',
        isPrimary: img.isPrimary || false
      })));
    }
    
    // Add video if exists and has a valid URL
    if (currentProfile?.video && currentProfile.video.url) {
      media.push({
        type: 'video',
        url: currentProfile.video.url,
        resource_type: currentProfile.video.resource_type || 'video',
        isPrimary: currentProfile.video.isPrimary || false,
        thumbnailUrl: currentProfile.video.thumbnail_url // Include thumbnail if available
      });
    }
    
    return media;
  }, [editedProfile, profile]);

  const handleMediaPress = (index) => {
    setSelectedMediaIndex(index);
    setShowMediaViewer(true);
  };

  const handleAddImage = async () => {
    const currentImages = editedProfile?.images || profile?.images || [];
    if (currentImages.length >= 3) {
      Toast.show({
        text1: "Maximum Images",
        text2: "You can only upload up to 3 images",
        type: "warning"
      });
      return;
    }

    try {
      const newImages = await pickImages(currentImages.length);
      
      if (newImages && newImages.length > 0) {
        console.log('Received images:', JSON.stringify(newImages, null, 2));
        const newProfile = editedProfile ? { ...editedProfile } : { ...profile };
        // Properly format the new images with their URIs
        const formattedNewImages = newImages.map(image => {
          // Handle both object with uri/url and direct string URI
          let imageUri;
          if (typeof image === 'string') {
            imageUri = image;
          } else if (image.uri) {
            imageUri = image.uri;
          } else if (image.url) {
            imageUri = image.url;
          } else {
            console.warn('Invalid image format:', image);
            return null;
          }

          return {
            url: imageUri,
            resource_type: "image",
            isPrimary: false
          };
        }).filter(Boolean); // Remove any null entries
        
        // Initialize images array if it doesn't exist
        if (!newProfile.images) {
          newProfile.images = [];
        }
        
        newProfile.images = [...(newProfile.images || []), ...formattedNewImages].slice(0, 3);
        setEditedProfile(newProfile);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error adding images:', error);
      Toast.show({
        text1: "Error",
        text2: "Failed to add images. Please try again.",
        type: "error"
      });
    }
  };

  const handleAddVideo = async () => {
    // Check if there's actually a video in the current state
    const currentVideo = editedProfile?.video || (!editedProfile && profile?.video);
    
    if (currentVideo) {
      Toast.show({
        text1: "Video Already Exists",
        text2: "Please remove the existing video before adding a new one",
        type: "warning"
      });
      return;
    }

    try {
      const newVideo = await pickVideo();
      
      if (newVideo) {
        console.log('Received video:', newVideo); // Debug log
        
        const newProfile = editedProfile ? { ...editedProfile } : { ...profile };
        // Handle different video object structures
        let videoUrl;
        // pickVideo returns an object like { url, thumbnail, type }
        if (typeof newVideo === 'string') {
          videoUrl = newVideo;
        } else if (newVideo.uri) {
          videoUrl = newVideo.uri;
        } else if (newVideo.url) {
          videoUrl = newVideo.url;
        } else {
          console.warn('Invalid video format:', newVideo);
          throw new Error('Invalid video format received');
        }

        // Prefer the thumbnail returned by pickVideo (field `thumbnail`),
        // but also accept `thumbnail_url` if present. Store as `thumbnail_url` so
        // other code (carousel / MediaViewer) can use the same key.
        const thumbnailUri = newVideo.thumbnail || newVideo.thumbnail_url || null;

        newProfile.video = {
          url: videoUrl,
          resource_type: "video",
          isPrimary: false,
          thumbnail_url: thumbnailUri,
        };
        
        console.log('Added video with URL:', videoUrl);
        setEditedProfile(newProfile);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error adding video:', error);
      Toast.show({
        text1: "Error",
        text2: "Failed to add video. Please try again.",
        type: "error"
      });
    }
  };

  const handleRemoveMedia = (type, index) => {
    setIsEditing(true);
    const newProfile = editedProfile ? { ...editedProfile } : { ...profile };
    
    // Always close the media viewer first to prevent any undefined media access
    setShowMediaViewer(false);
    setSelectedMediaIndex(null);
    
    if (type === 'image') {
      // Ensure we have a valid images array
      const currentImages = newProfile.images || [];
      newProfile.images = currentImages.filter((_, i) => i !== index);
    } else if (type === 'video') {
      newProfile.video = null;
    }
    
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
      
      // Create FormData for file uploads
      const uploadFormData = new FormData();
      
      // Add basic fields
      if (editedProfile.username) uploadFormData.append("username", editedProfile.username.trim());
      if (editedProfile.bio) uploadFormData.append("bio", editedProfile.bio.trim());
      if (editedProfile.interests) uploadFormData.append("interests", JSON.stringify(editedProfile.interests));
      if (editedProfile.location) uploadFormData.append("location", JSON.stringify(editedProfile.location));

      // Handle images
      if (editedProfile.images && Array.isArray(editedProfile.images)) {
        // Separate new and existing images
        const { newImages, existingImages } = editedProfile.images.reduce((acc, img) => {
          if (!img || !img.url) {
            console.warn('Invalid image object:', img);
            return acc;
          }
          
          if (img.url.startsWith('file://') || img.url.startsWith('content://')) {
            acc.newImages.push(img);
          } else {
            acc.existingImages.push(img);
          }
          return acc;
        }, { newImages: [], existingImages: [] });

        console.log('New images to upload:', JSON.stringify(newImages, null, 2));
        console.log('Existing images to keep:', JSON.stringify(existingImages, null, 2));

        // Add new images to files array
        newImages.forEach((img, index) => {
          uploadFormData.append("files", {
            uri: img.url,
            type: "image/jpeg",
            name: `image_${index}.jpg`,
          });
        });

        // Set existing images in the images field
        uploadFormData.append("images", JSON.stringify(existingImages));
      }

      // Handle video
      if (editedProfile.video) {
        if (editedProfile.video.url?.startsWith('file://')) {
          // New video that needs to be uploaded
          uploadFormData.append("files", {
            uri: editedProfile.video.url,
            type: "video/mp4",
            name: "profile_video.mp4",
          });
          // Don't set video field as it will be processed from files
        } else {
          // Existing Cloudinary video
          uploadFormData.append("video", JSON.stringify(editedProfile.video));
        }
      } else if (editedProfile.video === null) {
        // Explicitly set video to null if it was removed
        uploadFormData.append("video", "null");
      }

      // Make the PUT request with FormData
      // Let axios/set the multipart Content-Type (with boundary) automatically.
      // Manually setting 'Content-Type' can break the boundary header and
      // cause the server to not parse uploaded files, resulting in raw
      // file:// URIs being persisted (see edited.json symptom).
      const response = await api.put(`/public-profiles/${userId}`, uploadFormData, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
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
            {(editedProfile?.images || profile?.images || []).map((image, index) => (
              <View key={index} style={styles.mediaItem}>
                <TouchableOpacity onPress={() => handleMediaPress(index)}>
                  {image && image.url ? (
                    <Image
                      source={{ uri: image.url }}
                      style={styles.mediaImage}
                      resizeMode="cover"
                      defaultSource={require('@/assets/images/default-avatar.jpg')}
                      onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
                    />
                  ) : null}
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
            {/* Add photo placeholder when in edit mode and less than 3 images */}
            {userId === auth?.currentUser?.uid && 
             isEditing && 
             ((editedProfile?.images || []).length < 3) && (
              <TouchableOpacity 
                style={[styles.mediaItem, styles.addMediaButton]}
                onPress={handleAddImage}
              >
                <Plus size={32} color={Colors.gray400} />
                <Text style={styles.addMediaText}>Add Photo ({(editedProfile?.images || []).length}/3)</Text>
              </TouchableOpacity>
            )}
            {/* Video section */}
            {(editedProfile?.video || (!editedProfile && profile?.video)) && (
              <View style={styles.mediaItem}>
                <TouchableOpacity onPress={() => handleMediaPress(allMedia.length - 1)} style={styles.videoContainer}>
                  <Image
                    source={{ 
                      uri: (editedProfile?.video?.thumbnail_url || profile?.video?.thumbnail_url) || 
                          require('@/assets/images/default-avatar.jpg')
                    }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                  <View style={styles.videoOverlay}>
                    <View style={styles.playButton}>
                      <Play size={24} color={Colors.white} style={styles.playIcon} />
                    </View>
                  </View>
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
            {/* Video placeholder when in edit mode and no video */}
            {userId === auth?.currentUser?.uid && 
             isEditing && 
             !editedProfile?.video && (
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playIcon: {
    marginLeft: 4, // Adjust for the visual center due to play icon shape
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
