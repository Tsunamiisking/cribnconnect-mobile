import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import ApartmentCard from "@/components/ApartmentCard";

// Mock data - TODO: Replace with API integration
const FEATURED_APARTMENTS = [
  {
    id: "1",
    title: "Modern Studio Downtown",
    pricePerNight: "$1,200/month",
    location: "Downtown Manhattan, 5th Avenue",
    type: "Studio",
    amenities: ["Gym", "Rooftop", "Laundry"],
    imageUri:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    rating: 4.8,
    availability: "Available Now – Dec 31st",
  },
  {
    id: "2",
    title: "Luxury 2BR Apartment",
    pricePerNight: "$2,500/month",
    location: "Upper East Side, Park Avenue",
    type: "2 Bedroom",
    amenities: ["Doorman", "Pool", "Parking"],
    imageUri:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    rating: 4.9,
    availability: "Available Dec 1st – March 15th",
  },
  {
    id: "3",
    title: "Cozy 1BR with Balcony",
    pricePerNight: "$1,800/month",
    location: "Brooklyn Heights, Promenade Street",
    type: "1 Bedroom",
    amenities: ["Balcony", "Pet Friendly", "Garden"],
    imageUri:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    rating: 4.7,
    availability: "Available Now – Feb 28th",
  },
];

const QUICK_FILTERS = ["All", "Studio", "1BR", "2BR", "3BR+", "Pet Friendly"];

export default function ApartmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh apartments data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header} className="px-6 pt-12 pb-4 bg-blue-600">
        <View
          style={styles.headerTop}
          className="flex-row justify-between items-center mb-4"
        >
          <View>
            <Text style={styles.greeting} className="text-white text-lg">
              Good morning! 👋
            </Text>
            <Text
              style={styles.headerTitle}
              className="text-white text-2xl font-bold"
            >
              Find Your Perfect Home
            </Text>
          </View>

          <Link href="/(hosting)/add-apartment" asChild>
            <TouchableOpacity
              style={styles.addButton}
              className="bg-white bg-opacity-20 p-3 rounded-full"
            >
              <Text style={styles.addButtonText} className="text-white text-lg">
                +
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Search Bar */}
        <Link href="/(modal)/search" asChild>
          <TouchableOpacity
            style={styles.searchBar}
            className="bg-white rounded-lg p-4 flex-row items-center"
          >
            <Text
              style={styles.searchPlaceholder}
              className="text-gray-500 flex-1"
            >
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                    selectedFilter === filter && styles.activeFilterChip,
                  ]}
                  className={`px-4 py-2 rounded-full ${
                    selectedFilter === filter ? "bg-blue-600" : "bg-gray-100"
                  }`}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter && styles.activeFilterText,
                    ]}
                    className={
                      selectedFilter === filter ? "text-white" : "text-gray-700"
                    }
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.section} className="px-6 mb-6">
          <View
            style={styles.sectionHeader}
            className="flex-row justify-between items-center mb-4"
          >
            <Text
              style={styles.sectionTitle}
              className="text-xl font-bold text-gray-900"
            >
              Featured Apartments
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll} className="text-blue-600 font-medium">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {FEATURED_APARTMENTS.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              imageUri={apartment.imageUri}
              title={apartment.title}
              pricePerNight={apartment.pricePerNight}
              location={apartment.location}
              availability={apartment.availability}
              liked={false} // TODO: Replace with actual bookmark status from API
              onLikeToggle={(liked) => {
                // TODO: Add API integration for bookmarking
                console.log("Bookmark toggled:", apartment.id, liked);
              }}
              onPress={() => {
                router.push(`/(screens)/apartment-details/${apartment.id}`);
              }}
              style={{ marginBottom: 16, alignSelf: "center" }}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section} className="px-6 mb-6">
          <Text
            style={styles.sectionTitle}
            className="text-xl font-bold text-gray-900 mb-4"
          >
            Quick Actions
          </Text>

          <View style={styles.actionsGrid} className="flex-row flex-wrap">
            <Link href="/(modal)/search" asChild>
              <TouchableOpacity
                style={styles.actionCard}
                className="bg-blue-50 p-4 rounded-lg mr-3 mb-3 flex-1"
              >
                <Text style={styles.actionIcon} className="text-2xl mb-2">
                  🔍
                </Text>
                <Text
                  style={styles.actionTitle}
                  className="font-medium text-gray-900"
                >
                  Advanced Search
                </Text>
                <Text
                  style={styles.actionSubtitle}
                  className="text-gray-600 text-sm"
                >
                  Filter by preferences
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(screens)/saved-searches" asChild>
              <TouchableOpacity
                style={styles.actionCard}
                className="bg-purple-50 p-4 rounded-lg mr-3 mb-3 flex-1"
              >
                <Text style={styles.actionIcon} className="text-2xl mb-2">
                  💾
                </Text>
                <Text
                  style={styles.actionTitle}
                  className="font-medium text-gray-900"
                >
                  Saved Searches
                </Text>
                <Text
                  style={styles.actionSubtitle}
                  className="text-gray-600 text-sm"
                >
                  Your preferences
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
    backgroundColor: "#2563eb",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    color: "white",
    fontSize: 18,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchPlaceholder: {
    color: "#6b7280",
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
    flexDirection: "row",
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterChip: {
    backgroundColor: "#2563eb",
  },
  filterText: {
    color: "#374151",
  },
  activeFilterText: {
    color: "white",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  seeAll: {
    color: "#2563eb",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionCard: {
    backgroundColor: "#eff6ff",
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
    fontWeight: "500",
    color: "#111827",
  },
  actionSubtitle: {
    color: "#6b7280",
    fontSize: 14,
  },
  bottomSpacing: {
    height: 100,
  },
});
