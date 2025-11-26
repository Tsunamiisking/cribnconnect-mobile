import { Colors } from '@/constants/Colors';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ChevronLeft, ChevronRight, Grid3X3, Play, X, ZoomIn } from 'lucide-react-native';
import React, { useRef, useState, useMemo } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Separate component for video to properly use useVideoPlayer hook
const VideoPlayer = ({ item, isPlaying, onTogglePlay }) => {
  const player = useVideoPlayer(item.localUri || item.url, (player) => {
    player.loop = true;
    player.muted = false;
  });

  const handlePress = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    onTogglePlay();
  };

  return (
    <TouchableOpacity 
      style={styles.fullScreenVideoContainer}
      onPress={handlePress}
      activeOpacity={1}
    >
      <VideoView
        player={player}
        style={styles.fullScreenVideo}
        contentFit="contain"
        nativeControls={false}
      />
      {!isPlaying && (
        <View style={styles.fullScreenPlayButton}>
          <Play size={40} color={Colors.white} fill={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const MediaCarousel = ({ media }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreenMedia, setShowFullScreenMedia] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);
  
  const fullScreenFlatListRef = useRef(null);
  const mainFlatListRef = useRef(null);

  const openFullScreenMedia = (index) => {
    setFullScreenIndex(index);
    setShowFullScreenMedia(true);
    setTimeout(() => {
      fullScreenFlatListRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    }, 100);
  };

  const openAllPhotos = () => {
    setShowAllPhotos(true);
  };

  const closeFullScreenMedia = () => {
    setPlayingVideoIndex(null);
    setShowFullScreenMedia(false);
  };

  const closeAllPhotos = () => {
    setShowAllPhotos(false);
  };

  const goToPrevious = () => {
    if (fullScreenIndex > 0 && fullScreenFlatListRef.current) {
      const newIndex = fullScreenIndex - 1;
      setFullScreenIndex(newIndex);
      fullScreenFlatListRef.current.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const goToNext = () => {
    if (fullScreenIndex < media.length - 1 && fullScreenFlatListRef.current) {
      const newIndex = fullScreenIndex + 1;
      setFullScreenIndex(newIndex);
      fullScreenFlatListRef.current.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const getImageAspectRatio = (item) => {
    if (!item.width || !item.height) return 'landscape';
    const ratio = item.width / item.height;
    if (ratio > 1.3) return 'landscape';
    if (ratio < 0.75) return 'portrait';
    return 'square';
  };

  const renderEnhancedMediaItem = ({ item, index }) => {
    const aspectRatio = getImageAspectRatio(item);
    const isPortrait = aspectRatio === 'portrait';
    
    return (
      <TouchableOpacity 
        style={[styles.mediaContainer, isPortrait && styles.portraitMediaContainer]}
        onPress={() => openFullScreenMedia(index)}
        activeOpacity={0.9}
      >
        {item.resource_type === 'video' ? (
          <View style={styles.videoContainer}>
            <Image 
              source={{ uri: item.localThumbnail || item.localUri }} 
              style={[
                styles.mediaImage,
                isPortrait ? styles.portraitImage : styles.landscapeImage
              ]}
              resizeMode={isPortrait ? "contain" : "cover"}
            />
            <View style={styles.playButton}>
              <Play size={24} color={Colors.white} />
            </View>
            <View style={styles.videoLabel}>
              <Play size={16} color={Colors.white} />
              <Text style={styles.videoLabelText}>Video</Text>
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.localUri || item.url }} 
              style={[
                styles.mediaImage,
                isPortrait ? styles.portraitImage : styles.landscapeImage
              ]}
              resizeMode={isPortrait ? "contain" : "cover"}
            />
            <View style={styles.zoomIndicator}>
              <ZoomIn size={16} color={Colors.white} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => {
        closeAllPhotos();
        openFullScreenMedia(index);
      }}
    >
      <Image 
        source={{ uri: item.localThumbnail || item.localUri || item.url }} 
        style={styles.gridImage}
        resizeMode="cover"
      />
      {item.resource_type === 'video' && (
        <View style={styles.gridVideoIndicator}>
          <Play size={16} color={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFullScreenMedia = ({ item, index }) => {
    const isVideo = item.resource_type === 'video';
    const isPlaying = playingVideoIndex === index;

    const handleTogglePlay = () => {
      if (isPlaying) {
        setPlayingVideoIndex(null);
      } else {
        // Pause any other video first
        setPlayingVideoIndex(index);
      }
    };

    return (
      <View style={styles.fullScreenContainer} key={`fullscreen-${index}`}>
        {isVideo ? (
          <VideoPlayer
            item={item}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
          />
        ) : (
          <Image 
            source={{ uri: item.localUri || item.url }} 
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.mediaSection}>
        <FlatList
          data={media}
          renderItem={renderEnhancedMediaItem}
          keyExtractor={(item, index) => index.toString()}
          ref={mainFlatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentImageIndex(index);
          }}
        />
        {media.length > 1 && (
          <View style={styles.mediaIndicator}>
            <Text style={styles.mediaIndicatorText}>
              {currentImageIndex + 1} / {media.length}
            </Text>
          </View>
        )}
        {media.length > 1 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={openAllPhotos}
          >
            <Grid3X3 size={16} color={Colors.white} />
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Full Screen Modal */}
      <Modal
        visible={showFullScreenMedia}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFullScreenMedia}
        onShow={() => {
          setTimeout(() => {
            fullScreenFlatListRef.current?.scrollToIndex({
              index: fullScreenIndex,
              animated: false,
            });
          }, 100);
        }}
      >
        <View style={styles.fullScreenModal}>
          <StatusBar hidden />
          
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity 
              style={styles.fullScreenCloseButton}
              onPress={closeFullScreenMedia}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.fullScreenCounter}>
              {fullScreenIndex + 1} / {media.length}
            </Text>
          </View>

          <FlatList
            data={media}
            renderItem={renderFullScreenMedia}
            keyExtractor={(item, index) => `fullscreen-${index}`}
            ref={fullScreenFlatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={fullScreenIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              // Reset playing state when scrolling to another item
              if (playingVideoIndex !== null && playingVideoIndex !== index) {
                setPlayingVideoIndex(null);
              }
              setFullScreenIndex(index);
            }}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                fullScreenFlatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                });
              }, 100);
            }}
            removeClippedSubviews={false}
            maxToRenderPerBatch={3}
            windowSize={3}
            initialNumToRender={3}
          />

          {media.length > 1 && (
            <>
              {fullScreenIndex > 0 && (
                <TouchableOpacity 
                  style={[styles.fullScreenNavButton, styles.fullScreenPrevButton]}
                  onPress={goToPrevious}
                >
                  <ChevronLeft size={32} color={Colors.white} />
                </TouchableOpacity>
              )}
              
              {fullScreenIndex < media.length - 1 && (
                <TouchableOpacity 
                  style={[styles.fullScreenNavButton, styles.fullScreenNextButton]}
                  onPress={goToNext}
                >
                  <ChevronRight size={32} color={Colors.white} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Modal>

      {/* All Photos Grid Modal */}
      <Modal
        visible={showAllPhotos}
        animationType="slide"
        onRequestClose={closeAllPhotos}
      >
        <SafeAreaView style={styles.allPhotosModal}>
          <View style={styles.allPhotosHeader}>
            <TouchableOpacity 
              style={styles.allPhotosCloseButton}
              onPress={closeAllPhotos}
            >
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.allPhotosTitle}>
              All Photos ({media.length})
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            data={media}
            renderItem={renderGridItem}
            keyExtractor={(item, index) => `grid-${index}`}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mediaSection: {
    position: 'relative',
  },
  mediaContainer: {
    width: screenWidth,
    height: 300,
  },
  portraitMediaContainer: {
    height: 300,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  landscapeImage: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  videoLabelText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  zoomIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 8,
  },
  mediaIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaIndicatorText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  viewAllButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  viewAllText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  fullScreenHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullScreenCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCounter: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Sora-Medium',
  },
  fullScreenContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
  fullScreenVideoContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  fullScreenVideo: {
    width: screenWidth,
    height: screenHeight,
  },
  fullScreenPlayButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenNavButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  fullScreenPrevButton: {
    left: 20,
  },
  fullScreenNextButton: {
    right: 20,
  },
  allPhotosModal: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  allPhotosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  allPhotosCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allPhotosTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
  },
  gridContainer: {
    padding: 16,
  },
  gridItem: {
    width: (screenWidth - 48) / 2,
    height: 150,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridVideoIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 4,
    borderRadius: 6,
  },
});

export default MediaCarousel;
