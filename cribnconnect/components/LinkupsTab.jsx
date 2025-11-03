import CategoryFilter from "@/components/CategoryFilter";
import CreateButton from "@/components/CreateButton";
import LinkupCard from "@/components/LinkupCard";
import NoResults from "@/components/NoResults";
import TextSearchInput from "@/components/TextSearchInput";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function LinkupsTab({ 
  filteredLinkups, 
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  refreshing, 
  onRefresh 
}) {
  const handleCreateLinkup = () => {
    router.push("/(screens)/create-linkup");
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <CreateButton
        onPress={handleCreateLinkup}
        icon={Plus}
        title="Create New Linkup"
        subtitle="Start your own community around shared interests"
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <TextSearchInput
        placeholder="Search linkups, interests..."
        value={searchQuery}
        onChangeText={onSearchChange}
        onClear={onClearSearch}
      />

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Search Results (${filteredLinkups.length})` : "Discover Linkups Near You"}
        </Text>
        {searchQuery && (
          <TouchableOpacity onPress={onClearSearch}>
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Linkups List */}
      <View style={styles.linkupsContainer}>
        {filteredLinkups.length > 0 ? (
          filteredLinkups.map((item) => (
            <View key={item.id} style={styles.linkupCardContainer}>
              <LinkupCard
                imageUri={item.imageUri}
                title={item.title}
                interest={item.interest}
                description={item.description}
                memberCount={item.memberCount}
                privacy={item.privacy}
                host={item.host}
                liked={false}
                onLikeToggle={(liked) => {
                  console.log("Linkup saved:", item.id, liked);
                }}
                onPress={() => {
                  router.push(`/(screens)/linkup-details/${item.id}`);
                }}
              />
            </View>
          ))
        ) : (
          <NoResults
            title="No linkups found"
            message={
              searchQuery 
                ? `No linkups match "${searchQuery}". Try a different search term or browse categories above.`
                : "No linkups available in this category. Try selecting a different category or create your own linkup!"
            }
            showClearButton={!!searchQuery}
            onClear={onClearSearch}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
    flex: 1,
  },
  clearSearchText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  linkupsContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  linkupCardContainer: {
    marginBottom: 16,
  },
});