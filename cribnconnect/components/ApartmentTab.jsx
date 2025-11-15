import CategoryFilter from "@/components/CategoryFilter";
import SearchInput from "@/components/SearchInput";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import {
    Building2,
    Calendar,
    Eye,
    MapPin,
    Plus,
    Star,
    TrendingUp
} from "lucide-react-native";
import React from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ApartmentCard = ({ apartment }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return Colors.success;
      case "inactive":
        return Colors.warning;
      case "suspended":
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "suspended":
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  const getCategoryDisplay = (category) => {
    switch (category) {
      case "whole-space":
        return "Entire Place";
      case "private-room":
        return "Private Room";
      case "shared-room":
        return "Shared Room";
      default:
        return "Entire Place";
    }
  };

  const handleCardPress = () => {
    router.push(`/(screens)/apartment-details/${apartment.id}`);
  };

  const handleEditPress = () => {
    // Determine which step to redirect to based on apartment completion status
    const getEditStep = () => {
      if (!apartment.title || !apartment.description) return 1; // Basic Info
      if (!apartment.location || !apartment.address) return 2; // Location
      if (!apartment.amenities || apartment.amenities.length === 0) return 3; // Amenities
      if (!apartment.images || apartment.images.length === 0) return 4; // Photos
      if (!apartment.price || !apartment.category) return 5; // Pricing & Category
      if (!apartment.rules || apartment.rules.length === 0) return 6; // House Rules
      if (!apartment.safetyFeatures || apartment.safetyFeatures.length === 0) return 7; // Safety
      return 8; // Review (final step)
    };

    const step = getEditStep();
    router.push(`/(hosting)/add-apartment?step=${step}&editId=${apartment.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.apartmentCard}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: apartment.images[0] }}
        style={styles.apartmentImage}
      />

      <View style={styles.apartmentContent}>
        <View style={styles.apartmentHeader}>
          <View style={styles.apartmentTitleRow}>
            <Text style={styles.apartmentTitle} numberOfLines={2}>
              {apartment.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(apartment.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(apartment.status) },
                ]}
              >
                {getStatusText(apartment.status)}
              </Text>
            </View>
          </View>

          <View style={styles.apartmentLocationRow}>
            <MapPin size={14} color={Colors.gray600} />
            <Text style={styles.apartmentLocation} numberOfLines={1}>
              {apartment.location}
            </Text>
          </View>
        </View>

        <View style={styles.apartmentStats}>
          <View style={styles.statItem}>
            {/* <DollarSign size={16} color={Colors.primary} /> */}
            <Text style={styles.statValue}>{apartment.price}</Text>
          </View>

          <View style={styles.statItem}>
            <Calendar size={16} color={Colors.gray600} />
            <Text style={styles.statText}>{apartment.bookings} bookings</Text>
          </View>

          <View style={styles.statItem}>
            <Star size={16} color={Colors.warning} />
            <Text style={styles.statText}>
              {apartment.rating} ({apartment.reviews})
            </Text>
          </View>
        </View>

        <View style={styles.apartmentFooter}>
          <View style={styles.footerLeftSection}>
            <View style={styles.earningsRow}>
              <TrendingUp size={16} color={Colors.success} />
              <Text style={styles.earningsText}>Total: {apartment.earnings}</Text>
            </View>
            <Text style={styles.categoryText}>
              {getCategoryDisplay(apartment.category)}
            </Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CreateApartmentButton = () => (
  <TouchableOpacity
    style={styles.createButton}
    onPress={() => router.push("/(hosting)/add-apartment")}
    activeOpacity={0.8}
  >
    <View style={styles.createButtonContent}>
      <Plus size={24} color={Colors.primary} />
      <Text style={styles.createButtonText}>Add New Apartment</Text>
      <Text style={styles.createButtonSubtext}>List your space for rent</Text>
    </View>
  </TouchableOpacity>
);

const NoApartments = () => (
  <>
    <View style={styles.noResultsContainer}>
      <View style={styles.noResultsIconContainer}>
        <Building2 size={48} color={Colors.gray400} />
      </View>
      <Text style={styles.noResultsTitle}>No Apartments Found</Text>
      <Text style={styles.noResultsText}>
        You haven't hosted any apartments yet. Start hosting today!
      </Text>
    </View>
    <View style={{ width: '100%',}}> 
      <CreateApartmentButton />
    </View>
  </>
);

export default function ApartmentTab({
  filteredApartments,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearSearch,
  refreshing,
  onRefresh,
  loading,
  totalApartments,
}) {
  const renderApartment = ({ item }) => <ApartmentCard apartment={item} />;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <SearchInput
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search your apartments..."
        onClear={onClearSearch}
      />

      {filteredApartments.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {filteredApartments.length}
              </Text>
              <Text style={styles.summaryLabel}>
                {!selectedCategory || selectedCategory === "All" ? "Properties" : selectedCategory}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {filteredApartments.filter((a) => a.status === "active").length}
              </Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {filteredApartments.reduce((sum, a) => sum + a.bookings, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Total Bookings</Text>
            </View>
          </View>
        </View>
      )}

      <CreateApartmentButton />

      {categories && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      )}
    </View>
  );

  // Show NoApartments only when there are no apartments at all AND no filters applied
  const showEmptyState = totalApartments === 0 && searchQuery === "" && (!selectedCategory || selectedCategory === "All");

  return (
    <View style={styles.container}>
      {showEmptyState ? (
        <View style={styles.emptyStateContainer}>
          <NoApartments />
        </View>
      ) : (
        <FlatList
          data={filteredApartments}
          renderItem={renderApartment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.noSearchResultsContainer}>
              <Eye size={48} color={Colors.gray400} />
              <Text style={styles.noSearchResultsTitle}>
                No {selectedCategory !== "All" ? selectedCategory : ""} Apartments Found
              </Text>
              <Text style={styles.noSearchResultsText}>
                {searchQuery !== "" 
                  ? "Try adjusting your search terms"
                  : `You don't have any ${selectedCategory?.toLowerCase()} apartments`
                }
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    marginVertical: 16,
  },
  summaryContainer: {
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: "Sora-Bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  createButton: {
    // width: '100%',
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
    borderStyle: "dashed",
  },
  createButtonContent: {
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginTop: 8,
  },
  createButtonSubtext: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginTop: 4,
  },
  apartmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  apartmentImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  apartmentContent: {
    padding: 16,
  },
  apartmentHeader: {
    marginBottom: 12,
  },
  apartmentTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  apartmentTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Sora-Medium",
  },
  apartmentLocationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  apartmentLocation: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginLeft: 4,
    flex: 1,
  },
  apartmentStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginLeft: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginLeft: 4,
  },
  apartmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeftSection: {
    flex: 1,
  },
  earningsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  earningsText: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.success,
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Sora-Medium",
    color: Colors.gray600,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  noResultsContainer: {
    alignItems: "center",
    // paddingVertical: 48,
  },
  noResultsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 20,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  noSearchResultsContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  noSearchResultsTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noSearchResultsText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
  },
});
