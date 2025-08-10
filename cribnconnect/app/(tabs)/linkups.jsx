import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

// Mock data - TODO: Replace with API integration
const ACTIVE_LINKUPS = [
  {
    id: '1',
    title: 'Coffee & Code Buddies',
    description: 'Weekly meetup for developers to work together and share knowledge',
    members: 12,
    maxMembers: 15,
    category: 'Professional',
    nextMeeting: 'Tomorrow, 2:00 PM',
    location: 'Downtown Cafe',
    host: 'Emma Wilson',
    image: '☕',
    tags: ['Tech', 'Weekly', 'Learning'],
    isJoined: true,
  },
  {
    id: '2',
    title: 'Morning Runners Club',
    description: 'Start your day with a group run through the city parks',
    members: 8,
    maxMembers: 12,
    category: 'Fitness',
    nextMeeting: 'Dec 16, 7:00 AM',
    location: 'Central Park Entrance',
    host: 'David Kim',
    image: '🏃',
    tags: ['Running', 'Morning', 'Fitness'],
    isJoined: false,
  },
  {
    id: '3',
    title: 'Board Game Enthusiasts',
    description: 'Discover new games and make friends over strategic fun',
    members: 18,
    maxMembers: 20,
    category: 'Social',
    nextMeeting: 'Dec 18, 6:30 PM',
    location: 'Game Lounge',
    host: 'Lisa Chen',
    image: '🎲',
    tags: ['Games', 'Social', 'Weekly'],
    isJoined: true,
  },
  {
    id: '4',
    title: 'Photography Walks',
    description: 'Explore the city through your lens with fellow photographers',
    members: 7,
    maxMembers: 10,
    category: 'Creative',
    nextMeeting: 'Dec 20, 10:00 AM',
    location: 'Art District',
    host: 'Mark Johnson',
    image: '📸',
    tags: ['Photography', 'Creative', 'Outdoors'],
    isJoined: false,
  },
];

const LINKUP_CATEGORIES = ['All', 'Professional', 'Fitness', 'Social', 'Creative', 'Food & Drink'];

