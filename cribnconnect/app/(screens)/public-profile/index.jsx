import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
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
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateProfile from "../create-profile";

export default function PublicProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/public-profile');
      setProfile(response.data);
      setHasProfile(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error.response?.status === 404) {
        setHasProfile(false);
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
              <TouchableOpacity onPress={() => router.push("/public-profile/edit")}>
                <Edit size={20} color={Colors.gray600} />
              </TouchableOpacity>
            </View>
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About</Text>
              <TouchableOpacity onPress={() => router.push("/public-profile/edit")}>
                <Edit size={20} color={Colors.gray600} />
              </TouchableOpacity>
            </View>
            <Text style={styles.bioText}>{profile.biography}</Text>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  editSection: {
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});