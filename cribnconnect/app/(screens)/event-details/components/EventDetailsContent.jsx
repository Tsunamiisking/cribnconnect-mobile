import { Colors } from '@/constants/Colors';
import {
  Calendar,
  MapPin,
  Star,
  Ticket,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const EventDetailsContent = ({
  event,
  eventCategoryIcons,
  formatDate,
  formatPrice,
  handleContactOrganizer,
}) => {
  const EventTypeIcon = eventCategoryIcons[event.eventType];
  const minPrice =
    event.ticketTypes?.length > 0
      ? Math.min(
          ...event.ticketTypes
            .map((t) => parseFloat(t.price) || 0)
            .filter((p) => p > 0)
        )
      : 0;

  return (
    <View style={styles.infoSection}>
      {/* Title and Category */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.categoryContainer}>
            {EventTypeIcon && (
              <EventTypeIcon size={20} color={Colors.primary} />
            )}
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>
        <Text style={styles.eventType}>{event.eventType}</Text>
      </View>

      {/* Event Details */}
      <View style={styles.detailsSection}>
        {/* Date & Time */}
        <View style={styles.detailRow}>
          <Calendar size={20} color={Colors.gray600} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            <Text style={styles.detailSubtext}>
              {event.time} - {event.endTime}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.detailRow}>
          <MapPin size={20} color={Colors.gray600} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{event.location.venue}</Text>
            <Text style={styles.detailSubtext}>
              {event.location.street}, {event.location.city},{' '}
              {event.location.state}
            </Text>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.detailRow}>
          <Users size={20} color={Colors.gray600} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Attendance</Text>
            <Text style={styles.detailValue}>
              {Array.isArray(event.attendees)
                ? event.attendees.length
                : event.attendees || 0}{' '}
              attending
            </Text>
            <Text style={styles.detailSubtext}>
              {event.capacity} capacity •{' '}
              {event.capacity -
                (Array.isArray(event.attendees)
                  ? event.attendees.length
                  : event.attendees || 0)}{' '}
              spots left
            </Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.detailRow}>
          <Ticket size={20} color={Colors.gray600} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>
              {event.isFree
                ? 'Free Event'
                : `From ${formatPrice(minPrice.toString())}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      {event.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.black,
    flex: 1,
    marginRight: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  eventType: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  detailsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.gray600,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 2,
  },
  detailSubtext: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
  },
});

export default EventDetailsContent;
