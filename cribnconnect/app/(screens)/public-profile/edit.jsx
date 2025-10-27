import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import ProfileView from "@/components/ProfileView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditPublicProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      // For new profiles, initialize with default values
      setProfile({
        displayName: user?.displayName || '',
        bio: '',
        interests: [],
        mediaGallery: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedProfile) => {
    try {
      await api.post('/profile', updatedProfile);
      router.replace('/public-profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Handle error appropriately
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader 
        title={profile ? "Edit Profile" : "Create Profile"} 
        onBackPress={handleCancel}
      />
      <ProfileView
        profile={profile}
        isEditable={true}
        isEditMode={true}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});