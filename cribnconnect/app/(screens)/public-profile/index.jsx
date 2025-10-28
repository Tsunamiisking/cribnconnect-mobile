import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import MediaViewer from '@/components/MediaViewer';
import VideoPlayer from '@/components/VideoPlayer';
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { pickImages, pickVideo } from '@/utils/mediaUtils';
import { router } from "expo-router";
import { Edit, Plus, X } from "lucide-react-native";
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
      const response = await api.put(`/public-profiles/${userId}`, editedProfile);
      setProfile(response.data);
      setEditedProfile(null);
      setIsEditing(false);
      toast.show("Profile updated successfully!", { type: "success" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.show("Failed to update profile. Please try again.", { type: "danger" });
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
                <TouchableOpacity onPress={() => handleMediaPress(allMedia.length - 1)}>
                  <VideoPlayer videoUrl={(editedProfile?.video || profile.video).url} />
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
          <Text style={styles.username}>{profile.username}</Text>

          {/* Interests Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Interests</Text>
              {userId === auth?.currentUser?.uid && (
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Edit size={20} color={Colors.gray600} />
                </TouchableOpacity>
              )}
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
              {userId === auth?.currentUser?.uid && (
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Edit size={20} color={Colors.gray600} />
                </TouchableOpacity>
              )}
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
  username: {
    fontSize: 28,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 8,
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
    fontSize: 20,
    fontFamily: "Urbanist-Bold",
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
