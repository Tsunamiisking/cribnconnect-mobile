import React, { useState } from "react"
import { View, Text, Image, Pressable, StyleSheet } from "react-native"
import { Heart, Users, MapPin, Calendar } from "lucide-react-native"
import { Colors } from "@/constants/Colors"
export default function ApartmentCard({
  imageUri = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apartment%20Card-X38Nd9YDk0wnqQCxfseg3QANAdpaX5.png", // Provided Source URL
  title = "2 bedroom apartment",
  pricePerNight = "₦70,000/night",
  location = "5th avenue, Femi Close, Ojo ...",
  availability = "Available from 1st Jan – 3rd Sept",
  apartmentType = "full", // "shared", "full", "service" - determines if Users icon shows
  isShared = false, // Alternative: boolean prop for shared apartments
  liked: likedProp,
  onLikeToggle,
  onPress,
  className = "",             // allow parent to control width
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

  const heartColor = liked ? Colors.emerald : Colors.gray900 // emerald when liked; dark otherwise
  const heartFill = liked ? Colors.emerald : "transparent"

  // Determine if apartment should show Users icon (for shared apartments)
  const showUsersIcon = apartmentType === "shared" || isShared

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      // width tuned for two-column grid; parent can override by passing className
      className={`rounded-2xl overflow-hidden border border-zinc-200 bg-transparent ${className}`}
      style={style}
    >
      {/* Image (top) */}
      <View className="relative w-full h-40">
        <Image
          source={{ uri: imageUri }}
          accessibilityLabel="Apartment exterior"
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Top-right action pills overlaying the IMAGE only */}
        <View className="absolute right-3 top-3 flex-row items-center space-x-2">
          <Pressable
            accessibilityLabel="Save listing"
            onPress={handleLike}
            className="h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/80"
          >
            <Heart size={16} color={heartColor} fill={heartFill} />
          </Pressable>
          {showUsersIcon && (
            <View className="h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/80">
              <Users size={16} color={Colors.gray900} />
            </View>
          )}
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
          {pricePerNight}
        </Text>

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

        <View className="mt-1 flex-row items-start">
          <Calendar size={14} color={Colors.black} style={{ marginTop: 2 }} />
          <Text 
            style={styles.availability}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {availability}
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
    color: Colors.black,
  },
  price: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.emerald,
    marginTop: 4,
  },
  location: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.black,
    marginLeft: 4,
    flex: 1,
  },
  availability: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.black,
    marginLeft: 4,
    flex: 1,
  },
});