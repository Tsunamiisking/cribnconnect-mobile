import SearchInput from "@/components/SearchInput";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import {
    Calendar,
    DollarSign,
    Eye,
    MapPin,
    Plus,
    TrendingUp,
    Users
} from "lucide-react-native";
import React from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const EventCard = ({ event }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return Colors.primary;
      case 'completed': return Colors.success;
      case 'cancelled': return Colors.error;
      case 'draft': return Colors.warning;
      default: return Colors.gray500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleCardPress = () => {
    router.push(`/(screens)/event-details/${event.id}`);
  };

  const handleEditPress = () => {
    router.push(`/(hosting)/edit-event/${event.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.eventCard} 
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.images[0] }} style={styles.eventImage} />
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                {getStatusText(event.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.eventLocationRow}>
            <MapPin size={14} color={Colors.gray600} />
            <Text style={styles.eventLocation} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.detailText}>
              {formatDate(event.date)} at {formatTime(event.time)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Users size={16} color={Colors.gray600} />
            <Text style={styles.detailText}>
              {event.attendees}/{event.capacity} attendees
            </Text>
          </View>
        </View>

        <View style={styles.eventStats}>
          <View style={styles.statItem}>
            {/* <DollarSign size={16} color={Colors.primary} /> */}
            <Text style={styles.statValue}>
              {event.price === "Free" ? "Free" : event.price}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <TrendingUp size={16} color={Colors.success} />
            <Text style={styles.statText}>Revenue: {event.revenue}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>
              {event.category} • {event.eventType}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CreateEventButton = () => (
  <TouchableOpacity 
    style={styles.createButton}
    onPress={() => router.push("/(hosting)/add-event")}
    activeOpacity={0.8}
  >
    <View style={styles.createButtonContent}>
      <Plus size={24} color={Colors.primary} />
      <Text style={styles.createButtonText}>Create New Event</Text>
      <Text style={styles.createButtonSubtext}>Host a party, meetup, or gathering</Text>
    </View>
  </TouchableOpacity>
);

const NoEvents = () => (
  <View style={styles.noResultsContainer}>
    <View style={styles.noResultsIconContainer}>
      <Calendar size={48} color={Colors.gray400} />
    </View>
    <Text style={styles.noResultsTitle}>No Events Found</Text>
    <Text style={styles.noResultsText}>
      You haven't hosted any events yet. Create your first event today!
    </Text>
    <CreateEventButton />
  </View>
);

export default function EventTab({
  filteredEvents,
  searchQuery,
  onSearchChange,
  onClearSearch,
  refreshing,
  onRefresh,
}) {
  const renderEvent = ({ item }) => (
    <EventCard event={item} />
  );

  const getTotalRevenue = () => {
    return filteredEvents.reduce((sum, event) => {
      const revenue = event.revenue.replace(/[₦,]/g, '');
      return sum + parseInt(revenue || 0);
    }, 0);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <SearchInput
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search your events..."
        onClear={onClearSearch}
      />
      
      {filteredEvents.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{filteredEvents.length}</Text>
              <Text style={styles.summaryLabel}>Events</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {filteredEvents.filter(e => e.status === 'upcoming').length}
              </Text>
              <Text style={styles.summaryLabel}>Upcoming</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {filteredEvents.reduce((sum, e) => sum + e.attendees, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Total Attendees</Text>
            </View>
          </View>
          <View style={styles.revenueRow}>
            <TrendingUp size={20} color={Colors.success} />
            <Text style={styles.revenueText}>
              Total Revenue: ₦{getTotalRevenue().toLocaleString()}
            </Text>
          </View>
        </View>
      )}
      
      <CreateEventButton />
    </View>
  );

  return (
    <View style={styles.container}>
      {filteredEvents.length === 0 && searchQuery === "" ? (
        <View style={styles.emptyStateContainer}>
          <NoEvents />
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            searchQuery !== "" ? (
              <View style={styles.noSearchResultsContainer}>
                <Eye size={48} color={Colors.gray400} />
                <Text style={styles.noSearchResultsTitle}>No Results Found</Text>
                <Text style={styles.noSearchResultsText}>
                  Try adjusting your search terms
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    marginVertical: 16,
  },
  summaryContainer: {
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  revenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  revenueText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.success,
    marginLeft: 8,
  },
  createButton: {
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    borderStyle: 'dashed',
  },
  createButtonContent: {
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginTop: 8,
  },
  createButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  eventLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginLeft: 4,
    flex: 1,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    marginLeft: 8,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginLeft: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryRow: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.gray600,
    textTransform: 'capitalize',
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 20,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  noSearchResultsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noSearchResultsTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noSearchResultsText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    textAlign: 'center',
  },
});