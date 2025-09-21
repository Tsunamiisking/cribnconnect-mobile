import { Colors } from "@/constants/Colors"
import { Globe, Heart, Lock, MessageSquare, Users } from "lucide-react-native"
import React, { useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

export default function LinkupCard({
  imageUri = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", // Default group image
  title = "Book Lovers Group",
  interest = "Reading & Discussion",
  description = "A community for book enthusiasts to discuss their latest reads and literary passions",
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
  
  // Group activity indicator
  const activityLevel = Math.random() > 0.5 ? "active" : "normal" // In real app, this would be based on actual group activity
  const activityBadgeColor = activityLevel === "active" ? Colors.emerald : "transparent"
  const activityBadgeBorder = activityLevel === "active" ? "transparent" : Colors.gray300

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
        
        {/* Activity badge */}
        {activityLevel === "active" && (
          <View style={[styles.activityBadge, {backgroundColor: activityBadgeColor, borderColor: activityBadgeBorder}]}>
            <Text style={styles.activityText}>Active now</Text>
          </View>
        )}
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
        
        <View className="mt-2 flex-row items-start">
          <MessageSquare size={14} color={Colors.black} style={{ marginTop: 2 }} />
          <Text 
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
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
          Created by {host}
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
  description: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray700,
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
  activityBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: Colors.emerald,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityText: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.white,
  }
});
