import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search as SearchIcon, MapPin, Home, Users } from "lucide-react-native"
import BackHeader from "@/components/BackHeader"
import { Colors } from "@/constants/Colors"

/**
 * SearchScreen
 * - Comprehensive search page with filters
 * - Location, apartment type, and party allowance options
 */
export default function SearchScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedApartmentType, setSelectedApartmentType] = useState(null)
  const [selectedPartyAllowance, setSelectedPartyAllowance] = useState(null)

  const locations = [
    { id: 1, name: "Near University", distance: "0.5 km" },
    { id: 2, name: "Downtown", distance: "2.1 km" },
    { id: 3, name: "Residential Area", distance: "3.7 km" },
    { id: 4, name: "Campus District", distance: "1.2 km" },
  ]

  const apartmentTypes = [
    { id: 1, name: "Studio", icon: "🏠" },
    { id: 2, name: "1 Bedroom", icon: "🛏️" },
    { id: 3, name: "2 Bedroom", icon: "🏡" },
    { id: 4, name: "Shared Room", icon: "🚪" },
  ]

  const partyOptions = [
    { id: 1, name: "Party Friendly", description: "Events allowed" },
    { id: 2, name: "Quiet Only", description: "No parties" },
    { id: 3, name: "Weekends Only", description: "Limited events" },
  ]

  const handleSearch = () => {
    // Implement search logic here
    console.log("Search with:", { selectedLocation, selectedApartmentType, selectedPartyAllowance })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <BackHeader title="Search Apartments" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Location</Text>
          <Text style={styles.filterSubtitle}>Choose your preferred area</Text>
          
          <View style={styles.optionsGrid}>
            {locations.map((location) => (
              <Pressable
                key={location.id}
                style={[
                  styles.optionCard,
                  selectedLocation === location.id && styles.selectedCard
                ]}
                onPress={() => setSelectedLocation(location.id)}
              >
                <MapPin 
                  size={18} 
                  color={selectedLocation === location.id ? Colors.primary : "#6b7280"} 
                />
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionName,
                    selectedLocation === location.id && styles.selectedText
                  ]}>
                    {location.name}
                  </Text>
                  <Text style={styles.optionDistance}>{location.distance}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Apartment Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Apartment Type</Text>
          <Text style={styles.filterSubtitle}>Select your living preference</Text>
          
          <View style={styles.optionsGrid}>
            {apartmentTypes.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.optionCard,
                  selectedApartmentType === type.id && styles.selectedCard
                ]}
                onPress={() => setSelectedApartmentType(type.id)}
              >
                <Text style={styles.optionIcon}>{type.icon}</Text>
                <Text style={[
                  styles.optionName,
                  selectedApartmentType === type.id && styles.selectedText
                ]}>
                  {type.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Party Allowance Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Party Policy</Text>
          <Text style={styles.filterSubtitle}>Choose your lifestyle preference</Text>
          
          <View style={styles.optionsColumn}>
            {partyOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.partyOptionCard,
                  selectedPartyAllowance === option.id && styles.selectedCard
                ]}
                onPress={() => setSelectedPartyAllowance(option.id)}
              >
                <Users 
                  size={20} 
                  color={selectedPartyAllowance === option.id ? Colors.primary : "#6b7280"} 
                />
                <View style={styles.partyOptionContent}>
                  <Text style={[
                    styles.optionName,
                    selectedPartyAllowance === option.id && styles.selectedText
                  ]}>
                    {option.name}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Search Button */}
        <View style={styles.searchButtonSection}>
          <Pressable style={styles.searchButton} onPress={handleSearch}>
            <SearchIcon size={20} color="white" />
            <Text style={styles.searchButtonText}>Search Apartments</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 4,
  },
  filterSubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsColumn: {
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  partyOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCard: {
    backgroundColor: '#eff6ff',
    borderColor: Colors.primary,
  },
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },
  partyOptionContent: {
    marginLeft: 16,
    flex: 1,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  selectedText: {
    color: Colors.primary,
  },
  optionDistance: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  optionDescription: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  searchButtonSection: {
    marginBottom: 32,
    paddingTop: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 26,
  },
  searchButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
})
