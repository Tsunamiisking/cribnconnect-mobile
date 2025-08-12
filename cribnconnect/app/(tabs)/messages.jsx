import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalHeader from '@/components/NormalHeader';
import UserLinkupsCarousel from '@/components/UserLinkupsCarousel';
import { Colors } from '@/constants/Colors';
import { MessageCircle, Users, Calendar, MapPin } from 'lucide-react-native';

// Mock data - TODO: Replace with API integration
const APARTMENT_CONVERSATIONS = [
  {
    id: '1',
    type: 'direct',
    participant: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
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
    id: '4',
    type: 'group',
    name: 'Downtown Apartment Hunters',
    avatar: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    participants: 8,
    lastMessage: {
      text: 'Alex: Found a great 1BR for $1800, sharing details...',
      timestamp: '3 hours ago',
      unread: false,
    },
    context: 'Apartment Group',
  },
];

const EVENT_CONVERSATIONS = [
  {
    id: '3',
    type: 'direct',
    participant: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
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
    id: '7',
    type: 'group',
    name: 'Photography Meetup',
    avatar: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
    participants: 15,
    lastMessage: {
      text: 'Emma: Next shoot is this Saturday at sunrise!',
      timestamp: '2 hours ago',
      unread: true,
    },
    context: 'Event Group',
  },
];

const LINKUP_CONVERSATIONS = [
  {
    id: '2',
    type: 'group',
    name: 'Coffee & Code Buddies',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    participants: 12,
    lastMessage: {
      text: 'Emma: Who\'s joining us for tomorrow\'s session?',
      timestamp: '15 min ago',
      unread: true,
    },
    context: 'Linkup Group',
  },
  {
    id: '5',
    type: 'direct',
    participant: {
      name: 'Lisa Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
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

const MESSAGE_TABS = [
  { id: 'apartments', title: 'Apartments', icon: 'building' },
  { id: 'events', title: 'Events', icon: 'calendar' },
  { id: 'linkups', title: 'Linkups', icon: 'users' },
];

export default function MessagesScreen() {
  const [selectedTab, setSelectedTab] = useState('apartments');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh messages data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return Colors.emerald;
      case 'away': return Colors.amber;
      case 'offline': return Colors.gray500;
      default: return Colors.gray500;
    }
  };

  const getCurrentConversations = () => {
    switch (selectedTab) {
      case 'apartments': return APARTMENT_CONVERSATIONS;
      case 'events': return EVENT_CONVERSATIONS;
      case 'linkups': return LINKUP_CONVERSATIONS;
      default: return [];
    }
  };

  const renderTabButton = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.tabButton,
        selectedTab === tab.id && styles.activeTabButton
      ]}
      onPress={() => setSelectedTab(tab.id)}
    >
      <Text style={[
        styles.tabText,
        selectedTab === tab.id && styles.activeTabText
      ]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderConversationCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => router.push(`/(screens)/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        {item.type === 'direct' ? (
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: item.participant.avatar }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: getStatusColor(item.participant.status) }
            ]} />
          </View>
        ) : (
          <View style={styles.groupAvatarContainer}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.groupAvatar}
              resizeMode="cover"
            />
            <View style={styles.groupIndicator}>
              <Users size={12} color={Colors.white} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.type === 'direct' ? item.participant.name : item.name}
          </Text>
          <Text style={styles.timestamp}>
            {item.lastMessage.timestamp}
          </Text>
        </View>

        <Text style={styles.context}>
          {item.context}
        </Text>

        <View style={styles.messagePreview}>
          <Text 
            style={[
              styles.lastMessage,
              item.lastMessage.unread && styles.unreadMessage
            ]}
            numberOfLines={2}
          >
            {item.lastMessage.text}
          </Text>
          
          {item.lastMessage.unread && (
            <View style={styles.unreadBadge} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Messages" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsContent}>
            {MESSAGE_TABS.map(renderTabButton)}
          </View>
        </View>

        {/* Tab Content */}
        {selectedTab === 'linkups' ? (
          // Special content for Linkups tab - show active linkups
          <View>
            <UserLinkupsCarousel />
            
            {/* Linkup Conversations */}
            <View style={styles.conversationsSection}>
              <Text style={styles.sectionTitle}>Linkup Conversations</Text>
              <FlatList
                data={getCurrentConversations()}
                renderItem={renderConversationCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        ) : (
          // Regular conversations for Apartments and Events tabs
          <View style={styles.conversationsSection}>
            <Text style={styles.sectionTitle}>
              {selectedTab === 'apartments' ? 'Apartment Conversations' : 'Event Conversations'}
            </Text>
            
            {getCurrentConversations().length > 0 ? (
              <FlatList
                data={getCurrentConversations()}
                renderItem={renderConversationCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MessageCircle size={48} color={Colors.gray400} />
                <Text style={styles.emptyTitle}>No conversations yet</Text>
                <Text style={styles.emptySubtitle}>
                  {selectedTab === 'apartments' 
                    ? "Start connecting with apartment hunters and landlords!"
                    : "Join events to start conversations with other attendees!"
                  }
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabsContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray500,
  },
  activeTabText: {
    color: Colors.white,
  },
  conversationsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginBottom: 16,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 1,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  groupAvatarContainer: {
    position: 'relative',
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    flex: 1,
  },
  timestamp: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
  },
  context: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 6,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontFamily: 'Sora-Medium',
    color: Colors.gray900,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 85 : 60,
  },
});
