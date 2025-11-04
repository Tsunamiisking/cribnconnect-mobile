import BackHeader from "@/components/BackHeader";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { createLinkupGroupChat } from "@/services/linkupChatService";
import { pickImages } from "@/utils/mediaUtils";
import { router } from "expo-router";
import { Globe, ImagePlus, Lock, Users, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import api from "../../../api/api";

/**
 * CreateLinkupScreen
 * - Simplified linkup creation process
 * - Essential fields only for quick group creation
 */
export default function CreateLinkupScreen() {
  const [loading, setLoading] = useState(false);
  const [interestsText, setInterestsText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    interests: [],
    maxPeople: "",
    isPrivate: false,
    privacy: "public", // "public" or "private"
    photo: null,
  });

  const privacyOptions = [
    {
      id: "public",
      name: "Public",
      description: "Anyone can find and join",
      icon: Globe,
    },
    { id: "private", name: "Private", description: "Invite only", icon: Lock },
  ];

  const handleCreate = async () => {
    // Simple validation - only name and interests are required
    if (!formData.name || formData.interests.length === 0) {
      alert("Please enter a group name and at least one interest");
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData if photo exists, otherwise send JSON
      let requestData;
      
      if (formData.photo) {
        // Photo exists - send as FormData
        requestData = new FormData();
        
        // Add the image file - match the pattern from public-profile
        const filename = formData.photo.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        // Important: Use 'files' as the field name to match backend multer uploadArray('files')
        requestData.append('files', {
          uri: formData.photo,
          name: filename,
          type: type,
        });
        
        // Add other form fields
        requestData.append('name', formData.name);
        requestData.append('description', formData.description || '');
        requestData.append('interests', JSON.stringify(formData.interests));
        if (formData.maxPeople) {
          requestData.append('maxPeople', formData.maxPeople);
        }
        requestData.append('isPrivate', formData.isPrivate.toString());
        requestData.append('privacy', formData.privacy);
      } else {
        // No photo - send as JSON (backend will generate default image)
        requestData = {
          name: formData.name,
          description: formData.description,
          interests: formData.interests,
          maxPeople: formData.maxPeople || null,
          isPrivate: formData.isPrivate,
          privacy: formData.privacy,
        };
      }
      
      const response = await api.post('/linkups', requestData);
      
      // Create Firebase group chat for the linkup
      const linkupId = response.data._id || response.data.id;
      const currentUser = auth.currentUser;
      
      if (linkupId && currentUser) {
        try {
          await createLinkupGroupChat(
            linkupId,
            {
              name: formData.name,
              photo: response.data.photo?.url || formData.photo,
              description: formData.description,
            },
            currentUser.uid,
            {
              name: currentUser.displayName || 'Unknown User',
              photoURL: currentUser.photoURL || null,
            }
          );
          console.log('Group chat created for linkup:', linkupId);
        } catch (chatError) {
          console.error('Error creating group chat:', chatError);
          // Don't fail the whole creation if chat fails
        }
      }
      
      Toast.show({
        text1: "Success",
        text2: "Linkup created successfully!",
        type: "success"
      });
      
      // Navigate back to linkups screen
      router.back();
    } catch(error) {
      console.error('Error creating linkup:', error);
      console.error('Error response:', error.response?.data);
      Toast.show({
        text1: "Error",
        text2: error.response?.data?.message || "Failed to create linkup. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateInterests = (text) => {
    setInterestsText(text);
    const interestsArray = text.split(",").map(i => i.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, interests: interestsArray }));
  };

  const handleAddImage = async () => {
    if (formData.photo) {
      Toast.show({
        text1: "Image Already Added",
        text2: "Please remove the existing image before adding a new one",
        type: "warning"
      });
      return;
    }

    try {
      const newImages = await pickImages(0, 1); // Only allow 1 image
      
      if (newImages && newImages.length > 0) {
        const imageUri = newImages[0].url;
        setFormData((prev) => ({ ...prev, photo: imageUri }));
      }
    } catch (error) {
      console.error('Error adding image:', error);
      Toast.show({
        text1: "Error",
        text2: "Failed to add image. Please try again.",
        type: "error"
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <BackHeader title="Create Linkup" showUser={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Photo */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Photo (Optional)</Text>
          <Text style={styles.subtitle}>
            Add a photo to make your group stand out
          </Text>
          
          {formData.photo ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: formData.photo }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveImage}
              >
                <X size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleAddImage}
            >
              <ImagePlus size={32} color={Colors.primary} />
              <Text style={styles.addPhotoText}>Add Group Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Group Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Coffee & Code Buddies"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell people what your group is about..."
            value={formData.description}
            onChangeText={(value) => updateField("description", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.label}>Interests *</Text>
          <Text style={styles.subtitle}>
            Comma separate multiple interests (e.g., Tech, Art, Fitness)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Tech, Programming, Coffee"
            value={interestsText}
            onChangeText={updateInterests}
          />
        </View>

        {/* Max People */}
        <View style={styles.section}>
          <Text style={styles.label}>Maximum Members (Optional)</Text>
          <Text style={styles.subtitle}>
            Leave blank for 2000 members
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 50"
            value={formData.maxPeople}
            onChangeText={(value) => updateField("maxPeople", value)}
            keyboardType="number-pad"
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.label}>Privacy</Text>
          <Text style={styles.subtitle}>
            Choose who can find and join your group
          </Text>

          <View style={styles.privacyOptions}>
            {privacyOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.privacyOption,
                  formData.privacy === option.id && styles.selectedPrivacy,
                ]}
                onPress={() => {
                  updateField("privacy", option.id);
                  updateField("isPrivate", option.id === "private");
                }}
              >
                <option.icon
                  size={20}
                  color={
                    formData.privacy === option.id
                      ? Colors.primary
                      : Colors.gray500
                  }
                />
                <View style={styles.privacyContent}>
                  <Text
                    style={[
                      styles.privacyName,
                      formData.privacy === option.id && styles.selectedText,
                    ]}
                  >
                    {option.name}
                  </Text>
                  <Text style={styles.privacyDescription}>
                    {option.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Create Button */}
        <View style={styles.createSection}>
          <Pressable 
            style={[styles.createButton, loading && styles.createButtonDisabled]} 
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Users size={20} color="white" />
                <Text style={styles.createButtonText}>Create Linkup</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.helpText}>
            Your group will be visible to others based on privacy settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Sora-Regular",
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 16,
  },
  input: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray900,
    backgroundColor: Colors.lightBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  privacyOptions: {
    gap: 12,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  selectedPrivacy: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  privacyContent: {
    marginLeft: 16,
    flex: 1,
  },
  privacyName: {
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
    color: Colors.gray900,
  },
  selectedText: {
    color: Colors.primary,
  },
  privacyDescription: {
    fontFamily: "Sora-Regular",
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 2,
  },
  imageWrapper: {
    position: 'relative',
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Sora-Medium',
  },
  createSection: {
    marginBottom: 32,
    paddingTop: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 26,
    marginBottom: 12,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  helpText: {
    fontFamily: "Sora-Regular",
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
  },
});
