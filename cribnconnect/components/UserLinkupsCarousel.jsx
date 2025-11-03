import React, { useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { Colors } from "@/constants/Colors"
import { router } from "expo-router"
import { Users, Calendar, Globe, Lock } from "lucide-react-native"
import api from "@/api/api"
import { auth } from "@/config/firebase"

export default function UserLinkupsCarousel() {
  const [userLinkups, setUserLinkups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserLinkups();
  }, []);

  const loadUserLinkups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/linkups");
      const currentUserId = auth?.currentUser?.uid;
      
      // Filter to only show linkups created by the current user
      const createdByUser = response.data
        .filter(linkup => linkup.createdBy?.uid === currentUserId)
        .map(linkup => ({
          id: linkup._id,
          title: linkup.name,
          interest: linkup.interests?.[0] || "General",
          nextMeeting: linkup.meetingFrequency || "Not scheduled",
          memberCount: `${linkup.members?.length || 0} ${linkup.members?.length === 1 ? 'member' : 'members'}`,
          privacy: linkup.privacy || "public",
          imageUri: linkup.photo?.url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
          status: "active",
        }));
      
      setUserLinkups(createdByUser);
    } catch (error) {
      console.error("Error loading user linkups:", error);
      setUserLinkups([]);
    } finally {
      setLoading(false);
    }
  };
  const renderUserLinkupCard = ({ item }) => {
    const isPrivate = item.privacy === "private"
    const PrivacyIcon = isPrivate ? Lock : Globe
    const privacyIconColor = isPrivate ? Colors.amber : Colors.indigo

    return (
      <TouchableOpacity
        style={styles.userLinkupCard}
        onPress={() => {
          router.push(`/(screens)/linkup-details/${item.id}`)
        }}
        accessibilityRole="button"
      >
        {/* Image with gradient overlay */}
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />
          
          {/* Privacy indicator on image */}
          <View style={styles.privacyIndicator}>
            <PrivacyIcon size={14} color={privacyIconColor} />
          </View>
        </View>

        {/* Content overlay on image */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardInterest} numberOfLines={1}>
            {item.interest}
          </Text>
          
          <View style={styles.cardDetails}>
            <View style={styles.cardDetailRow}>
              <Users size={12} color={Colors.white} />
              <Text style={styles.cardDetailText} numberOfLines={1}>
                {item.memberCount}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Created Linkup Groups</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (userLinkups.length === 0) {
    return null // Don't show carousel if user has no linkups
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Created Linkup Groups</Text>
        {/* <TouchableOpacity onPress={() => router.push('/(chat)/${id}')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity> */}
      </View>
      
      <FlatList
        data={userLinkups}
        renderItem={renderUserLinkupCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
  },
  viewAllText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  carouselContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  userLinkupCard: {
    width: 280,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.gray900,
    elevation: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  privacyIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cardTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  cardInterest: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.emerald,
    marginBottom: 8,
  },
  cardDetails: {
    gap: 4,
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardDetailText: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.white,
    flex: 1,
  },
})
