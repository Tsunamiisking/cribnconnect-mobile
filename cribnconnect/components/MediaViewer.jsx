import { Colors } from '@/constants/Colors';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import VideoPlayer from './VideoPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MediaViewer({ 
  visible, 
  onClose, 
  media = [], 
  initialIndex = 0 
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset currentIndex when initialIndex changes or modal becomes visible
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, visible]);

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (currentIndex >= media.length) {
      setCurrentIndex(Math.max(0, media.length - 1));
    }
  }, [media.length]);

  // Guard against empty media array
  if (!media.length) {
    visible && onClose?.();
    return null;
  }

  const currentItem = media[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <X size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.mediaContainer}>
          {currentItem.type === 'video' ? (
            <VideoPlayer 
              videoUrl={currentItem.url} 
              style={styles.media} 
            />
          ) : (
            <Image
              source={{ uri: currentItem.url }}
              style={styles.media}
              resizeMode="contain"
            />
          )}
        </View>

        {media.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.leftButton]} 
                onPress={handlePrevious}
              >
                <ChevronLeft size={32} color={Colors.white} />
              </TouchableOpacity>
            )}

            {currentIndex < media.length - 1 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.rightButton]} 
                onPress={handleNext}
              >
                <ChevronRight size={32} color={Colors.white} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
});