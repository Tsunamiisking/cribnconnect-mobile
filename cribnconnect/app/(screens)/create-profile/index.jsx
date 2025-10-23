import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
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

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    username: "",
    biography: "",
    interests: "",
    images: [],
    video: null,
  });

  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [uploading, setUploading] = useState(false);
  const maxBioChars = 300;
  const maxImages = 3;
  const [mediaFiles, setMediaFiles] = useState([]);

   const uploadPublicProfile = async () => {
    setLoading(true);
    
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const idToken = await user.getIdToken();

      const uploadFormData = new FormData();

      // Add text fields
      uploadFormData.append('username', formData.username);
      uploadFormData.append('bio', formData.biography);
      
      // Convert interests to array
      if (formData.interests) {
        const interestsArray = formData.interests.split(',').map(item => item.trim());
        uploadFormData.append('interests', JSON.stringify(interestsArray));
      }

      // Add images
      formData.images.forEach((image, index) => {
        uploadFormData.append('files', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `image_${index}.jpg`,
        });
      });

      // Add video
      if (formData.video) {
        uploadFormData.append('files', {
          uri: formData.video.uri,
          type: formData.video.type || 'video/mp4',
          name: formData.video.fileName || 'video.mp4',
        });
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_LINK}/uploads/public-profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: uploadFormData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile uploaded successfully!');
        // Reset form
        setFormData({
          username: '',
          biography: '',
          interests: '',
          images: [],
          video: null,
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      Alert.alert('Error', error.message);
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
      quality: 0.8,
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
      Alert.alert("Username Required", "Please enter a username to continue.");
      return;
    }

    if (formData.images.length === 0) {
      Alert.alert(
        "Photos Required",
        "Please add at least one photo to your profile."
      );
      return;
    }

    setLoading(true);

    // Process the data for API submission
    const processedFormData = {
      ...formData,
      // Process interests string into an array
      interests: formData.interests
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest !== ""),
      // For the API, we might want to keep just the URIs
      videoUri: formData.video?.uri || null,
    };

    // TODO: Add API integration for profile creation
    // Example API call:
    // try {
    //   // Create form data for multipart upload
    //   const apiFormData = new FormData();
    //
    //   // Add text fields
    //   apiFormData.append('username', processedFormData.username);
    //   apiFormData.append('biography', processedFormData.biography);
    //   apiFormData.append('interests', JSON.stringify(processedFormData.interests));
    //
    //   // Add images
    //   processedFormData.images.forEach((imageUri, index) => {
    //     const filename = imageUri.split('/').pop();
    //     const match = /\.(\w+)$/.exec(filename);
    //     const type = match ? `image/${match[1]}` : 'image';
    //     apiFormData.append('images', {
    //       uri: imageUri,
    //       name: filename,
    //       type
    //     });
    //   });
    //
    //   // Add video if exists
    //   if (processedFormData.videoUri) {
    //     const filename = processedFormData.videoUri.split('/').pop();
    //     const match = /\.(\w+)$/.exec(filename);
    //     const type = match ? `video/${match[1]}` : 'video/mp4';
    //     apiFormData.append('video', {
    //       uri: processedFormData.videoUri,
    //       name: filename,
    //       type
    //     });
    //   }
    //
    //   // Send to API
    //   const response = await fetch('https://your-api-url.com/profile', {
    //     method: 'POST',
    //     body: apiFormData,
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': 'Bearer YOUR_AUTH_TOKEN'
    //     }
    //   });
    //
    //   const result = await response.json();
    //   if (result.success) {
    //     router.replace('/(tabs)');
    //   } else {
    //     Alert.alert('Error', result.message || 'Failed to create profile');
    //   }
    // } catch (error) {
    //   console.error('Error creating profile:', error);
    //   Alert.alert('Error', 'Failed to create profile. Please try again.');
    // } finally {
    //   setLoading(false);
    // }

    console.log("Submitting profile data:", {
      username: processedFormData.username,
      biography: processedFormData.biography,
      interests: processedFormData.interests,
      imageCount: processedFormData.images.length,
      hasVideo: !!processedFormData.videoUri,
    });

    // Temporary navigation for demo
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
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
