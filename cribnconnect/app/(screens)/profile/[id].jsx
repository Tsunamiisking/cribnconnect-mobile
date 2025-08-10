import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    // TODO: Fetch profile details from API
    // Example API call:
    // const fetchProfile = async () => {
    //   try {
    //     const response = await api.getUserProfile(id);
    //     setProfile(response.data);
    //     setIsCurrentUser(response.data.isCurrentUser);
    //   } catch (error) {
    //     console.error('Error fetching profile:', error);
    //   }
    // };
    // fetchProfile();

    // Mock data for now
    setProfile({
      id: id,
      name: 'Sarah Johnson',
      bio: 'NYC native who loves exploring the city, trying new restaurants, and meeting interesting people. Always up for an adventure!',
      age: 28,
      location: 'Manhattan, NY',
      joinedDate: '2024-01-15',
      interests: ['Photography', 'Hiking', 'Food', 'Travel', 'Music', 'Art'],
      profileImage: 'https://via.placeholder.com/150x150?text=Profile',
      stats: {
        eventsHosted: 12,
        eventsAttended: 34,
        linkupsJoined: 8,
        apartmentsViewed: 23,
      },
      badges: ['Event Host', 'Community Member', 'Explorer'],
      isVerified: true,
      recentActivity: [
        { type: 'event', title: 'Hosted Summer Rooftop Party', date: '2024-01-20' },
        { type: 'linkup', title: 'Joined Weekend Hiking Group', date: '2024-01-18' },
        { type: 'apartment', title: 'Viewed Studio in SoHo', date: '2024-01-16' },
      ]
    });
    
    // Check if this is the current user's profile
    setIsCurrentUser(id === 'me' || id === 'current');
  }, [id]);

  const handleMessage = () => {
    // TODO: Navigate to chat with this user
    router.push(`/(screens)/chat/${profile?.id}`);
  };

  const handleFollow = () => {
    // TODO: Add API integration for following/unfollowing
    console.log('Follow/unfollow user:', profile?.id);
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Share profile:', profile?.name);
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleReportUser = () => {
    // TODO: Implement reporting functionality
    console.log('Report user:', profile?.id);
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer} className="flex-1 justify-center items-center bg-white">
        <Text style={styles.loadingText} className="text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} className="flex-1 bg-white">
      <ScrollView style={styles.content} className="flex-1">
        {/* Profile Header */}
        <View style={styles.profileHeader} className="px-6 py-6 bg-gradient-to-b from-blue-50 to-white">
          <View style={styles.profileInfo} className="items-center">
            <View style={styles.profileImageContainer} className="relative mb-4">
              <Image 
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
                className="w-24 h-24 rounded-full"
              />
              {profile.isVerified && (
                <View style={styles.verifiedBadge} className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <Text style={styles.verifiedIcon} className="text-white text-xs">✓</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.profileName} className="text-2xl font-bold text-gray-900 mb-1">
              {profile.name}
            </Text>
            
            <Text style={styles.profileLocation} className="text-gray-600 mb-2">
              📍 {profile.location}
            </Text>
            
            <Text style={styles.joinDate} className="text-gray-500 text-sm">
              Member since {new Date(profile.joinedDate).toLocaleDateString()}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons} className="flex-row mt-6 space-x-3">
            {isCurrentUser ? (
              <TouchableOpacity 
                style={styles.editButton}
                className="flex-1 bg-blue-600 py-3 rounded-lg"
                onPress={handleEditProfile}
              >
                <Text style={styles.editButtonText} className="text-center text-white font-medium">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.messageButton}
                  className="flex-1 bg-blue-600 py-3 rounded-lg"
                  onPress={handleMessage}
                >
                  <Text style={styles.messageButtonText} className="text-center text-white font-medium">
                    Message
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.followButton}
                  className="flex-1 bg-gray-100 py-3 rounded-lg"
                  onPress={handleFollow}
                >
                  <Text style={styles.followButtonText} className="text-center text-gray-700 font-medium">
                    Follow
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.detailsContainer} className="px-6">
          {/* Bio Section */}
          {profile.bio && (
            <View style={styles.bioSection} className="py-6 border-b border-gray-100">
              <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
                About
              </Text>
              <Text style={styles.bioText} className="text-gray-700 leading-6">
                {profile.bio}
              </Text>
            </View>
          )}

          {/* Stats Section */}
          <View style={styles.statsSection} className="py-6 border-b border-gray-100">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-4">
              Activity Stats
            </Text>
            <View style={styles.statsGrid} className="flex-row flex-wrap">
              <View style={styles.statItem} className="w-1/2 mb-4">
                <Text style={styles.statNumber} className="text-2xl font-bold text-blue-600">
                  {profile.stats.eventsHosted}
                </Text>
                <Text style={styles.statLabel} className="text-gray-600 text-sm">Events Hosted</Text>
              </View>
              <View style={styles.statItem} className="w-1/2 mb-4">
                <Text style={styles.statNumber} className="text-2xl font-bold text-purple-600">
                  {profile.stats.eventsAttended}
                </Text>
                <Text style={styles.statLabel} className="text-gray-600 text-sm">Events Attended</Text>
              </View>
              <View style={styles.statItem} className="w-1/2 mb-4">
                <Text style={styles.statNumber} className="text-2xl font-bold text-green-600">
                  {profile.stats.linkupsJoined}
                </Text>
                <Text style={styles.statLabel} className="text-gray-600 text-sm">Linkups Joined</Text>
              </View>
              <View style={styles.statItem} className="w-1/2 mb-4">
                <Text style={styles.statNumber} className="text-2xl font-bold text-orange-600">
                  {profile.stats.apartmentsViewed}
                </Text>
                <Text style={styles.statLabel} className="text-gray-600 text-sm">Apartments Viewed</Text>
              </View>
            </View>
          </View>

          {/* Interests Section */}
          <View style={styles.interestsSection} className="py-6 border-b border-gray-100">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              Interests
            </Text>
            <View style={styles.interestsTags} className="flex-row flex-wrap">
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag} className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text style={styles.interestText} className="text-blue-700 text-sm">{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Badges Section */}
          {profile.badges && profile.badges.length > 0 && (
            <View style={styles.badgesSection} className="py-6 border-b border-gray-100">
              <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
                Badges
              </Text>
              <View style={styles.badgesList} className="flex-row flex-wrap">
                {profile.badges.map((badge, index) => (
                  <View key={index} style={styles.badge} className="bg-yellow-100 px-3 py-2 rounded-lg mr-2 mb-2 flex-row items-center">
                    <Text style={styles.badgeIcon} className="text-yellow-600 mr-1">🏆</Text>
                    <Text style={styles.badgeText} className="text-yellow-700 text-sm font-medium">{badge}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recent Activity Section */}
          <View style={styles.activitySection} className="py-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </Text>
            <View style={styles.activityList}>
              {profile.recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem} className="flex-row items-center py-3 border-b border-gray-50">
                  <View style={styles.activityIcon} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Text style={styles.activityEmoji}>
                      {activity.type === 'event' ? '🎉' : 
                       activity.type === 'linkup' ? '🤝' : 
                       activity.type === 'apartment' ? '🏠' : '📱'}
                    </Text>
                  </View>
                  <View style={styles.activityContent} className="flex-1">
                    <Text style={styles.activityTitle} className="text-gray-900 font-medium">
                      {activity.title}
                    </Text>
                    <Text style={styles.activityDate} className="text-gray-500 text-sm">
                      {new Date(activity.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Report Section (for other users) */}
          {!isCurrentUser && (
            <View style={styles.reportSection} className="py-6">
              <TouchableOpacity onPress={handleReportUser}>
                <Text style={styles.reportText} className="text-red-600 text-center text-sm">
                  Report User
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#eff6ff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#2563eb',
    borderRadius: 50,
    padding: 4,
  },
  verifiedIcon: {
    color: 'white',
    fontSize: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileLocation: {
    color: '#6b7280',
    marginBottom: 8,
  },
  joinDate: {
    color: '#9ca3af',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  messageButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  followButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  detailsContainer: {
    paddingHorizontal: 24,
  },
  bioSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  bioText: {
    color: '#374151',
    lineHeight: 24,
  },
  statsSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  interestsSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#1d4ed8',
    fontSize: 14,
  },
  badgesSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    color: '#d97706',
    marginRight: 4,
  },
  badgeText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
  },
  activitySection: {
    paddingVertical: 24,
  },
  activityList: {},
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#111827',
    fontWeight: '500',
  },
  activityDate: {
    color: '#9ca3af',
    fontSize: 14,
  },
  reportSection: {
    paddingVertical: 24,
  },
  reportText: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
  },
});