export default function LinkupsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh linkups data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header} className="px-6 pt-12 pb-4 bg-green-600">
        <View style={styles.headerTop} className="flex-row justify-between items-center mb-4">
          <View>
            <Text style={styles.greeting} className="text-white text-lg">
              Connect & Grow 🤝
            </Text>
            <Text style={styles.headerTitle} className="text-white text-2xl font-bold">
              Find Your Tribe
            </Text>
          </View>
          
          <Link href="/(hosting)/add-linkup" asChild>
            <TouchableOpacity style={styles.addButton} className="bg-white bg-opacity-20 p-3 rounded-full">
              <Text style={styles.addButtonText} className="text-white text-lg">+</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Search Bar */}
        <Link href="/(modal)/search-linkups" asChild>
          <TouchableOpacity style={styles.searchBar} className="bg-white rounded-lg p-4 flex-row items-center">
            <Text style={styles.searchPlaceholder} className="text-gray-500 flex-1">
              🔍 Search linkups, interests...
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Category Filters */}
        <View style={styles.filtersContainer} className="px-6 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters} className="flex-row space-x-3">
              {LINKUP_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.activeFilterChip
                  ]}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-green-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedCategory === category && styles.activeFilterText
                  ]} className={selectedCategory === category ? 'text-white' : 'text-gray-700'}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* My Linkups Section */}
        <View style={styles.section} className="px-6 mb-6">
          <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900 mb-4">
            My Linkups
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.myLinkupsContainer} className="flex-row">
              {ACTIVE_LINKUPS.filter(linkup => linkup.isJoined).map((linkup) => (
                <TouchableOpacity key={linkup.id} style={styles.myLinkupCard} className="bg-green-50 p-4 rounded-lg mr-4 w-64">
                  <View style={styles.myLinkupHeader} className="flex-row items-center mb-2">
                    <Text style={styles.myLinkupIcon} className="text-2xl mr-3">
                      {linkup.image}
                    </Text>
                    <View style={styles.myLinkupInfo} className="flex-1">
                      <Text style={styles.myLinkupTitle} className="font-semibold text-gray-900">
                        {linkup.title}
                      </Text>
                      <Text style={styles.myLinkupMembers} className="text-green-700 text-sm">
                        {linkup.members} members
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.myLinkupNext} className="text-gray-600 text-sm">
                    Next: {linkup.nextMeeting}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Discover Linkups */}
        <View style={styles.section} className="px-6 mb-6">
          <View style={styles.sectionHeader} className="flex-row justify-between items-center mb-4">
            <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900">
              Discover Linkups
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll} className="text-green-600 font-medium">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {ACTIVE_LINKUPS.map((linkup) => (
            <Link
              key={linkup.id}
              href={`/(screens)/linkup-details/${linkup.id}`}
              asChild
            >
              <TouchableOpacity style={styles.linkupCard} className="bg-white rounded-lg mb-4 shadow-sm border border-gray-100">
                <View style={styles.cardContent} className="p-4">
                  <View style={styles.linkupHeader} className="flex-row items-start justify-between mb-3">
                    <View style={styles.linkupIcon} className="mr-3">
                      <Text style={styles.linkupEmoji} className="text-3xl">
                        {linkup.image}
                      </Text>
                    </View>
                    
                    <View style={styles.linkupInfo} className="flex-1">
                      <View style={styles.linkupTitleRow} className="flex-row items-center justify-between mb-1">
                        <Text style={styles.linkupTitle} className="text-lg font-semibold text-gray-900 flex-1">
                          {linkup.title}
                        </Text>
                        {linkup.isJoined && (
                          <View style={styles.joinedBadge} className="bg-green-100 px-2 py-1 rounded">
                            <Text style={styles.joinedText} className="text-green-700 text-xs font-medium">
                              Joined
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <Text style={styles.linkupHost} className="text-gray-600 mb-2">
                        Hosted by {linkup.host}
                      </Text>
                      
                      <Text style={styles.linkupDescription} className="text-gray-700 mb-3">
                        {linkup.description}
                      </Text>
                      
                      <View style={styles.linkupMeta} className="space-y-1">
                        <Text style={styles.linkupNextMeeting} className="text-gray-700">
                          📅 Next: {linkup.nextMeeting}
                        </Text>
                        <Text style={styles.linkupLocation} className="text-gray-700">
                          📍 {linkup.location}
                        </Text>
                        <Text style={styles.linkupMembers} className="text-gray-600">
                          👥 {linkup.members}/{linkup.maxMembers} members
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.linkupTags} className="flex-row flex-wrap mb-4">
                    {linkup.tags.map((tag) => (
                      <View key={tag} style={styles.tag} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-1">
                        <Text style={styles.tagText} className="text-gray-600 text-xs">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.linkupFooter} className="flex-row justify-between items-center">
                    <View style={styles.categoryBadge} className="bg-green-100 px-3 py-1 rounded">
                      <Text style={styles.categoryText} className="text-green-700 text-sm font-medium">
                        {linkup.category}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, linkup.isJoined ? styles.leaveButton : styles.joinButton]} 
                      className={linkup.isJoined ? 'bg-gray-200 px-6 py-2 rounded-lg' : 'bg-green-600 px-6 py-2 rounded-lg'}
                    >
                      <Text 
                        style={[styles.actionButtonText, linkup.isJoined ? styles.leaveButtonText : styles.joinButtonText]} 
                        className={linkup.isJoined ? 'text-gray-700 font-medium' : 'text-white font-medium'}
                      >
                        {linkup.isJoined ? 'Leave' : 'Join Linkup'}
                      </Text>
                    </TouchableOpacity>
                  </View>
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
            <Link href="/(hosting)/add-linkup" asChild>
              <TouchableOpacity style={styles.actionCard} className="bg-green-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">🤝</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  Start a Linkup
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Create your own group
                </Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(screens)/my-linkups" asChild>
              <TouchableOpacity style={styles.actionCard} className="bg-blue-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">👥</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  My Groups
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Manage your linkups
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bottom Spacing */}
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
    backgroundColor: '#059669',
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
    backgroundColor: '#059669',
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
    color: '#059669',
    fontWeight: '500',
  },
  myLinkupsContainer: {
    flexDirection: 'row',
  },
  myLinkupCard: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    width: 240,
  },
  myLinkupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  myLinkupIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  myLinkupInfo: {
    flex: 1,
  },
  myLinkupTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  myLinkupMembers: {
    color: '#059669',
    fontSize: 14,
  },
  myLinkupNext: {
    color: '#6b7280',
    fontSize: 14,
  },
  linkupCard: {
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
  cardContent: {
    padding: 16,
  },
  linkupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  linkupIcon: {
    marginRight: 12,
  },
  linkupEmoji: {
    fontSize: 32,
  },
  linkupInfo: {
    flex: 1,
  },
  linkupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  linkupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  joinedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  joinedText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '500',
  },
  linkupHost: {
    color: '#6b7280',
    marginBottom: 8,
  },
  linkupDescription: {
    color: '#374151',
    marginBottom: 12,
  },
  linkupMeta: {
    gap: 4,
  },
  linkupNextMeeting: {
    color: '#374151',
  },
  linkupLocation: {
    color: '#374151',
  },
  linkupMembers: {
    color: '#6b7280',
  },
  linkupTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#6b7280',
    fontSize: 12,
  },
  linkupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButton: {
    backgroundColor: '#059669',
  },
  leaveButton: {
    backgroundColor: '#e5e7eb',
  },
  actionButtonText: {
    fontWeight: '500',
  },
  joinButtonText: {
    color: 'white',
  },
  leaveButtonText: {
    color: '#374151',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    backgroundColor: '#ecfdf5',
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
