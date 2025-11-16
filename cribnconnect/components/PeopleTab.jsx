import CreateButton from "@/components/CreateButton";
import NoResults from "@/components/NoResults";
import PersonCard from "@/components/PersonCard";
import TextSearchInput from "@/components/TextSearchInput";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { UserPlus } from "lucide-react-native";
import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function PeopleTab({ 
  filteredPeople, 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  refreshing, 
  onRefresh,
  onPersonPress,
  loading,
  loadingMore = false,
  hasMore = false,
  onLoadMore
}) {
  const handleCreateProfile = () => {
    router.push("/(screens)/public-profile");
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
        onPress={handleCreateProfile}
        icon={UserPlus}
        title="Create Public Profile"
        subtitle="Let people discover you and connect based on shared interests"
      />

      <TextSearchInput
        placeholder="Search people by name or interests..."
        value={searchQuery}
        onChangeText={onSearchChange}
        onClear={onClearSearch}
      />

      <View style={styles.peopleCardsContainer}>
        {loading && filteredPeople.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading people...</Text>
          </View>
        ) : filteredPeople.length > 0 ? (
          <>
            {filteredPeople.map((person) => (
              <PersonCard 
                key={person.id} 
                person={person} 
                onPress={onPersonPress}
              />
            ))}
            
            {/* Load More Button */}
            {hasMore && !searchQuery && (
              <View style={styles.loadMoreContainer}>
                <TouchableOpacity 
                  style={styles.loadMoreButton}
                  onPress={onLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.loadMoreText}>Load More People</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <NoResults
            title="No people found"
            message={
              searchQuery 
                ? `No people match "${searchQuery}". Try a different search term.`
                : "No people available right now. Check back later!"
            }
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
  peopleCardsContainer: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  loadMoreContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  loadMoreText: {
    color: Colors.white,
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray600,
  },
});