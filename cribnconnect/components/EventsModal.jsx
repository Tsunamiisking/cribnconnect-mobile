import { Colors } from '@/constants/Colors';
import { X } from 'lucide-react-native';
import React from 'react';
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EventCard from './EventCard';

export default function EventsModal({ 
  visible, 
  onClose, 
  title,
  events = [],
  onEventPress
}) {
  const renderEventCard = ({ item, index }) => {
    return (
      <View style={[
        styles.eventCardContainer,
        index % 2 === 0 ? styles.leftCard : styles.rightCard
      ]}>
        <EventCard
          imageUri={item.imageUri}
          title={item.title}
          pricePerTicket={item.pricePerTicket}
          location={item.location}
          schedule={item.schedule}
          timeOfDay={item.timeOfDay}
          liked={false}
          onLikeToggle={(liked) => {
            console.log("Event saved:", item.id, liked);
          }}
          onPress={() => onEventPress(item.id)}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragIndicator} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <X size={24} color={Colors.gray600} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Events Grid */}
          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No events available</Text>
              </View>
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  eventCardContainer: {
    flex: 0.50,
    marginVertical: 8,
  },
  leftCard: {
    marginRight: 4,
  },
  rightCard: {
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
  },
});
