import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Search as SearchIcon } from "lucide-react-native"
import { router } from "expo-router"
import { Colors } from "@/constants/Colors"

/**
 * SearchInput
 * - Simple search input that navigates to detailed search page
 * - No actual TextInput, just a pressable that looks like a search field
 */
export default function SearchInput({
  placeholder = "Search apartments, location...",
  onPress,
}) {
  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      // Navigate to search page
      router.push('/(screens)/search')
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={styles.searchInput}
      accessibilityRole="button"
      accessibilityLabel="Open search"
    >
      <SearchIcon size={20} color={Colors.gray500} />
      <Text style={styles.placeholderText}>
        {placeholder}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 24,
  },
  placeholderText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    marginLeft: 12,
  },
})
