import React from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Colors } from "@/constants/Colors"
import { router } from "expo-router"
import { Users, Calendar, Globe, Lock } from "lucide-react-native"

// Mock data for user's current linkups - TODO: Replace with API integration
const USER_LINKUPS = [
  {
    id: "1",
    title: "Coffee & Code Buddies",
    interest: "Tech & Programming",
    nextMeeting: "Tomorrow, 2:00 PM",
    memberCount: "12 members",
    privacy: "public",
    imageUri: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    status: "active",
  },
  {
    id: "3",
    title: "Board Game Enthusiasts",
    interest: "Games & Strategy",
    nextMeeting: "Saturday, 6:30 PM",
    memberCount: "18 members",
    privacy: "private",
    imageUri: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
    status: "active",
  },
  {
    id: "5",
    title: "Book Club Readers",
    interest: "Literature & Discussion",
    nextMeeting: "Next Thursday, 7:00 PM",
    memberCount: "15 members",
    privacy: "public",
    imageUri: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    status: "active",
  },
];

export default function UserLinkupsCarousel() {
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

  if (USER_LINKUPS.length === 0) {
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
        data={USER_LINKUPS}
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
