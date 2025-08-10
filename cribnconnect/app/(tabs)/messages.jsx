import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

// Mock data - TODO: Replace with API integration
const CONVERSATIONS = [
  {
    id: '1',
    type: 'direct',
    participant: {
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      status: 'online',
    },
    lastMessage: {
      text: 'Thanks for the apartment recommendation! When can we schedule a viewing?',
      timestamp: '2 min ago',
      unread: true,
    },
    context: 'Apartment Inquiry',
  },
  {
    id: '2',
    type: 'group',
    name: 'Coffee & Code Buddies',
    avatar: '☕',
    participants: 12,
    lastMessage: {
      text: 'Emma: Who\'s joining us for tomorrow\'s session?',
      timestamp: '15 min ago',
      unread: true,
    },
    context: 'Linkup Group',
  },
  {
    id: '3',
    type: 'direct',
    participant: {
      name: 'Mike Johnson',
      avatar: '👨‍🎨',
      status: 'offline',
    },
    lastMessage: {
      text: 'The event was amazing! Let\'s plan the next one.',
      timestamp: '1 hour ago',
      unread: false,
    },
    context: 'Event Follow-up',
  },
  {
    id: '4',
    type: 'group',
    name: 'Downtown Apartment Hunters',
    avatar: '🏢',
    participants: 8,
    lastMessage: {
      text: 'Alex: Found a great 1BR for $1800, sharing details...',
      timestamp: '3 hours ago',
      unread: false,
    },
    context: 'Apartment Group',
  },
  {
    id: '5',
    type: 'direct',
    participant: {
      name: 'Lisa Rodriguez',
      avatar: '👩‍🎯',
      status: 'away',
    },
    lastMessage: {
      text: 'Perfect! See you at the photography walk this weekend.',
      timestamp: 'Yesterday',
      unread: false,
    },
    context: 'Linkup Chat',
  },
];

const MESSAGE_CATEGORIES = ['All', 'Apartments', 'Events', 'Linkups', 'Direct Messages'];

