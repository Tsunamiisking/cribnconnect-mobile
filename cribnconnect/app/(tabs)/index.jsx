import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data - TODO: Replace with API integration
const FEATURED_APARTMENTS = [
  { 
    id: '1', 
    title: 'Modern Studio Downtown', 
    price: '$1,200/month', 
    location: 'Downtown Manhattan',
    type: 'Studio',
    amenities: ['Gym', 'Rooftop', 'Laundry'],
    image: '🏢',
    rating: 4.8,
    available: 'Available Now'
  },
  { 
    id: '2', 
    title: 'Luxury 2BR Apartment', 
    price: '$2,500/month', 
    location: 'Upper East Side',
    type: '2 Bedroom',
    amenities: ['Doorman', 'Pool', 'Parking'],
    image: '🏠',
    rating: 4.9,
    available: 'Available Dec 1'
  },
  { 
    id: '3', 
    title: 'Cozy 1BR with Balcony', 
    price: '$1,800/month', 
    location: 'Brooklyn Heights',
    type: '1 Bedroom',
    amenities: ['Balcony', 'Pet Friendly', 'Garden'],
    image: '🏡',
    rating: 4.7,
    available: 'Available Now'
  },
];

const QUICK_FILTERS = ['All', 'Studio', '1BR', '2BR', '3BR+', 'Pet Friendly'];

export default function ApartmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh apartments data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ThemedView style={styles.container} className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header} className="px-6 pt-12 pb-4 bg-blue-600">
        <View style={styles.headerTop} className="flex-row justify-between items-center mb-4">
          <View>
            <Text style={styles.greeting} className="text-white text-lg">
              Good morning! 👋
            </Text>
            <Text style={styles.headerTitle} className="text-white text-2xl font-bold">
              Find Your Perfect Home
            </Text>
          </View>
          
          <Link href="/(hosting)/add-apartment" asChild>
            <TouchableOpacity style={styles.addButton} className="bg-white bg-opacity-20 p-3 rounded-full">
              <Text style={styles.addButtonText} className="text-white text-lg">+</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Search Bar */}
        <Link href="/(modal)/search" asChild>
          <TouchableOpacity style={styles.searchBar} className="bg-white rounded-lg p-4 flex-row items-center">
            <Text style={styles.searchPlaceholder} className="text-gray-500 flex-1">
              🔍 Search by location, price...
            </Text>
            <Link href="/(modal)/filter" asChild>
              <TouchableOpacity style={styles.filterButton} className="ml-2">
                <Text>⚙️</Text>
              </TouchableOpacity>
            </Link>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Quick Filters */}
        <View style={styles.filtersContainer} className="px-6 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters} className="flex-row space-x-3">
              {QUICK_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter && styles.activeFilterChip
                  ]}
                  className={`px-4 py-2 rounded-full ${
                    selectedFilter === filter ? 'bg-blue-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFilter === filter && styles.activeFilterText
                  ]} className={selectedFilter === filter ? 'text-white' : 'text-gray-700'}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.section} className="px-6 mb-6">
          <View style={styles.sectionHeader} className="flex-row justify-between items-center mb-4">
            <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900">
              Featured Apartments
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll} className="text-blue-600 font-medium">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {FEATURED_APARTMENTS.map((apartment) => (
            <Link
              key={apartment.id}
              href={`/(screens)/apartment-details/${apartment.id}`}
              asChild
            >
              <TouchableOpacity style={styles.apartmentCard} className="bg-white rounded-lg mb-4 shadow-sm border border-gray-100">
                <View style={styles.cardHeader} className="flex-row justify-between items-start p-4">
                  <View style={styles.apartmentInfo} className="flex-1">
                    <View style={styles.apartmentHeader} className="flex-row items-center mb-2">
                      <Text style={styles.apartmentIcon} className="text-2xl mr-3">
                        {apartment.image}
                      </Text>
                      <View>
                        <Text style={styles.apartmentTitle} className="text-lg font-semibold text-gray-900">
                          {apartment.title}
                        </Text>
                        <Text style={styles.apartmentLocation} className="text-gray-500">
                          📍 {apartment.location}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.apartmentDetails} className="flex-row justify-between items-center">
                      <View>
                        <Text style={styles.apartmentPrice} className="text-xl font-bold text-blue-600">
                          {apartment.price}
                        </Text>
                        <Text style={styles.apartmentType} className="text-gray-600">
                          {apartment.type} • ⭐ {apartment.rating}
                        </Text>
                      </View>
                      
                      <View style={styles.availabilityBadge} className="bg-green-100 px-3 py-1 rounded-full">
                        <Text style={styles.availabilityText} className="text-green-700 text-xs font-medium">
                          {apartment.available}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.amenities} className="flex-row flex-wrap mt-3">
                      {apartment.amenities.slice(0, 3).map((amenity) => (
                        <View key={amenity} style={styles.amenityTag} className="bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
                          <Text style={styles.amenityText} className="text-gray-600 text-xs">
                            {amenity}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.bookmarkButton} className="p-2">
                    <Text style={styles.bookmarkIcon} className="text-gray-400">
                      🔖
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section} className="px-6 mb-6">
          <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </Text>
          
          <View style={styles.actionsGrid} className="flex-row flex-wrap">
            <Link href="/(modal)/search" asChild>
              <TouchableOpacity style={styles.actionCard} className="bg-blue-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">🔍</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  Advanced Search
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Filter by preferences
                </Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(screens)/saved-searches" asChild>
              <TouchableOpacity style={styles.actionCard} className="bg-purple-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">💾</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  Saved Searches
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Your preferences
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#2563eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    color: '#6b7280',
    flex: 1,
  },
  filterButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterChip: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    color: '#374151',
  },
  activeFilterText: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    color: '#2563eb',
    fontWeight: '500',
  },
  apartmentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  apartmentInfo: {
    flex: 1,
  },
  apartmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  apartmentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  apartmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  apartmentLocation: {
    color: '#6b7280',
  },
  apartmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apartmentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  apartmentType: {
    color: '#6b7280',
  },
  availabilityBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '500',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  amenityTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    color: '#6b7280',
    fontSize: 12,
  },
  bookmarkButton: {
    padding: 8,
  },
  bookmarkIcon: {
    color: '#9ca3af',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
    flex: 1,
    minWidth: 150,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  actionSubtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 100,
  },
});
