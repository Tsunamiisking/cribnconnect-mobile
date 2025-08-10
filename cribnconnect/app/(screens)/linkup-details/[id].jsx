import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

export default function LinkupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [linkup, setLinkup] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);

  useEffect(() => {
    // TODO: Fetch linkup details from API
    // Example API call:
    // const fetchLinkup = async () => {
    //   try {
    //     const response = await api.getLinkup(id);
    //     setLinkup(response.data);
    //     setIsBookmarked(response.data.isBookmarked);
    //     setHasExpressedInterest(response.data.hasExpressedInterest);
    //   } catch (error) {
    //     console.error('Error fetching linkup:', error);
    //   }
    // };
    // fetchLinkup();

    // Mock data for now
    setLinkup({
      id: id,
      title: 'Weekend Hiking Group',
      description: 'Looking for hiking enthusiasts to explore trails around NYC area. Perfect for beginners and experienced hikers. We usually meet on weekends and explore different locations.',
      type: 'Activity Partner',
      hostName: 'Alex Chen',
      groupSize: '4-6 people',
      duration: 'Weekly',
      ageRange: '26-35',
      genderPreference: 'Mixed Group',
      interests: ['Hiking', 'Photography', 'Nature', 'Fitness'],
      location: 'Manhattan & surrounding areas',
      meetingSpot: 'Usually meet at subway stations near trailheads, Central Park, or designated hiking spots',
      contactMethod: 'App Messaging',
      interestedCount: 12,
      memberCount: 4,
      maxMembers: 6,
      isActive: true,
      createdAt: '2024-01-15',
      lastActivity: '2024-01-20'
    });
  }, [id]);

  const handleExpressInterest = () => {
    // TODO: Add API integration for expressing interest
    // Example API call:
    // try {
    //   const response = await api.expressInterestInLinkup(id, !hasExpressedInterest);
    //   setHasExpressedInterest(!hasExpressedInterest);
    // } catch (error) {
    //   console.error('Error updating interest:', error);
    // }
    
    setHasExpressedInterest(!hasExpressedInterest);
  };

  const handleBookmark = () => {
    // TODO: Add API integration for bookmarking
    // Example API call:
    // try {
    //   const response = await api.bookmarkLinkup(id, !isBookmarked);
    //   setIsBookmarked(!isBookmarked);
    // } catch (error) {
    //   console.error('Error updating bookmark:', error);
    // }
    
    setIsBookmarked(!isBookmarked);
  };

  const handleContactHost = () => {
    // TODO: Navigate to messaging or contact options based on contact method
    if (linkup?.contactMethod === 'App Messaging') {
      router.push(`/(screens)/chat/${linkup?.hostName || 'host'}`);
    } else {
      // Handle other contact methods
      console.log('Contact via:', linkup?.contactMethod);
    }
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Share linkup:', linkup?.title);
  };

  const handleViewMembers = () => {
    // TODO: Navigate to members list
    console.log('View members for linkup:', id);
  };

  if (!linkup) {
    return (
      <View style={styles.loadingContainer} className="flex-1 justify-center items-center bg-white">
        <Text style={styles.loadingText} className="text-gray-500">Loading linkup details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} className="flex-1 bg-white">
      <ScrollView style={styles.content} className="flex-1">
        <View style={styles.detailsContainer} className="px-6 py-6">
          {/* Header Info */}
          <View style={styles.header} className="mb-6">
            <View style={styles.topRow} className="flex-row justify-between items-start mb-3">
              <View style={styles.typeBadge} className="bg-green-100 px-3 py-1 rounded-full">
                <Text style={styles.typeText} className="text-green-700 text-sm font-medium">
                  {linkup.type}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.bookmarkButton}
                className={`p-2 rounded-full ${isBookmarked ? 'bg-green-600' : 'bg-gray-100'}`}
                onPress={handleBookmark}
              >
                <Text style={styles.bookmarkIcon} className={isBookmarked ? 'text-white' : 'text-green-600'}>
                  {isBookmarked ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.title} className="text-2xl font-bold text-gray-900 mb-2">
              {linkup.title}
            </Text>
            
            <Text style={styles.host} className="text-gray-600 mb-4">
              Hosted by {linkup.hostName}
            </Text>

            {/* Status Indicators */}
            <View style={styles.statusRow} className="flex-row items-center space-x-4">
              <View style={styles.statusItem} className="flex-row items-center">
                <Text style={styles.statusIcon} className="text-green-600 mr-1">👥</Text>
                <Text style={styles.statusText} className="text-gray-700 text-sm">
                  {linkup.memberCount}/{linkup.maxMembers} members
                </Text>
              </View>
              <View style={styles.statusItem} className="flex-row items-center">
                <Text style={styles.statusIcon} className="text-blue-600 mr-1">👋</Text>
                <Text style={styles.statusText} className="text-gray-700 text-sm">
                  {linkup.interestedCount} interested
                </Text>
              </View>
              {linkup.isActive && (
                <View style={styles.activeBadge} className="bg-green-100 px-2 py-1 rounded-full">
                  <Text style={styles.activeText} className="text-green-700 text-xs">Active</Text>
                </View>
              )}
            </View>
          </View>

          {/* Key Details */}
          <View style={styles.keyDetails} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-4">
              Group Details
            </Text>

            <View style={styles.detailGrid}>
              <View style={styles.detailRow} className="flex-row justify-between py-3 border-b border-gray-100">
                <Text style={styles.detailLabel} className="text-gray-600">Group Size</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">{linkup.groupSize}</Text>
              </View>

              <View style={styles.detailRow} className="flex-row justify-between py-3 border-b border-gray-100">
                <Text style={styles.detailLabel} className="text-gray-600">Frequency</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">{linkup.duration}</Text>
              </View>

              <View style={styles.detailRow} className="flex-row justify-between py-3 border-b border-gray-100">
                <Text style={styles.detailLabel} className="text-gray-600">Age Range</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">{linkup.ageRange}</Text>
              </View>

              <View style={styles.detailRow} className="flex-row justify-between py-3 border-b border-gray-100">
                <Text style={styles.detailLabel} className="text-gray-600">Group Preference</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">{linkup.genderPreference}</Text>
              </View>

              <View style={styles.detailRow} className="flex-row justify-between py-3">
                <Text style={styles.detailLabel} className="text-gray-600">Contact Method</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">{linkup.contactMethod}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              About This Group
            </Text>
            <Text style={styles.description} className="text-gray-700 leading-6">
              {linkup.description}
            </Text>
          </View>

          {/* Interests */}
          <View style={styles.interestsSection} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              Shared Interests
            </Text>
            <View style={styles.interestsTags} className="flex-row flex-wrap">
              {linkup.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag} className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text style={styles.interestText} className="text-green-700 text-sm">{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location Info */}
          <View style={styles.locationSection} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              Location & Meeting Spots
            </Text>
            <View style={styles.locationItem} className="mb-3">
              <Text style={styles.locationLabel} className="text-gray-600 text-sm">Preferred Area</Text>
              <Text style={styles.locationValue} className="text-gray-900 font-medium">{linkup.location}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel} className="text-gray-600 text-sm">Typical Meeting Spots</Text>
              <Text style={styles.locationValue} className="text-gray-700">{linkup.meetingSpot}</Text>
            </View>
          </View>

          {/* Members Section */}
          <View style={styles.membersSection} className="mb-6">
            <View style={styles.membersHeader} className="flex-row justify-between items-center mb-3">
              <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900">
                Group Members
              </Text>
              <TouchableOpacity onPress={handleViewMembers}>
                <Text style={styles.viewAllText} className="text-green-600 text-sm">View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.memberPreview} className="bg-gray-50 p-4 rounded-lg">
              <Text style={styles.memberCount} className="text-gray-700">
                {linkup.memberCount} current members, {linkup.maxMembers - linkup.memberCount} spots available
              </Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              Contact Host
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              className="bg-gray-50 p-4 rounded-lg flex-row justify-between items-center"
              onPress={handleContactHost}
            >
              <View>
                <Text style={styles.contactName} className="text-gray-900 font-medium">{linkup.hostName}</Text>
                <Text style={styles.contactInfo} className="text-gray-600 text-sm">
                  Message via {linkup.contactMethod}
                </Text>
              </View>
              <Text style={styles.contactArrow} className="text-gray-400">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar} className="px-6 py-4 bg-white border-t border-gray-200">
        <View style={styles.actionButtons} className="flex-row space-x-3">
          <TouchableOpacity 
            style={styles.shareButton}
            className="flex-1 bg-gray-100 py-3 rounded-lg"
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText} className="text-center text-gray-700 font-medium">
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.interestButton, hasExpressedInterest && styles.interestedButton]}
            className={`flex-2 py-3 rounded-lg ${hasExpressedInterest ? 'bg-blue-600' : 'bg-green-600'}`}
            onPress={handleExpressInterest}
          >
            <Text style={styles.interestButtonText} className="text-center text-white font-medium">
              {hasExpressedInterest ? 'Interest Sent ✓' : 'Express Interest'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  typeText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 50,
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  host: {
    color: '#6b7280',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#374151',
    fontSize: 14,
  },
  activeBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  activeText: {
    color: '#15803d',
    fontSize: 12,
  },
  keyDetails: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  detailGrid: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    color: '#6b7280',
  },
  detailValue: {
    color: '#111827',
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    color: '#374151',
    lineHeight: 24,
  },
  interestsSection: {
    marginBottom: 24,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#15803d',
    fontSize: 14,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationItem: {
    marginBottom: 12,
  },
  locationLabel: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 4,
  },
  locationValue: {
    color: '#111827',
    fontWeight: '500',
  },
  membersSection: {
    marginBottom: 24,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#059669',
    fontSize: 14,
  },
  memberPreview: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  memberCount: {
    color: '#374151',
  },
  contactSection: {
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    color: '#111827',
    fontWeight: '500',
  },
  contactInfo: {
    color: '#6b7280',
    fontSize: 14,
  },
  contactArrow: {
    color: '#9ca3af',
    fontSize: 18,
  },
  actionBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  interestButton: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
  },
  interestedButton: {
    backgroundColor: '#2563eb',
  },
  interestButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
});