export default function MessagesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh messages data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container} className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header} className="px-6 pt-12 pb-4 bg-indigo-600">
        <View style={styles.headerTop} className="flex-row justify-between items-center mb-4">
          <View>
            <Text style={styles.greeting} className="text-white text-lg">
              Stay Connected 💬
            </Text>
            <Text style={styles.headerTitle} className="text-white text-2xl font-bold">
              Messages
            </Text>
          </View>
          
          <TouchableOpacity style={styles.composeButton} className="bg-white bg-opacity-20 p-3 rounded-full">
            <Text style={styles.composeButtonText} className="text-white text-lg">✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} className="bg-white rounded-lg p-4 flex-row items-center">
          <Text style={styles.searchPlaceholder} className="text-gray-500 flex-1">
            🔍 Search conversations...
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
              {MESSAGE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.activeFilterChip
                  ]}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-indigo-600' : 'bg-gray-100'
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

        {/* Conversations List */}
        <View style={styles.section} className="px-6 mb-6">
          <View style={styles.sectionHeader} className="flex-row justify-between items-center mb-4">
            <Text style={styles.sectionTitle} className="text-xl font-bold text-gray-900">
              Recent Conversations
            </Text>
            <TouchableOpacity>
              <Text style={styles.markAllRead} className="text-indigo-600 font-medium">
                Mark All Read
              </Text>
            </TouchableOpacity>
          </View>

          {CONVERSATIONS.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/(screens)/chat/${conversation.id}`}
              asChild
            >
              <TouchableOpacity style={styles.conversationCard} className="bg-white rounded-lg mb-3 border border-gray-100">
                <View style={styles.cardContent} className="p-4">
                  <View style={styles.conversationHeader} className="flex-row items-center justify-between mb-2">
                    <View style={styles.conversationInfo} className="flex-row items-center flex-1">
                      <View style={styles.avatarContainer} className="mr-3 relative">
                        <Text style={styles.avatar} className="text-3xl">
                          {conversation.type === 'direct' ? conversation.participant.avatar : conversation.avatar}
                        </Text>
                        {conversation.type === 'direct' && (
                          <View 
                            style={[styles.statusIndicator, { backgroundColor: getStatusColor(conversation.participant.status) }]} 
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                          />
                        )}
                        {conversation.type === 'group' && (
                          <View style={styles.groupIndicator} className="absolute -bottom-1 -right-1 bg-indigo-600 w-5 h-5 rounded-full items-center justify-center">
                            <Text style={styles.groupCount} className="text-white text-xs font-bold">
                              {conversation.participants}
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.nameContainer} className="flex-1">
                        <View style={styles.nameRow} className="flex-row items-center justify-between">
                          <Text style={styles.conversationName} className="text-lg font-semibold text-gray-900">
                            {conversation.type === 'direct' ? conversation.participant.name : conversation.name}
                          </Text>
                          <Text style={styles.timestamp} className="text-gray-500 text-sm">
                            {conversation.lastMessage.timestamp}
                          </Text>
                        </View>
                        
                        <Text style={styles.context} className="text-indigo-600 text-sm mb-1">
                          {conversation.context}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.messagePreview} className="flex-row items-center justify-between">
                    <Text 
                      style={[styles.lastMessage, conversation.lastMessage.unread && styles.unreadMessage]} 
                      className={`flex-1 ${conversation.lastMessage.unread ? 'text-gray-900 font-medium' : 'text-gray-600'} mr-3`}
                      numberOfLines={2}
                    >
                      {conversation.lastMessage.text}
                    </Text>
                    
                    {conversation.lastMessage.unread && (
                      <View style={styles.unreadBadge} className="bg-indigo-600 w-3 h-3 rounded-full" />
                    )}
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
            <TouchableOpacity style={styles.actionCard} className="bg-indigo-50 p-4 rounded-lg mr-3 mb-3 flex-1">
              <Text style={styles.actionIcon} className="text-2xl mb-2">💬</Text>
              <Text style={styles.actionTitle} className="font-medium text-gray-900">
                Start New Chat
              </Text>
              <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                Message someone new
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} className="bg-green-50 p-4 rounded-lg mr-3 mb-3 flex-1">
              <Text style={styles.actionIcon} className="text-2xl mb-2">👥</Text>
              <Text style={styles.actionTitle} className="font-medium text-gray-900">
                Create Group
              </Text>
              <Text style={styles.actionSubtitle} className="text-gray-600 text-sm">
                Start a group chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Empty State for New Users */}
        {CONVERSATIONS.length === 0 && (
          <View style={styles.emptyState} className="px-6 py-12 items-center">
            <Text style={styles.emptyIcon} className="text-6xl mb-4">💬</Text>
            <Text style={styles.emptyTitle} className="text-xl font-bold text-gray-900 mb-2">
              No conversations yet
            </Text>
            <Text style={styles.emptySubtitle} className="text-gray-600 text-center mb-6">
              Start connecting with people through apartments, events, and linkups!
            </Text>
            <TouchableOpacity style={styles.startChattingButton} className="bg-indigo-600 px-6 py-3 rounded-lg">
              <Text style={styles.startChattingText} className="text-white font-medium">
                Start Chatting
              </Text>
            </TouchableOpacity>
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
    backgroundColor: '#4f46e5',
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
  composeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
  },
  composeButtonText: {
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
    backgroundColor: '#4f46e5',
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
  markAllRead: {
    color: '#4f46e5',
    fontWeight: '500',
  },
  conversationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardContent: {
    padding: 16,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  conversationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    fontSize: 32,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  groupIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#4f46e5',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    color: '#6b7280',
    fontSize: 14,
  },
  context: {
    color: '#4f46e5',
    fontSize: 14,
    marginBottom: 4,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    color: '#6b7280',
    marginRight: 12,
  },
  unreadMessage: {
    color: '#111827',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#4f46e5',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    backgroundColor: '#eef2ff',
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
  emptyState: {
    paddingHorizontal: 24,
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
  startChattingButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startChattingText: {
    color: 'white',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
  },
});
