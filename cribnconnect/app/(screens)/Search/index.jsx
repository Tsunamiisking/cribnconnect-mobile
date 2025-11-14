import BackHeader from "@/components/BackHeader"
import { Colors } from "@/constants/Colors"
import locationsData from "@/constants/locationsData.json"
import { ChevronDown, Globe, MapPin, Search as SearchIcon, Users, Locate } from "lucide-react-native"
import React, { useState } from "react"
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, KeyboardAvoidingView} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SearchScreen() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedApartmentType, setSelectedApartmentType] = useState(null)
  const [selectedPartyPolicy, setSelectedPartyPolicy] = useState(null)
  const [maxGuests, setMaxGuests] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showStateDropdown, setShowStateDropdown] = useState(false)

  const countries = locationsData.countries

  const getStatesForCountry = () => {
    if (!selectedCountry) return []
    const country = countries.find(c => c.id === selectedCountry)
    return country ? country.states : []
  }

  // Real Nigerian apartment types
  const apartmentTypes = [
    { id: 1, name: "Self-Contain", icon: "🏠", description: "Single room with bathroom" },
    { id: 2, name: "Mini Flat", icon: "🏘️", description: "Room, parlour, kitchen" },
    { id: 3, name: "BQ (Boys Quarter)", icon: "🚪", description: "Servant quarters" },
    { id: 4, name: "Duplex", icon: "🏡", description: "Two-story building" },
    { id: 5, name: "Terrace", icon: "🏢", description: "Row house" },
    { id: 6, name: "Detached House", icon: "🏠", description: "Standalone building" },
    { id: 7, name: "Semi-Detached", icon: "🏘️", description: "Shared wall house" },
    { id: 8, name: "Bungalow", icon: "🏡", description: "Single-story house" },
    { id: 9, name: "Penthouse", icon: "🏢", description: "Top floor luxury" },
    { id: 10, name: "Shared Room", icon: "🛏️", description: "Multiple occupants" },
  ]

  // Party policy options
  const partyPolicies = [
    { id: 1, name: "Parties Allowed", description: "Social gatherings permitted", icon: "🎉" },
    { id: 2, name: "No Parties", description: "Quiet environment only", icon: "🔇" },
    // { id: 3, name: "Ask Host", description: "Prior approval required", icon: "💬" },
  ]

  const handleCountrySelect = (countryId) => {
    setSelectedCountry(countryId)
    setSelectedState(null)
    setSelectedCity("")
    setShowCountryDropdown(false)
  }

  const handleStateSelect = (state) => {
    setSelectedState(state)
    setShowStateDropdown(false)
  }

  const getSelectedCountryName = () => {
    if (!selectedCountry) return "Select Country"
    return countries.find(c => c.id === selectedCountry)?.name || "Select Country"
  }

  const getSelectedStateName = () => {
    return selectedState || "Select State"
  }

  const handleSearch = () => {
    const searchParams = {
      country: getSelectedCountryName(),
      state: selectedState,
      city: selectedCity,
      apartmentType: apartmentTypes.find(t => t.id === selectedApartmentType)?.name,
      partyPolicy: partyPolicies.find(p => p.id === selectedPartyPolicy)?.name,
      maxGuests: maxGuests
    }
    console.log("Search with:", searchParams)
    // TODO: Navigate to search results page with filters
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackHeader title="Search Apartments" showUser={true}/>
      
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Location</Text>
          <Text style={styles.filterSubtitle}>Select country, state and city</Text>
          
          {/* Country Dropdown */}
          <View style={styles.locationSubSection}>
            <View style={styles.locationHeader}>
              <Globe size={16} color={Colors.primary} />
              <Text style={styles.locationLabel}>Country</Text>
            </View>
            
            <Pressable 
              style={styles.dropdownButton}
              onPress={() => {
                setShowCountryDropdown(!showCountryDropdown)
                setShowStateDropdown(false)
              }}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedCountry && styles.dropdownPlaceholder
              ]}>
                {getSelectedCountryName()}
              </Text>
              <ChevronDown 
                size={20} 
                color={Colors.gray600}
                style={showCountryDropdown && { transform: [{ rotate: '180deg' }] }}
              />
            </Pressable>

            {showCountryDropdown && (
              <View style={styles.dropdownMenu}>
                {countries.map((country) => (
                  <Pressable
                    key={country.id}
                    style={[
                      styles.dropdownItem,
                      selectedCountry === country.id && styles.selectedDropdownItem
                    ]}
                    onPress={() => handleCountrySelect(country.id)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedCountry === country.id && styles.selectedDropdownText
                    ]}>
                      {country.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* State Dropdown */}
          {selectedCountry && (
            <View style={styles.locationSubSection}>
              <View style={styles.locationHeader}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.locationLabel}>State</Text>
              </View>
              
              <Pressable 
                style={styles.dropdownButton}
                onPress={() => {
                  setShowStateDropdown(!showStateDropdown)
                  setShowCountryDropdown(false)
                }}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !selectedState && styles.dropdownPlaceholder
                ]}>
                  {getSelectedStateName()}
                </Text>
                <ChevronDown 
                  size={20} 
                  color={Colors.gray600}
                  style={showStateDropdown && { transform: [{ rotate: '180deg' }] }}
                />
              </Pressable>

              {showStateDropdown && (
                <ScrollView style={styles.dropdownMenu} nestedScrollEnabled>
                  {getStatesForCountry().map((state, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.dropdownItem,
                        selectedState === state && styles.selectedDropdownItem
                      ]}
                      onPress={() => handleStateSelect(state)}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        selectedState === state && styles.selectedDropdownText
                      ]}>
                        {state}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* City Input */}
          {selectedState && (
            <View style={styles.locationSubSection}>
              <View style={styles.locationHeader}>
                <Locate  size={16} color={Colors.primary} />
                <Text style={styles.locationLabel}>City (Optional)</Text>
              </View>
              <TextInput
                style={styles.cityInput}
                placeholder="Enter city name"
                placeholderTextColor="#9ca3af"
                value={selectedCity}
                onChangeText={setSelectedCity}
              />
            </View>
          )}
        </View>

        {/* Apartment Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Apartment Type</Text>
          <Text style={styles.filterSubtitle}>Choose your preferred accommodation</Text>
          
          <View style={styles.apartmentTypesContainer}>
            {apartmentTypes.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.apartmentTypeCard,
                  selectedApartmentType === type.id && styles.selectedCard
                ]}
                onPress={() => setSelectedApartmentType(type.id)}
              >
                <View style={styles.apartmentTypeHeader}>
                  <Text style={styles.apartmentTypeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.apartmentTypeName,
                    selectedApartmentType === type.id && styles.selectedText
                  ]}>
                    {type.name}
                  </Text>
                </View>
                <Text style={styles.apartmentTypeDescription}>{type.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Party Policy & Guest Limit */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Guest & Party Preferences</Text>
          <Text style={styles.filterSubtitle}>Set your social preferences</Text>
          
          {/* Party Policy */}
          <View style={styles.policyContainer}>
            {partyPolicies.map((policy) => (
              <Pressable
                key={policy.id}
                style={[
                  styles.policyCard,
                  selectedPartyPolicy === policy.id && styles.selectedCard
                ]}
                onPress={() => setSelectedPartyPolicy(policy.id)}
              >
                <Text style={styles.policyIcon}>{policy.icon}</Text>
                <View style={styles.policyContent}>
                  <Text style={[
                    styles.policyName,
                    selectedPartyPolicy === policy.id && styles.selectedText
                  ]}>
                    {policy.name}
                  </Text>
                  <Text style={styles.policyDescription}>{policy.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Max Guests */}
          <View style={styles.guestsContainer}>
            <View style={styles.guestsHeader}>
              <Users size={18} color={Colors.primary} />
              <Text style={styles.guestsLabel}>Maximum Guests</Text>
            </View>
            <View style={styles.guestsInputContainer}>
              <TextInput
                style={styles.guestsInput}
                placeholder="e.g. 4"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={maxGuests}
                onChangeText={setMaxGuests}
              />
              <Text style={styles.guestsHint}>Leave empty for any number</Text>
            </View>
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
      </KeyboardAvoidingView>
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
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 6,
  },
  filterSubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 20,
  },
  
  // Location Styles
  locationSubSection: {
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationLabel: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  
  // Dropdown Styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 54,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  dropdownButtonText: {
    fontFamily: 'Sora-Medium',
    fontSize: 15,
    color: Colors.primary,
  },
  dropdownPlaceholder: {
    color: '#9ca3af',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedDropdownItem: {
    backgroundColor: Colors.blue50,
  },
  dropdownItemText: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: '#111827',
  },
  selectedDropdownText: {
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
  },
  
  cityInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.primary,
  },
  
  // Apartment Type Styles
  apartmentTypesContainer: {
    gap: 12,
  },
  apartmentTypeCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  apartmentTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  apartmentTypeIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  apartmentTypeName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  apartmentTypeDescription: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
    marginLeft: 32,
  },
  
  // Party Policy Styles
  policyContainer: {
    gap: 12,
    marginBottom: 20,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  policyIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  policyContent: {
    flex: 1,
  },
  policyName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  policyDescription: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
  },
  
  // Guests Styles
  guestsContainer: {
    padding: 16,
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  guestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestsLabel: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  guestsInputContainer: {
    gap: 6,
  },
  guestsInput: {
    height: 48,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    paddingHorizontal: 16,
    fontFamily: 'Sora-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
  guestsHint: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray600,
  },
  
  // Common Styles
  selectedCard: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  selectedText: {
    color: Colors.primary,
  },
  
  // Search Button
  searchButtonSection: {
    marginBottom: 32,
    paddingTop: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
})
