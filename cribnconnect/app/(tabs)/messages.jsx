import NormalHeader from '@/components/NormalHeader';
import UserLinkupsCarousel from '@/components/UserLinkupsCarousel';
import { auth } from '@/config/firebase';
import { Colors } from '@/constants/Colors';
import { subscribeUserEventChats } from '@/services/eventChatService';
import { subscribeUserLinkupChats } from '@/services/linkupChatService';
import { subscribeUserPrivateChats } from '@/services/privateChatService';
import { router } from 'expo-router';
import { Calendar, MessageCircle, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    type: 'direct',
    participant: {
      name: 'Michael Lee',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face',
    },
    lastMessage: {
      text: 'Thanks for the apartment recommendation! When can we schedule a viewing?',
      timestamp: '2 min ago',
      unread: true,
    },
    context: 'Apartment Inquiry',
  },
];

// Event conversations will be fetched from Firestore
// const EVENT_CONVERSATIONS = [];

// Conversations from linkups that the user has joined (but not created)
// This will be replaced with real Firestore data
// const LINKUP_CONVERSATIONS = [];

const MESSAGE_TABS = [
  { id: 'direct', title: 'Direct', icon: 'message-circle' },
  { id: 'groups', title: 'Groups', icon: 'users' },
];

export default function MessagesScreen() {
  const [selectedTab, setSelectedTab] = useState('direct');
  const [refreshing, setRefreshing] = useState(false);
  const [linkupChats, setLinkupChats] = useState([]);
  const [eventChats, setEventChats] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [loadingLinkups, setLoadingLinkups] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPrivateChats, setLoadingPrivateChats] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        console.log('User not authenticated, clearing chats');
        setLinkupChats([]);
        setEventChats([]);
        setPrivateChats([]);
        setLoadingLinkups(false);
        setLoadingEvents(false);
        setLoadingPrivateChats(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to user's linkup chats
  useEffect(() => {
    const currentUser = auth?.currentUser;
    
    if (!currentUser || !isAuthenticated) {
      console.log('No authenticated user');
      setLoadingLinkups(false);
      return;
    }

    console.log('Subscribing to linkup chats for user:', currentUser.uid);
    
    const unsubscribe = subscribeUserLinkupChats(currentUser.uid, (chats) => {
      console.log('Received linkup chats:', chats.length);
      setLinkupChats(chats);
      setLoadingLinkups(false);
    });

    return () => {
      console.log('Unsubscribing from linkup chats');
      unsubscribe();
    };
  }, [isAuthenticated]);

  // Subscribe to user's event chats
  useEffect(() => {
    const currentUser = auth?.currentUser;
    
    if (!currentUser || !isAuthenticated) {
      console.log('No authenticated user');
      setLoadingEvents(false);
      return;
    }

    console.log('Subscribing to event chats for user:', currentUser.uid);
    
    const unsubscribe = subscribeUserEventChats(currentUser.uid, (chats) => {
      console.log('Received event chats:', chats.length);
      setEventChats(chats);
      // console.log('Event chats updated:', chats);
      setLoadingEvents(false);
    });

    return () => {
      console.log('Unsubscribing from event chats');
      unsubscribe();
    };
  }, [isAuthenticated]);

  // Subscribe to user's private chats (Firestore real-time)
  useEffect(() => {
    const currentUser = auth?.currentUser;
    
    if (!currentUser || !isAuthenticated) {
      console.log('No authenticated user for private chats');
      setLoadingPrivateChats(false);
      return;
    }

    console.log('Subscribing to private chats for user:', currentUser.uid);
    
    const unsubscribe = subscribeUserPrivateChats(currentUser.uid, (chats) => {
      console.log('Received private chats:', chats.length);
      setPrivateChats(chats);
      setLoadingPrivateChats(false);
    });

    return () => {
      console.log('Unsubscribing from private chats');
      unsubscribe();
    };
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    // The real-time listeners will automatically update the data
    // Just simulate a refresh delay for UX
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Format timestamp to relative time (e.g., "2 min ago", "3 hours ago")
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Format linkup chats to match the conversation card format
  const formatLinkupChats = () => {
    const currentUserId = auth?.currentUser?.uid;
    
    return linkupChats.map(chat => ({
      id: chat.id, // This is the linkup ID
      type: 'group',
      chatType: 'linkup',
      name: chat.name,
      avatar: chat.photo || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
      participants: chat.participantIds?.length || 0,
      lastMessage: chat.lastMessage ? {
        text: chat.lastMessage.senderName === 'System' 
          ? chat.lastMessage.text 
          : `${chat.lastMessage.senderName}: ${chat.lastMessage.text}`,
        timestamp: formatTimestamp(chat.lastMessage.timestamp),
        unread: chat.unreadBy?.includes(currentUserId) || false,
      } : {
        text: 'No messages yet',
        timestamp: '',
        unread: false,
      },
      context: 'Linkup Group',
    }));
  };

  // Format event chats to match the conversation card format
  const formatEventChats = () => {
    const currentUserId = auth?.currentUser?.uid;
    
    return eventChats.map(chat => ({
      id: chat.id, // This is the event ID
      type: 'group',
      chatType: 'event',
      name: chat.name,
      avatar: chat.photo || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
      participants: chat.participantIds?.length || 0,
      lastMessage: chat.lastMessage ? {
        text: chat.lastMessage.senderName === 'System' 
          ? chat.lastMessage.text 
          : `${chat.lastMessage.senderName}: ${chat.lastMessage.text}`,
        timestamp: formatTimestamp(chat.lastMessage.timestamp),
        unread: chat.unreadBy?.includes(currentUserId) || false,
      } : {
        text: 'No messages yet',
        timestamp: '',
        unread: false,
      },
      context: 'Event Group',
    }));
  };

  // Format private chats to match the conversation card format
  const formatPrivateChats = () => {
    const currentUserId = auth?.currentUser?.uid;
    
    return privateChats.map(chat => ({
      id: chat.conversationId,
      type: 'direct',
      chatType: 'private',
      participant: {
        name: chat.otherUser?.name || 'Unknown User',
        avatar: chat.otherUser?.photoURL || null,
        status: 'offline', // We don't have real-time status yet
      },
      lastMessage: {
        text: chat.lastMessage?.text || chat.firstMessage?.text || 'No messages yet',
        timestamp: formatTimestamp(chat.lastMessage?.timestamp || chat.createdAt),
        unread: chat.hasUnread,
      },
      context: chat.status === 'pending' 
        ? (chat.isRecipient ? '📬 New Request' : '⏳ Pending') 
        : chat.status === 'ignored'
        ? '🚫 Ignored'
        : 'Direct Message',
      status: chat.status,
      canSendMessages: chat.canSendMessages,
    }));
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
      case 'direct':
        return formatPrivateChats();
      case 'groups':
        // Combine all group chats: events, linkups, and apartments
        return [
          ...formatEventChats(),
          ...formatLinkupChats(),
          ...APARTMENT_CONVERSATIONS.map(apt => ({ ...apt, chatType: 'apartment' }))
        ].sort((a, b) => {
          // Sort by timestamp, most recent first
          const timeA = a.lastMessage?.timestamp || '';
          const timeB = b.lastMessage?.timestamp || '';
          return timeB.localeCompare(timeA);
        });
      default:
        return [];
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
      onPress={() => {
        // Navigate to appropriate chat screen based on chatType
        if (item.chatType === 'private') {
          router.push(`/(screens)/private-chat/${item.id}`);
        } else if (item.chatType === 'linkup') {
          router.push(`/(screens)/chat/${item.id}?type=linkup`);
        } else if (item.chatType === 'event') {
          router.push(`/(screens)/chat/${item.id}?type=event`);
        } else if (item.chatType === 'apartment') {
          router.push(`/(screens)/chat/${item.id}?type=apartment`);
        }
      }}
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
            <View style={[
              styles.groupIndicator,
              item.chatType === 'event' && styles.eventIndicator,
              item.chatType === 'linkup' && styles.linkupIndicator,
            ]}>
              {item.chatType === 'event' ? (
                <Calendar size={12} color={Colors.white} />
              ) : (
                <Users size={12} color={Colors.white} />
              )}
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
      
      {!isAuthenticated ? (
        // Show login prompt when not authenticated
        <View style={styles.authPromptContainer}>
          <MessageCircle size={64} color={Colors.gray400} />
          <Text style={styles.authPromptTitle}>Sign in to view messages</Text>
          <Text style={styles.authPromptText}>
            You need to be logged in to access your conversations
          </Text>
        </View>
      ) : (
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
        {selectedTab === 'direct' ? (
          // Direct Messages Tab - Show private 1-on-1 chats
          <View style={styles.conversationsSection}>
            <Text style={styles.sectionTitle}>Direct Messages</Text>
            
            {loadingPrivateChats ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading conversations...</Text>
              </View>
            ) : getCurrentConversations().length > 0 ? (
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
                <Text style={styles.emptyTitle}>No direct messages yet</Text>
                <Text style={styles.emptySubtitle}>
                  Start a conversation from someone's profile to connect privately!
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Groups Tab - Show all group chats (events, linkups, apartments)
          <View>
            <UserLinkupsCarousel />
            
            <View style={styles.conversationsSection}>
              <Text style={styles.sectionTitle}>Group Conversations</Text>
              
              {(loadingLinkups || loadingEvents) ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>Loading conversations...</Text>
                </View>
              ) : getCurrentConversations().length > 0 ? (
                <FlatList
                  data={getCurrentConversations()}
                  renderItem={renderConversationCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Users size={48} color={Colors.gray400} />
                  <Text style={styles.emptyTitle}>No group conversations yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Join events, linkups, or apartment groups to start chatting!
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      )}
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
    fontFamily: 'Sora-medium',
    fontSize: 13,
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
  eventIndicator: {
    backgroundColor: Colors.success, // Green for events
  },
  linkupIndicator: {
    backgroundColor: Colors.primary, // Primary blue for linkups
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
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 85 : 60,
  },
  authPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authPromptTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginTop: 24,
    marginBottom: 12,
  },
  authPromptText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
});
