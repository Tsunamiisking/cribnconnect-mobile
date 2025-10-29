import BackHeader from "@/components/BackHeader";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { getUserLocation } from "@/utils/userLocation";
import { Linking } from 'react-native';
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Camera, ImagePlus, Play, UserRound, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

export default function CreateProfile({ initialData = null, mode = "create" }) {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(
    initialData
      ? {
          username: initialData.username || "",
          biography: initialData.biography || "",
          interests: initialData.interests?.join(", ") || "",
          images: initialData.images || [],
          video: initialData.video || null,
        }
      : {
          username: "",
          biography: "",
          interests: "",
          images: [],
          video: null,
        }
  );

  const [characterCount, setCharacterCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const maxBioChars = 300;
  const maxImages = 3;
  const [mediaFiles, setMediaFiles] = useState([]);

  // corrected upload function — paste into your component

  const uploadPublicProfile = async () => {
    if (!isAuthenticated || !user) {
      Toast.show({
        text1: "Authentication Required",
        text2: "Please log in to create your profile",
        type: "danger",
      });
      return;
    }
    setUploading(true);

    try {
      // Get user location
      let location;
      try {
        location = await getUserLocation();
      } catch (locationError) {
        Alert.alert(
          "Location Required",
          "Location access is required to create a profile. Would you like to enable location services?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setUploading(false);
              },
            },
            {
              text: "Settings",
              onPress: async () => {
                setUploading(false);
                await Linking.openSettings();
              },
            },
          ]
        );
        return;
      }

      const idToken = await auth?.currentUser.getIdToken(true);
      // console.log("IdToken: ", idToken);

      if (!auth?.currentUser?.uid) {
        throw new Error("User ID not found. Please try logging in again.");
      }
      const uid = auth?.currentUser?.uid;

      const uploadFormData = new FormData();
      uploadFormData.append("uid", uid);
      uploadFormData.append("username", formData.username.trim());
      uploadFormData.append("bio", formData.biography.trim());

      // Add location data in the format expected by the backend
      const locationData = {
        type: "Point",
        coordinates: [location.longitude, location.latitude], // MongoDB expects [longitude, latitude]
      };
      uploadFormData.append("location", JSON.stringify(locationData));

      if (formData.interests.trim()) {
        const interestsArray = formData.interests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
        uploadFormData.append("interests", JSON.stringify(interestsArray));
      }

      // images (formData.images are URIs)
      formData.images.forEach((imageUri, index) => {
        const uri = imageUri.startsWith("file://") ? imageUri : imageUri;
        uploadFormData.append("files", {
          uri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      // single video (if present)
      if (formData.video) {
        const uri = formData.video.uri.startsWith("file://")
          ? formData.video.uri
          : formData.video.uri;
        uploadFormData.append("files", {
          uri,
          type: formData.video.type || "video/mp4",
          name: formData.video.fileName || "profile_video.mp4",
        });
      }

      // const API_BASE_URL = "https://cribnconnect-api.onrender.com";
      const url = `https://cribnconnect-api.onrender.com/api/uploads/public-profiles`;

      const resp = await axios.post(url, uploadFormData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          Accept: "application/json",
        },
      });

      Toast.show({
        text1: "Profile Upload Successful",
        text2: "Your public profile has been uploaded successfully",
        type: "success",
      });
      setFormData({
        username: "",
        biography: "",
        interests: "",
        images: [],
        video: null,
      });
      setMediaFiles([]);
      setCharacterCount(0);
      router.back();
      return resp.data;
    } catch (err) {
      console.error("Upload error:", err);
      // helpful debug logs
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || err.message;
      Toast.show({
        text1: `Upload failed`,
        text2: errorMessage,
        type: "danger",
      });
    } finally {
      setUploading(false);
    }
  };
  // Handle form input changes
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "biography") {
      setCharacterCount(value.length);
    }
  };

  // Generate video thumbnail
  const generateThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 1500, // get frame at 1.5s
      });
      return uri;
    } catch (e) {
      console.warn("Thumbnail generation failed:", e);
      return null;
    }
  };

  // Function to pick and add images
  const handleAddImage = async () => {
    if (formData.images.length >= maxImages) {
      Alert.alert(
        "Maximum Images",
        `You can only upload up to ${maxImages} images`
      );
      return;
    }

    // Request permission to access the media library
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to upload images."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: maxImages - formData.images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, maxImages),
      }));
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Function to pick and add video
  const handleAddVideo = async () => {
    if (formData.video) {
      Alert.alert(
        "Video Already Added",
        "You can only add one video. Please remove the existing video first."
      );
      return;
    }

    // Request permission to access the media library
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to upload videos."
      );
      return;
    }

    // Launch video picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60, // 60 seconds max
    });

    if (!result.canceled) {
      const videoUri = result.assets[0].uri;

      try {
        // Generate thumbnail for video preview
        const thumbnailUri = await generateThumbnail(videoUri);

        setFormData((prev) => ({
          ...prev,
          video: {
            uri: videoUri,
            thumbnail: thumbnailUri,
          },
        }));
      } catch (error) {
        console.error("Error adding video:", error);
        Alert.alert("Error", "Failed to process video. Please try again.");
      }
    }
  };

  // Remove video
  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: null,
    }));
  };

  // Submit profile creation form
  const handleSubmit = () => {
    // Basic validation
    if (!formData.username.trim()) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please enter a username to continue.",
        type: "warning",
      });
      return;
    }

    if (formData.images.length === 0) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please add at least one photo to your profile.",
        type: "warning",
      });
      return;
    }

    // Call the upload function
    uploadPublicProfile();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <BackHeader
          title={mode === "create" ? "Create Profile" : "Edit Profile"}
        />

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
                  <Image
                    source={{ uri: image }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
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
                  <Text style={styles.addMediaText}>
                    Add Photo
                    {formData.images.length > 0
                      ? ` (${formData.images.length}/${maxImages})`
                      : ""}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.videoContainer}>
              {formData.video ? (
                <View style={styles.videoWrapper}>
                  <Image
                    source={{
                      uri: formData.video.thumbnail || formData.video.uri,
                    }}
                    style={styles.videoPreview}
                    resizeMode="cover"
                  />
                  <View style={styles.videoIndicator}>
                    <Play size={14} color="white" />
                    <Text style={styles.videoIndicatorText}>Video</Text>
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
              <UserRound
                size={20}
                color={Colors.gray500}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your username"
                value={formData.username}
                onChangeText={(value) => updateField("username", value)}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Interests Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionSubtitle}>
              Enter your interests separated by commas (e.g., Fitness, Travel,
              Music)
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Fitness, Travel, Music, Gaming..."
                value={formData.interests}
                onChangeText={(value) => updateField("interests", value)}
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
              Tell others about yourself, your lifestyle, and what you're
              looking for
            </Text>

            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Share a bit about yourself..."
                value={formData.biography}
                onChangeText={(value) => {
                  if (value.length <= maxBioChars) {
                    updateField("biography", value);
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
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {mode === "create" ? "Create Profile" : "Save Changes"}
              </Text>
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
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 12,
  },
  imageWrapper: {
    width: "30%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addMediaButton: {
    width: "30%",
    aspectRatio: 3 / 4,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  videoButton: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  addMediaText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
  },
  videoContainer: {
    width: "100%",
  },
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  videoIndicatorText: {
    color: "white",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "Sora-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
  },

  bioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  characterCount: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
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
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    minHeight: 120,
  },
  createProfileButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
  },
});
