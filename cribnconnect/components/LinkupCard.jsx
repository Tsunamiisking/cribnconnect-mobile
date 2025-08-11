import React, { useState } from "react"
import { View, Text, Image, Pressable, StyleSheet } from "react-native"
import { Heart, MapPin, Calendar, Users, Lock, Globe } from "lucide-react-native"
import { Colors } from "@/constants/Colors"

export default function LinkupCard({
  imageUri = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", // Default group image
  title = "Book Club Meetup",
  interest = "Reading & Discussion",
  location = "Downtown Library, Lagos...",
  schedule = "Every Saturday, 3:00 PM",
  memberCount = "12 members",
  privacy = "public", // "public" or "private"
  host = "Sarah Chen",
  liked: likedProp,
  onLikeToggle,
  onPress,
  className = "",
  style,
}) {
  // controlled/uncontrolled "liked"
  const [likedState, setLikedState] = useState(Boolean(likedProp))
  const liked = likedProp !== undefined ? likedProp : likedState

  const handleLike = (e) => {
    const next = !liked
    if (likedProp === undefined) setLikedState(next)
    onLikeToggle?.(next, e)
  }

  const heartColor = liked ? Colors.emerald : Colors.gray900
  const heartFill = liked ? Colors.emerald : "transparent"

  // Privacy indicator
  const isPrivate = privacy === "private"
  const PrivacyIcon = isPrivate ? Lock : Globe
  const privacyIconColor = isPrivate ? Colors.amber : Colors.indigo

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`rounded-2xl overflow-hidden border border-zinc-200 bg-transparent ${className}`}
      style={style}
    >
      {/* Image (top) */}
      <View className="relative w-full h-40">
        <Image
          source={{ uri: imageUri }}
          accessibilityLabel="Linkup group image"
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Top-right action pills overlaying the IMAGE only */}
        <View className="absolute right-3 top-3 flex-row items-center space-x-2">
          <Pressable
            accessibilityLabel="Save linkup"
            onPress={handleLike}
            className="h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/80"
          >
            <Heart size={16} color={heartColor} fill={heartFill} />
          </Pressable>
          <View className="h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/80">
            <PrivacyIcon size={16} color={privacyIconColor} />
          </View>
        </View>
      </View>

      {/* Texts BELOW the image (transparent background) */}
      <View className="px-3 py-3">
        <Text 
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <Text style={styles.interest}>
          {interest}
        </Text>

        {location && (
          <View className="mt-2 flex-row items-start">
            <MapPin size={14} color={Colors.black} style={{ marginTop: 2 }} />
            <Text 
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {location}
            </Text>
          </View>
        )}

        <View className="mt-1 flex-row items-start">
          <Calendar size={14} color={Colors.black} style={{ marginTop: 2 }} />
          <Text 
            style={styles.schedule}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {schedule}
          </Text>
        </View>

        <View className="mt-1 flex-row items-start">
          <Users size={14} color={Colors.black} style={{ marginTop: 2 }} />
          <Text 
            style={styles.memberCount}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {memberCount}
          </Text>
        </View>

        <Text style={styles.host}>
          by {host}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.black,
  },
  interest: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.emerald,
    marginTop: 2,
  },
  location: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.black,
    marginLeft: 4,
    flex: 1,
  },
  schedule: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.black,
    marginLeft: 4,
    flex: 1,
  },
  memberCount: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.black,
    marginLeft: 4,
    flex: 1,
  },
  host: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
});
