import React, { useState } from "react"
import { View, Text, Image, Pressable, StyleSheet } from "react-native"
import { Heart, MapPin, Calendar, Sun, Moon } from "lucide-react-native"

export default function EventCard({
  imageUri = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", // Default event image
  title = "Summer Pool Party",
  pricePerTicket = "₦5,000/ticket",
  location = "Rooftop Lounge, Victoria Island...",
  schedule = "Available from 7pm – 11pm",
  timeOfDay = "night", // "day" or "night"
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

  const heartColor = liked ? "#10b981" : "#111827" // emerald-500 when liked; dark otherwise
  const heartFill = liked ? "#10b981" : "transparent"

  // Day/Night indicator
  const isDayTime = timeOfDay === "day"
  const TimeIcon = isDayTime ? Sun : Moon
  const timeIconColor = isDayTime ? "#f59e0b" : "#6366f1" // amber for day, indigo for night

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
          accessibilityLabel="Event image"
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Top-right action pills overlaying the IMAGE only */}
        <View className="absolute right-3 top-3 flex-row items-center space-x-2">
          <Pressable
            accessibilityLabel="Save event"
            onPress={handleLike}
            className="h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/80"
          >
            <Heart size={16} color={heartColor} fill={heartFill} />
          </Pressable>
          <View className="h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/80">
            <TimeIcon size={16} color={timeIconColor} />
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

        <Text style={styles.price}>
          {pricePerTicket}
        </Text>

        <View className="mt-2 flex-row items-start">
          <MapPin size={14} color="#111111" style={{ marginTop: 2 }} />
          <Text 
            style={styles.location}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
        </View>

        <View className="mt-1 flex-row items-start">
          <Calendar size={14} color="#111111" style={{ marginTop: 2 }} />
          <Text 
            style={styles.schedule}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {schedule}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  price: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: '#10b981',
    marginTop: 4,
  },
  location: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
    flex: 1,
  },
  schedule: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
    flex: 1,
  },
});
