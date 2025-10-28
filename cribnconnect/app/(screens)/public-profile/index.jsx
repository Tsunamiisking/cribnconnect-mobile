import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Edit } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateProfile from "../create-profile";

export default function PublicProfile() {
  const { isAuthenticated } = useAuth();
  const userId = auth?.currentUser?.uid;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [saving, setSaving] = useState(false);

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
      <ScrollView style={styles.content}>
        {/* Profile Media Section */}
        <TouchableOpacity
          style={styles.editSection}
          onPress={() => router.push("/public-profile/edit")}
        >
          {/* Add media content here */}
        </TouchableOpacity>

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
              <Text style={styles.sectionTitle}>About</Text>
              {userId === auth?.currentUser?.uid && (
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Edit size={20} color={Colors.gray600} />
                </TouchableOpacity>
              )}
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile?.biography || profile.biography}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, biography: text }))}
                placeholder="Tell others about yourself..."
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.bioText}>{profile.biography}</Text>
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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  editSection: {
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    padding: 20,
  },
  username: {
    fontSize: 24,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 16,
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
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    backgroundColor: Colors.gray50,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Urbanist-Bold",
  },
});
