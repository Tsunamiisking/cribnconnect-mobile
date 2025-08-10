import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function SearchModal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [recentSearches, setRecentSearches] = useState([
    'Rooftop parties',
    'Brooklyn apartments',
    'Hiking groups',
    'Photography meetups',
    'Coworking spaces'
  ]);
  const [popularSearches] = useState([
    'Manhattan events',
    'Studio apartments',
    'Weekend activities',
    'Networking events',
    'Food tours',
    'Fitness groups'
  ]);

  const searchTypes = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'apartments', label: 'Apartments', icon: '🏠' },
    { id: 'events', label: 'Events', icon: '🎉' },
    { id: 'linkups', label: 'Linkups', icon: '🤝' },
  ];

  const handleSearch = (query) => {
    if (query.trim()) {
      // TODO: Add API integration for search
      // Example API call:
      // try {
      //   const response = await api.search({
      //     query: query.trim(),
      //     type: searchType,
      //   });
      //   // Navigate to search results
      // } catch (error) {
      //   console.error('Search error:', error);
      // }
      
      // Add to recent searches
      const updatedRecent = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updatedRecent);
      
      console.log('Searching for:', query.trim(), 'Type:', searchType);
      // Navigate back with search results
      router.back();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderSearchItem = ({ item, isRecent = false }) => (
    <TouchableOpacity 
      style={styles.searchItem} 
      className="flex-row items-center py-3 px-4 border-b border-gray-100"
      onPress={() => handleSearch(item)}
    >
      <Text style={styles.searchIcon} className="text-gray-400 mr-3">
        {isRecent ? '🕐' : '🔥'}
      </Text>
      <Text style={styles.searchText} className="flex-1 text-gray-900">
        {item}
      </Text>
      <Text style={styles.searchArrow} className="text-gray-400">→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Search Input */}
      <View style={styles.searchContainer} className="px-6 py-4 bg-white border-b border-gray-200">
        <View style={styles.searchInputContainer} className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Text style={styles.searchInputIcon} className="text-gray-400 mr-3">🔍</Text>
          <TextInput
            style={styles.searchInput}
            className="flex-1 text-gray-900 text-base"
            placeholder="Search apartments, events, linkups..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton} className="text-gray-400 ml-2">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Type Filters */}
      <View style={styles.filterContainer} className="px-6 py-4 bg-gray-50">
        <FlatList
          data={searchTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                searchType === item.id && styles.filterButtonActive
              ]}
              className={`px-4 py-2 rounded-full mr-3 ${
                searchType === item.id ? 'bg-blue-600' : 'bg-white'
              }`}
              onPress={() => setSearchType(item.id)}
            >
              <View style={styles.filterContent} className="flex-row items-center">
                <Text style={styles.filterIcon} className="mr-1">{item.icon}</Text>
                <Text 
                  style={[
                    styles.filterText,
                    searchType === item.id && styles.filterTextActive
                  ]}
                  className={searchType === item.id ? 'text-white' : 'text-gray-700'}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Search Results */}
      <FlatList
        style={styles.resultsContainer}
        className="flex-1"
        data={[]}
        ListHeaderComponent={() => (
          <View>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section} className="py-4">
                <View style={styles.sectionHeader} className="flex-row justify-between items-center px-6 pb-2">
                  <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900">
                    Recent Searches
                  </Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText} className="text-blue-600 text-sm">Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((item, index) => (
                  <View key={`recent-${index}`}>
                    {renderSearchItem({ item, isRecent: true })}
                  </View>
                ))}
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.section} className="py-4">
              <View style={styles.sectionHeader} className="px-6 pb-2">
                <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900">
                  Popular Searches
                </Text>
              </View>
              {popularSearches.map((item, index) => (
                <View key={`popular-${index}`}>
                  {renderSearchItem({ item, isRecent: false })}
                </View>
              ))}
            </View>

            {/* Search Tips */}
            <View style={styles.tipsSection} className="px-6 py-6 bg-blue-50 mx-6 rounded-lg mt-4">
              <Text style={styles.tipsTitle} className="text-blue-900 font-semibold mb-2">
                Search Tips
              </Text>
              <Text style={styles.tipsText} className="text-blue-700 text-sm leading-5">
                • Use specific keywords like "rooftop", "studio", or "hiking"
                {'\n'}• Filter by type to narrow down results
                {'\n'}• Try location names like "Brooklyn" or "Manhattan"
                {'\n'}• Search for activities like "photography" or "networking"
              </Text>
            </View>
          </View>
        )}
        renderItem={() => null}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputIcon: {
    color: '#9ca3af',
    marginRight: 12,
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  clearButton: {
    color: '#9ca3af',
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    marginRight: 4,
    fontSize: 16,
  },
  filterText: {
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    color: '#2563eb',
    fontSize: 14,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchIcon: {
    color: '#9ca3af',
    marginRight: 12,
    fontSize: 16,
  },
  searchText: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  searchArrow: {
    color: '#9ca3af',
    fontSize: 16,
  },
  tipsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#eff6ff',
    marginHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  tipsTitle: {
    color: '#1e3a8a',
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    color: '#1d4ed8',
    fontSize: 14,
    lineHeight: 20,
  },
});
