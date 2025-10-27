import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import ProfileView from "@/components/ProfileView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader 
          title="Loading..." 
          onBackPress={handleCancel}
        />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Determine if this is a new profile creation
  const isNewProfile = !profile?.id;

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader 
        title={isNewProfile ? "Create Profile" : "Edit Profile"} 
        onBackPress={handleCancel}
      />
      <ProfileView
        profile={profile}
        isEditable={true}
        isCreating={isNewProfile}
        onImagePress={() => {
          // Handle image/video upload
          console.log("Open image picker");
        }}
        onBioPress={() => {
          // Open bio editor
          console.log("Open bio editor");
        }}
        onInterestsPress={() => {
          // Open interests selector
          console.log("Open interests selector");
        }}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});