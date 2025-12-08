import { Colors } from '@/constants/Colors';
import { ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import EventHostManagement from './EventHostManagement';

const EventHeader = ({
  isHost,
  isLiked,
  onBack,
  onShare,
  onLikeToggle,
  event,
  onEventUpdate,
  onEventDelete,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.headerButton}>
        <ArrowLeft size={24} color={Colors.black} />
      </TouchableOpacity>
      <View style={styles.headerActions}>
        {isHost ? (
          <EventHostManagement
            event={event}
            isHost={isHost}
            onEventUpdate={onEventUpdate}
            onEventDelete={onEventDelete}
          />
        ) : (
          <>
            <TouchableOpacity onPress={onShare} style={styles.headerButton}>
              <Share2 size={24} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLikeToggle} style={styles.headerButton}>
              <Heart
                size={24}
                color={isLiked ? Colors.primary : Colors.black}
                fill={isLiked ? Colors.primary : 'transparent'}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default EventHeader;
