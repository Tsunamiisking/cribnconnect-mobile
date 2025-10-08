import CreateButton from "@/components/CreateButton";
import NoResults from "@/components/NoResults";
import PersonCard from "@/components/PersonCard";
import TextSearchInput from "@/components/TextSearchInput";
import { router } from "expo-router";
import { UserPlus } from "lucide-react-native";
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View
} from "react-native";

export default function PeopleTab({ 
  filteredPeople, 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  refreshing, 
  onRefresh 
}) {
  const handleCreateProfile = () => {
    router.push("/(screens)/create-profile");
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
        {filteredPeople.length > 0 ? (
          filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))
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
});