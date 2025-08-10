import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

// Mock data - TODO: Replace with API integration
const BOOKMARKED_ITEMS = [
  {
    id: '1',
    type: 'apartment',
    title: 'Modern Studio Downtown',
    subtitle: '$1,200/month • Downtown Manhattan',
    description: 'Beautiful modern studio with city views',
    image: '🏢',
    savedDate: '2 days ago',
    tags: ['Studio', 'Downtown', 'Modern'],
    status: 'Available Now',
  },
  {
    id: '2',
    type: 'event',
    title: 'Rooftop Networking Mixer',
    subtitle: 'Dec 15, 2024 • 7:00 PM',
    description: 'Professional networking with stunning city views',
    image: '🍸',
    savedDate: '1 week ago',
    tags: ['Networking', 'Professional', 'Rooftop'],
    status: '45 attending',
  },
  {
    id: '3',
    type: 'linkup',
    title: 'Coffee & Code Buddies',
    subtitle: 'Weekly • 12 members',
    description: 'Weekly meetup for developers to work together',
    image: '☕',
    savedDate: '3 days ago',
    tags: ['Tech', 'Weekly', 'Learning'],
    status: 'Active Group',
  },
  {
    id: '4',
    type: 'apartment',
    title: 'Luxury 2BR Apartment',
    subtitle: '$2,500/month • Upper East Side',
    description: 'Spacious luxury apartment with premium amenities',
    image: '🏠',
    savedDate: '5 days ago',
    tags: ['2BR', 'Luxury', 'Amenities'],
    status: 'Available Dec 1',
  },
  {
    id: '5',
    type: 'event',
    title: 'Community Game Night',
    subtitle: 'Dec 18, 2024 • 6:30 PM',
    description: 'Board games, card games, and great company',
    image: '🎲',
    savedDate: '1 day ago',
    tags: ['Social', 'Games', 'Community'],
    status: '28 attending',
  },
];

const BOOKMARK_CATEGORIES = ['All', 'Apartments', 'Events', 'Linkups'];

