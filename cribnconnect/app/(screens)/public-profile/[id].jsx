import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import MediaViewer from "@/components/MediaViewer";
import { Colors } from "@/constants/Colors";
import { useLocationString } from "@/hooks/useLocationString";
import { useLocalSearchParams } from "expo-router";
import { Play } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const PublicProfileID = () => {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { locationString } = useLocationString(profile?.location);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

  const allMedia = useMemo(() => {
    if (!profile) return [];
    const media = [];
    
    // Add images
    if (profile.images) {
      media.push(...profile.images.map(image => ({
        type: 'image',
        url: image.secure_url || image.url
      })));
    }
    
    // Add video if exists
    if (profile.video) {
      media.push({
        type: 'video',
        url: profile.video.secure_url || profile.video.url
      });
    }
    
    return media;
  }, [profile]);

  const handleMediaPress = (index) => {
    setSelectedMediaIndex(index);
    setShowMediaViewer(true);
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public-profiles/${id}`);
      setProfile(response.data);
      console.log("Loaded profile:", response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Profile" />
        <View style={styles.loading}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Profile" />
        <View style={styles.loading}>
          <Text>Profile not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={profile.username} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Media Section */}
        <View style={styles.mediaSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScroll}
          >
            {profile.images?.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.mediaItem}
                onPress={() => handleMediaPress(index)}
              >
                <Image
                  source={{ uri: image.secure_url || image.url }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
            {profile.video && (
              <TouchableOpacity 
                style={styles.mediaItem}
                onPress={() => handleMediaPress(profile.images?.length || 0)}
              >
                <Image
                  source={{ uri: profile.video.secure_url || profile.video.url }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
                <View style={styles.videoOverlay}>
                  <View style={styles.playButton}>
                    <Play size={24} color={Colors.white} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* Location Section */}
          {profile.location && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              <Text style={styles.locationText}>{locationString}</Text>
            </View>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Interests</Text>
              </View>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <MediaViewer
        visible={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        media={allMedia}
        initialIndex={selectedMediaIndex || 0}
      />
    </SafeAreaView>
  );
};

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
    overflow: "hidden",
    backgroundColor: Colors.gray100,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
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
});

export default PublicProfileID;