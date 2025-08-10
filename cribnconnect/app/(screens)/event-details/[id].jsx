import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    // TODO: Fetch event details from API
    // Example API call:
    // const fetchEvent = async () => {
    //   try {
    //     const response = await api.getEvent(id);
    //     setEvent(response.data);
    //     setIsBookmarked(response.data.isBookmarked);
    //     setIsAttending(response.data.isAttending);
    //   } catch (error) {
    //     console.error('Error fetching event:', error);
    //   }
    // };
    // fetchEvent();

    // Mock data for now
    setEvent({
      id: id,
      title: 'Summer Rooftop Party',
      description: 'Join us for an amazing sunset rooftop party with great music, drinks, and city views. This will be an unforgettable night with DJs, photo booths, and networking opportunities.',
      category: 'Party',
      date: '2024-07-15',
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      venue: 'Sky Lounge NYC',
      address: '123 Manhattan Ave, New York, NY 10001',
      organizer: 'Sarah Johnson',
      ticketPrice: 25,
      capacity: 150,
      attendeesCount: 87,
      ageRestriction: '21+',
      dressCode: 'Cocktail',
      requirements: ['ID Required', 'RSVP Required'],
      images: [
        'https://via.placeholder.com/400x300?text=Event+Photo+1',
        'https://via.placeholder.com/400x300?text=Event+Photo+2',
      ],
      amenities: ['Photography Allowed', 'Coat Check', 'Rooftop Access'],
      contactEmail: 'sarah@events.com',
      contactPhone: '(555) 123-4567',
    });
  }, [id]);

  const handleRSVP = () => {
    // TODO: Add API integration for RSVP
    // Example API call:
    // try {
    //   const response = await api.rsvpEvent(id, !isAttending);
    //   setIsAttending(!isAttending);
    // } catch (error) {
    //   console.error('Error updating RSVP:', error);
    // }
    
    setIsAttending(!isAttending);
  };

  const handleBookmark = () => {
    // TODO: Add API integration for bookmarking
    // Example API call:
    // try {
    //   const response = await api.bookmarkEvent(id, !isBookmarked);
    //   setIsBookmarked(!isBookmarked);
    // } catch (error) {
    //   console.error('Error updating bookmark:', error);
    // }
    
    setIsBookmarked(!isBookmarked);
  };

  const handleContactOrganizer = () => {
    // TODO: Navigate to messaging or contact options
    router.push(`/(screens)/chat/${event?.organizer || 'organizer'}`);
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Share event:', event?.title);
  };

  if (!event) {
    return (
      <View style={styles.loadingContainer} className="flex-1 justify-center items-center bg-white">
        <Text style={styles.loadingText} className="text-gray-500">Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} className="flex-1 bg-white">
      <ScrollView style={styles.content} className="flex-1">
        {/* Event Images */}
        <View style={styles.imageContainer} className="h-64 bg-gray-200">
          <Image 
            source={{ uri: event.images[0] }}
            style={styles.eventImage}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} className="absolute bottom-4 right-4">
            <TouchableOpacity 
              style={styles.bookmarkButton}
              className={`p-2 rounded-full ${isBookmarked ? 'bg-purple-600' : 'bg-white'}`}
              onPress={handleBookmark}
            >
              <Text style={styles.bookmarkIcon} className={isBookmarked ? 'text-white' : 'text-purple-600'}>
                {isBookmarked ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer} className="px-6 py-6">
          {/* Header Info */}
          <View style={styles.header} className="mb-6">
            <View style={styles.categoryBadge} className="bg-purple-100 px-3 py-1 rounded-full self-start mb-3">
              <Text style={styles.categoryText} className="text-purple-700 text-sm font-medium">
                {event.category}
              </Text>
            </View>
            
            <Text style={styles.title} className="text-2xl font-bold text-gray-900 mb-2">
              {event.title}
            </Text>
            
            <Text style={styles.organizer} className="text-gray-600 mb-4">
              Hosted by {event.organizer}
            </Text>
          </View>

          {/* Key Details */}
          <View style={styles.keyDetails} className="mb-6">
            <View style={styles.detailRow} className="flex-row items-center mb-3">
              <Text style={styles.detailIcon} className="text-xl mr-3">📅</Text>
              <View>
                <Text style={styles.detailLabel} className="text-gray-600 text-sm">Date & Time</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">
                  {event.date} • {event.startTime} - {event.endTime}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow} className="flex-row items-center mb-3">
              <Text style={styles.detailIcon} className="text-xl mr-3">📍</Text>
              <View className="flex-1">
                <Text style={styles.detailLabel} className="text-gray-600 text-sm">Location</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">
                  {event.venue}
                </Text>
                <Text style={styles.detailSubtext} className="text-gray-500 text-sm">
                  {event.address}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow} className="flex-row items-center mb-3">
              <Text style={styles.detailIcon} className="text-xl mr-3">💰</Text>
              <View>
                <Text style={styles.detailLabel} className="text-gray-600 text-sm">Price</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">
                  {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow} className="flex-row items-center mb-3">
              <Text style={styles.detailIcon} className="text-xl mr-3">👥</Text>
              <View>
                <Text style={styles.detailLabel} className="text-gray-600 text-sm">Attendance</Text>
                <Text style={styles.detailValue} className="text-gray-900 font-medium">
                  {event.attendeesCount} of {event.capacity} attending
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              About This Event
            </Text>
            <Text style={styles.description} className="text-gray-700 leading-6">
              {event.description}
            </Text>
          </View>

          {/* Event Requirements */}
          {event.requirements && event.requirements.length > 0 && (
            <View style={styles.requirementsSection} className="mb-6">
              <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
                Requirements
              </Text>
              <View style={styles.requirementsList}>
                {event.requirements.map((requirement, index) => (
                  <View key={index} style={styles.requirementItem} className="flex-row items-center mb-2">
                    <Text style={styles.requirementIcon} className="text-purple-600 mr-2">•</Text>
                    <Text style={styles.requirementText} className="text-gray-700">{requirement}</Text>
                  </View>
                ))}
                {event.ageRestriction && (
                  <View style={styles.requirementItem} className="flex-row items-center mb-2">
                    <Text style={styles.requirementIcon} className="text-purple-600 mr-2">•</Text>
                    <Text style={styles.requirementText} className="text-gray-700">
                      Age Restriction: {event.ageRestriction}
                    </Text>
                  </View>
                )}
                {event.dressCode && (
                  <View style={styles.requirementItem} className="flex-row items-center mb-2">
                    <Text style={styles.requirementIcon} className="text-purple-600 mr-2">•</Text>
                    <Text style={styles.requirementText} className="text-gray-700">
                      Dress Code: {event.dressCode}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Contact Section */}
          <View style={styles.contactSection} className="mb-6">
            <Text style={styles.sectionTitle} className="text-lg font-semibold text-gray-900 mb-3">
              Contact Organizer
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              className="bg-gray-50 p-4 rounded-lg flex-row justify-between items-center"
              onPress={handleContactOrganizer}
            >
              <View>
                <Text style={styles.contactName} className="text-gray-900 font-medium">{event.organizer}</Text>
                <Text style={styles.contactInfo} className="text-gray-600 text-sm">Tap to message</Text>
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
            style={[styles.rsvpButton, isAttending && styles.attendingButton]}
            className={`flex-2 py-3 rounded-lg ${isAttending ? 'bg-green-600' : 'bg-purple-600'}`}
            onPress={handleRSVP}
          >
            <Text style={styles.rsvpButtonText} className="text-center text-white font-medium">
              {isAttending ? 'Attending ✓' : 'RSVP'}
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
  imageContainer: {
    height: 256,
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 50,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  categoryBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  organizer: {
    color: '#6b7280',
    marginBottom: 16,
  },
  keyDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  detailValue: {
    color: '#111827',
    fontWeight: '500',
  },
  detailSubtext: {
    color: '#9ca3af',
    fontSize: 14,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    color: '#374151',
    lineHeight: 24,
  },
  requirementsSection: {
    marginBottom: 24,
  },
  requirementsList: {},
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    color: '#7c3aed',
    marginRight: 8,
  },
  requirementText: {
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
  rsvpButton: {
    flex: 2,
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 8,
  },
  attendingButton: {
    backgroundColor: '#059669',
  },
  rsvpButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
});