export default function BookmarksScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh bookmarks data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'apartment': return '#2563eb';
      case 'event': return '#7c3aed';
      case 'linkup': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'apartment': return '🏠';
      case 'event': return '📅';
      case 'linkup': return '👥';
      default: return '🔖';
    }
  };

  const filteredBookmarks = selectedCategory === 'All' 
    ? BOOKMARKED_ITEMS 
    : BOOKMARKED_ITEMS.filter(item => 
        (selectedCategory === 'Apartments' && item.type === 'apartment') ||
        (selectedCategory === 'Events' && item.type === 'event') ||
        (selectedCategory === 'Linkups' && item.type === 'linkup')
      );

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header} className="px-6 pt-12 pb-4 bg-amber-600">
        <View style={styles.headerTop} className="flex-row justify-between items-center mb-4">
          <View>
            <Text style={styles.greeting} className="text-white text-lg">
              Your Saved Items 🔖
            </Text>
            <Text style={styles.headerTitle} className="text-white text-2xl font-bold">
              Bookmarks
            </Text>
          </View>
          
          <View style={styles.headerStats} className="items-end">
            <Text style={styles.totalCount} className="text-white text-lg font-bold">
              {BOOKMARKED_ITEMS.length}
            </Text>
            <Text style={styles.totalLabel} className="text-white text-sm opacity-90">
              Saved Items
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} className="bg-white rounded-lg p-4 flex-row items-center">
          <Text style={styles.searchPlaceholder} className="text-gray-500 flex-1">
            🔍 Search your bookmarks...
          </Text>
        </TouchableOpacity>
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
              {BOOKMARK_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.activeFilterChip
                  ]}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-amber-600' : 'bg-gray-100'
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

        {/* Stats Overview */}
        <View style={styles.statsContainer} className="px-6 mb-6">
          <View style={styles.statsGrid} className="flex-row space-x-4">
            <View style={styles.statCard} className="bg-blue-50 p-4 rounded-lg flex-1">
              <Text style={styles.statNumber} className="text-2xl font-bold text-blue-600">
                {BOOKMARKED_ITEMS.filter(item => item.type === 'apartment').length}
              </Text>
              <Text style={styles.statLabel} className="text-blue-600 font-medium">
                Apartments
              </Text>
            </View>
            
            <View style={styles.statCard} className="bg-purple-50 p-4 rounded-lg flex-1">
              <Text style={styles.statNumber} className="text-2xl font-bold text-purple-600">
                {BOOKMARKED_ITEMS.filter(item => item.type === 'event').length}
              </Text>
              <Text style={styles.statLabel} className="text-purple-600 font-medium">
                Events
              </Text>
            </View>
            
            <View style={styles.statCard} className="bg-green-50 p-4 rounded-lg flex-1">
              <Text style={styles.statNumber} className="text-2xl font-bold text-green-600">
                {BOOKMARKED_ITEMS.filter(item => item.type === 'linkup').length}
              </Text>
              <Text style={styles.statLabel} className="text-green-600 font-medium">
                Linkups
              </Text>
            </View>
          </View>
        </View>

        {/* Bookmarked Items */}
        <View style={styles.section} className="px-6 mb-6">
          <View style={styles.sectionHeader} className="flex-row justify-between items-center mb-4">
            <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Bookmarks' : selectedCategory}
            </Text>
            <TouchableOpacity>
              <Text style={styles.clearAll} className="text-amber-600 font-medium">
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((item) => (
              <Link
                key={item.id}
                href={`/(screens)/${item.type}-details/${item.id}`}
                asChild
              >
                <TouchableOpacity style={styles.bookmarkCard} className="bg-white rounded-lg mb-4 shadow-sm border border-gray-100">
                  <View style={styles.cardContent} className="p-4">
                    <View style={styles.bookmarkHeader} className="flex-row items-start justify-between mb-3">
                      <View style={styles.itemIcon} className="mr-3">
                        <Text style={styles.itemEmoji} className="text-3xl">
                          {item.image}
                        </Text>
                        <View 
                          style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} 
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                        >
                          <Text style={styles.typeIcon} className="text-white text-xs">
                            {getTypeIcon(item.type)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.itemInfo} className="flex-1">
                        <View style={styles.itemTitleRow} className="flex-row items-center justify-between mb-1">
                          <Text style={styles.itemTitle} className="text-lg font-semibold text-gray-900 flex-1">
                            {item.title}
                          </Text>
                          <TouchableOpacity style={styles.removeButton} className="p-2">
                            <Text style={styles.removeIcon} className="text-gray-400">
                              ✕
                            </Text>
                          </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.itemSubtitle} className="text-gray-600 mb-2">
                          {item.subtitle}
                        </Text>
                        
                        <Text style={styles.itemDescription} className="text-gray-700 mb-3">
                          {item.description}
                        </Text>
                        
                        <View style={styles.itemMeta} className="flex-row justify-between items-center">
                          <Text style={styles.savedDate} className="text-gray-500 text-sm">
                            Saved {item.savedDate}
                          </Text>
                          <View 
                            style={[styles.statusBadge, { backgroundColor: `${getTypeColor(item.type)}15` }]} 
                            className="px-3 py-1 rounded-full"
                          >
                            <Text 
                              style={[styles.statusText, { color: getTypeColor(item.type) }]} 
                              className="text-sm font-medium"
                            >
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemTags} className="flex-row flex-wrap">
                      {item.tags.map((tag) => (
                        <View key={tag} style={styles.tag} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-1">
                          <Text style={styles.tagText} className="text-gray-600 text-xs">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.itemActions} className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <TouchableOpacity style={styles.shareButton} className="flex-row items-center">
                        <Text style={styles.shareIcon} className="text-lg mr-2">📤</Text>
                        <Text style={styles.shareText} className="text-gray-600 font-medium">
                          Share
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: getTypeColor(item.type) }]} 
                        className="px-6 py-2 rounded-lg"
                      >
                        <Text style={styles.actionButtonText} className="text-white font-medium">
                          {item.type === 'apartment' ? 'View Details' : 
                           item.type === 'event' ? 'Join Event' : 'Join Linkup'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <View style={styles.emptyState} className="py-12 items-center">
              <Text style={styles.emptyIcon} className="text-6xl mb-4">🔖</Text>
              <Text style={styles.emptyTitle} className="text-xl font-bold text-gray-900 mb-2">
                No bookmarks in {selectedCategory.toLowerCase()}
              </Text>
              <Text style={styles.emptySubtitle} className="text-gray-600 text-center mb-6">
                Start exploring and save items you're interested in!
              </Text>
              <Link href="/(tabs)" asChild>
                <TouchableOpacity style={styles.exploreButton} className="bg-amber-600 px-6 py-3 rounded-lg">
                  <Text style={styles.exploreButtonText} className="text-white font-medium">
                    Start Exploring
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        {filteredBookmarks.length > 0 && (
          <View style={styles.section} className="px-6 mb-6">
            <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </Text>
            
            <View style={styles.actionsGrid} className="flex-row flex-wrap">
              <TouchableOpacity style={styles.actionCard} className="bg-amber-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">📋</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  Export List
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Share your bookmarks
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} className="bg-blue-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">🔔</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  Set Alerts
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Get notified of updates
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    backgroundColor: '#d97706',
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
  headerStats: {
    alignItems: 'flex-end',
  },
  totalCount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalLabel: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
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
    backgroundColor: '#d97706',
  },
  filterText: {
    color: '#374151',
  },
  activeFilterText: {
    color: 'white',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    color: '#2563eb',
    fontWeight: '500',
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
  clearAll: {
    color: '#d97706',
    fontWeight: '500',
  },
  bookmarkCard: {
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
  bookmarkHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemIcon: {
    marginRight: 12,
    position: 'relative',
  },
  itemEmoji: {
    fontSize: 32,
  },
  typeIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIcon: {
    color: 'white',
    fontSize: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    color: '#9ca3af',
  },
  itemSubtitle: {
    color: '#6b7280',
    marginBottom: 8,
  },
  itemDescription: {
    color: '#374151',
    marginBottom: 12,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedDate: {
    color: '#6b7280',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  shareText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#d97706',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    backgroundColor: '#fef3c7',
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
