import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import ProfileView from "@/components/ProfileView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublicProfile() {
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
      // If profile doesn't exist, redirect to create
      if (error.response?.status === 404) {
        router.replace('/public-profile/edit');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    router.push('/public-profile/edit');
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

  if (!profile) {
    router.replace('/public-profile/edit');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Public Profile" />
      <ProfileView
        profile={profile}
        isEditable={true}
        onEditPress={handleEditPress}
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