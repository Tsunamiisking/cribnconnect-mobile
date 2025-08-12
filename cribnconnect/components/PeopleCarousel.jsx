import React from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Colors } from "@/constants/Colors"
import { router } from "expo-router"
import { MapPin } from "lucide-react-native"

// Mock data for people nearby - TODO: Replace with API integration
const NEARBY_PEOPLE = [
  {
    id: "1",
    name: "Sarah Chen",
    age: 24,
    location: "500m away",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
    interests: ["Tech", "Coffee"],
    status: "online",
  },
  {
    id: "2",
    name: "Mike Johnson",
    age: 28,
    location: "1.2km away",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    interests: ["Fitness", "Music"],
    status: "offline",
  },
  {
    id: "3",
    name: "Emma Wilson",
    age: 26,
    location: "800m away",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    interests: ["Art", "Travel"],
    status: "online",
  },
  {
    id: "4",
    name: "David Kim",
    age: 30,
    location: "2.1km away",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    interests: ["Running", "Books"],
    status: "away",
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    age: 25,
    location: "1.5km away",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    interests: ["Photography", "Nature"],
    status: "online",
  },
];

export default function PeopleCarousel() {
  const renderPersonCard = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'online': return Colors.emerald;
        case 'away': return Colors.amber;
        case 'offline': return Colors.gray500;
        default: return Colors.gray500;
      }
    };

    return (
      <TouchableOpacity
        style={styles.personCard}
        onPress={() => {
          router.push(`/(screens)/profile/${item.id}`)
        }}
        accessibilityRole="button"
      >
        {/* Profile Image with Status Indicator */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.profileImage }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
        </View>

        {/* Person Info */}
        <View style={styles.personInfo}>
          <Text style={styles.personName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.personAge}>
            {item.age} years old
          </Text>
          
          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.gray500} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          {/* Interests */}
          <View style={styles.interestsContainer}>
            {item.interests.slice(0, 2).map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (NEARBY_PEOPLE.length === 0) {
    return null // Don't show carousel if no people nearby
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>People Close to You</Text>
        <TouchableOpacity onPress={() => router.push("/(screens)/nearby-people")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={NEARBY_PEOPLE}
        renderItem={renderPersonCard}
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
    marginVertical: 12,
  },
  personCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  personInfo: {
    alignItems: 'center',
  },
  personName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 2,
    textAlign: 'center',
  },
  personAge: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginLeft: 4,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  interestTag: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontFamily: 'Sora-Regular',
    fontSize: 10,
    color: Colors.gray700,
  },
})
