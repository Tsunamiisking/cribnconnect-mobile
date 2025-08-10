import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

// Mock data - TODO: Replace with API integration
const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Rooftop Networking Mixer',
    date: 'Dec 15, 2024',
    time: '7:00 PM - 10:00 PM',
    location: 'Downtown Rooftop Bar',
    attendees: 45,
    maxAttendees: 60,
    price: 'Free',
    category: 'Networking',
    host: 'Sarah Chen',
    image: '🍸',
    description: 'Join fellow professionals for drinks and networking with a stunning city view.',
  },
  {
    id: '2',
    title: 'Community Game Night',
    date: 'Dec 18, 2024',
    time: '6:30 PM - 9:30 PM',
    location: 'Community Center',
    attendees: 28,
    maxAttendees: 40,
    price: '$10',
    category: 'Social',
    host: 'Mike Johnson',
    image: '🎲',
    description: 'Board games, card games, and great company. Bring your competitive spirit!',
  },
  {
    id: '3',
    title: 'Fitness Bootcamp in the Park',
    date: 'Dec 20, 2024',
    time: '8:00 AM - 9:00 AM',
    location: 'Central Park',
    attendees: 15,
    maxAttendees: 25,
    price: '$15',
    category: 'Fitness',
    host: 'Alex Rivera',
    image: '💪',
    description: 'High-energy workout session to start your day right. All fitness levels welcome!',
  },
];

const EVENT_CATEGORIES = ['All', 'Networking', 'Social', 'Fitness', 'Food & Drink', 'Entertainment'];

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh events data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header} className="px-6 pt-12 pb-4 bg-purple-600">
        <View style={styles.headerTop} className="flex-row justify-between items-center mb-4">
          <View>
            <Text style={styles.greeting} className="text-white text-lg">
              What's happening? 🎉
            </Text>
            <Text style={styles.headerTitle} className="text-white text-2xl font-bold">
              Discover Events
            </Text>
          </View>
          
          <Link href="/(hosting)/add-event" asChild>
            <TouchableOpacity style={styles.addButton} className="bg-white bg-opacity-20 p-3 rounded-full">
              <Text style={styles.addButtonText} className="text-white text-lg">+</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Search Bar */}
        <Link href="/(modal)/search-events" asChild>
          <TouchableOpacity style={styles.searchBar} className="bg-white rounded-lg p-4 flex-row items-center">
            <Text style={styles.searchPlaceholder} className="text-gray-500 flex-1">
              🔍 Search events, locations...
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
              {EVENT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.activeFilterChip
                  ]}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-purple-600' : 'bg-gray-100'
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

        {/* Featured Events */}
        <View style={styles.section} className="px-6 mb-6">
          <View style={styles.sectionHeader} className="flex-row justify-between items-center mb-4">
            <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900">
              Upcoming Events
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll} className="text-purple-600 font-medium">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {FEATURED_EVENTS.map((event) => (
            <Link
              key={event.id}
              href={`/(screens)/event-details/${event.id}`}
              asChild
            >
              <TouchableOpacity style={styles.eventCard} className="bg-white rounded-lg mb-4 shadow-sm border border-gray-100">
                <View style={styles.cardContent} className="p-4">
                  <View style={styles.eventHeader} className="flex-row items-start justify-between mb-3">
                    <View style={styles.eventIcon} className="mr-3">
                      <Text style={styles.eventEmoji} className="text-3xl">
                        {event.image}
                      </Text>
                    </View>
                    
                    <View style={styles.eventInfo} className="flex-1">
                      <Text style={styles.eventTitle} className="text-lg font-semibold text-gray-900 mb-1">
                        {event.title}
                      </Text>
                      <Text style={styles.eventHost} className="text-gray-600 mb-2">
                        Hosted by {event.host}
                      </Text>
                      
                      <View style={styles.eventMeta} className="space-y-1">
                        <Text style={styles.eventDateTime} className="text-gray-700">
                          📅 {event.date} • {event.time}
                        </Text>
                        <Text style={styles.eventLocation} className="text-gray-700">
                          📍 {event.location}
                        </Text>
                        <Text style={styles.eventAttendees} className="text-gray-600">
                          👥 {event.attendees}/{event.maxAttendees} going
                        </Text>
                      </View>
                    </View>

                    <View style={styles.eventActions} className="items-end">
                      <View style={styles.categoryBadge} className="bg-purple-100 px-2 py-1 rounded mb-2">
                        <Text style={styles.categoryText} className="text-purple-700 text-xs font-medium">
                          {event.category}
                        </Text>
                      </View>
                      
                      <Text style={styles.eventPrice} className="text-lg font-bold text-purple-600">
                        {event.price}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.eventDescription} className="text-gray-600 mb-4">
                    {event.description}
                  </Text>

                  <View style={styles.eventFooter} className="flex-row justify-between items-center">
                    <View style={styles.attendeeProgress} className="flex-1 mr-4">
                      <View style={styles.progressBar} className="bg-gray-200 h-2 rounded-full overflow-hidden">
                        <View 
                          style={[styles.progressFill, { width: `${(event.attendees / event.maxAttendees) * 100}%` }]} 
                          className="bg-purple-600 h-full"
                        />
                      </View>
                      <Text style={styles.spotsLeft} className="text-xs text-gray-500 mt-1">
                        {event.maxAttendees - event.attendees} spots left
                      </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.joinButton} className="bg-purple-600 px-6 py-2 rounded-lg">
                      <Text style={styles.joinButtonText} className="text-white font-medium">
                        Join Event
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
            <Link href="/(hosting)/add-event" asChild>
              <TouchableOpacity style={styles.actionCard} className="bg-purple-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">📅</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  Host an Event
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Create your own event
                </Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(screens)/my-events" asChild>
              <TouchableOpacity style={styles.actionCard} className="bg-blue-50 p-4 rounded-lg mr-3 mb-3 flex-1">
                <Text style={styles.actionIcon} className="text-2xl mb-2">🎫</Text>
                <Text style={styles.actionTitle} className="font-medium text-gray-900">
                  My Events
                </Text>
                <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                  Events you're attending
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
    backgroundColor: '#7c3aed',
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
    backgroundColor: '#7c3aed',
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
    color: '#7c3aed',
    fontWeight: '500',
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventIcon: {
    marginRight: 12,
  },
  eventEmoji: {
    fontSize: 32,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventHost: {
    color: '#6b7280',
    marginBottom: 8,
  },
  eventMeta: {
    gap: 4,
  },
  eventDateTime: {
    color: '#374151',
  },
  eventLocation: {
    color: '#374151',
  },
  eventAttendees: {
    color: '#6b7280',
  },
  eventActions: {
    alignItems: 'flex-end',
  },
  categoryBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '500',
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  eventDescription: {
    color: '#6b7280',
    marginBottom: 16,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeeProgress: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#7c3aed',
    height: '100%',
  },
  spotsLeft: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    backgroundColor: '#f3e8ff',
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
