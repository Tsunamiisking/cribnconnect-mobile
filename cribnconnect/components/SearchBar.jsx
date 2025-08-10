import React from "react"
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native"
import { Search as SearchIcon } from "lucide-react-native"

/**
 * SearchBar
 * - React Native + NativeWind
 * - Pill input with left search icon and a right dark-teal "search" button
 *
 * Props:
 *  - value: string
 *  - onChangeText: (text: string) => void
 *  - onSearch: (text: string) => void
 *  - placeholder?: string
 *  - className?: string (container)
 *  - inputClassName?: string
 *  - buttonClassName?: string
 */
export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = "search by city, apartment etc",
  className = "",
  inputClassName = "",
  buttonClassName = "",
}) {
  const handleSubmit = () => {
    if (onSearch) onSearch(value ?? "")
  }

  return (
    <View className={`w-full flex-row items-center gap-3 ${className}`}>
      {/* Left: pill input */}
      <View className={`flex-1 flex-row items-center h-12 px-4 rounded-full bg-neutral-300 ${inputClassName}`}>
        <SearchIcon size={18} color="#2b3a40" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          style={styles.textInput}
          className="ml-2 flex-1"
          returnKeyType="search"
        />
      </View>

      {/* Right: dark-teal button */}
      <Pressable
        onPress={handleSubmit}
        className={`h-12 px-4 items-center justify-center rounded-2xl bg-[#223c41] ${buttonClassName}`}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Text style={styles.buttonText} className="text-white">Search</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: '#000000',
  },
  buttonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16 ,
    color: '#ffffff',
  },
})