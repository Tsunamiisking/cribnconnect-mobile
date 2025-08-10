import React, { useState } from "react"
import { View, Text, Image, Pressable } from "react-native"
import { Heart, Users, MapPin, Calendar } from "lucide-react-native"

export default function ApartmentCard({
  imageUri = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apartment%20Card-Qt0RcjI9EMCektnq5RoOErn2LNS0SU.png",
  title = "2 bedroom apartment",
  pricePerNight = "₦70,000/night",
  location = "5th avenue, Femi Close, Ojo ...",
  availability = "Available from 1st Jan – 3rd Sept",
  liked: likedProp,
  onLikeToggle,
  onPress,
  style,
}) {
  // Controlled (likedProp) or uncontrolled (internal state) usage
  const [likedState, setLikedState] = useState(Boolean(likedProp))
  const liked = likedProp !== undefined ? likedProp : likedState

  const handleLike = (e) => {
    const next = !liked
    if (likedProp === undefined) setLikedState(next)
    if (onLikeToggle) onLikeToggle(next, e)
  }

  const heartColor = liked ? "#34d399" : "#ffffff"
  const heartFill = liked ? "#34d399" : "transparent"

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="w-[260px] max-w-[380px] rounded-2xl overflow-hidden border border-zinc-800 bg-black"
      style={style}
    >
      {/* Image header */}
      <View className="relative h-32 w-full overflow-hidden">
        <Image
          source={{ uri: imageUri }}
          accessibilityLabel="Apartment exterior"
          className="h-full w-full"
          resizeMode="cover"
        />
        {/* subtle shade */}
        <View className="absolute inset-0 bg-black/20" />

        {/* Pills */}
        <View className="absolute right-3 top-3 flex-row items-center space-x-2">
          <Pressable
            accessibilityLabel="Save listing"
            onPress={handleLike}
            className="h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45"
          >
            <Heart size={16} color={heartColor} fill={heartFill} />
          </Pressable>
          <View className="h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45">
            <Users size={16} color="#ffffff" />
          </View>
        </View>
      </View>

      {/* Details panel */}
      <View className="bg-black px-4 py-4">
        <Text className="text-teal-300 text-base font-semibold" numberOfLines={1}>
          {title}
        </Text>

        <Text className="mt-1 text-emerald-400 text-lg font-extrabold">
          {pricePerNight}
        </Text>

        <View className="mt-3 space-y-2">
          <View className="flex-row items-start">
            <MapPin size={16} color="#a1a1aa" style={{ marginTop: 2 }} />
            <Text className="ml-2 text-sm text-zinc-300" numberOfLines={1}>
              {location}
            </Text>
          </View>

          <View className="flex-row items-start">
            <Calendar size={16} color="#a1a1aa" style={{ marginTop: 2 }} />
            <Text className="ml-2 text-sm text-zinc-300">
              {availability}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}