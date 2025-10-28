import { Colors } from '@/constants/Colors';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pause, Play } from "lucide-react-native";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function VideoPlayer({ videoUrl, style }) {
  const player = useVideoPlayer(videoUrl, player => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={[styles.videoContainer, style]}>
      <VideoView 
        style={styles.videoView} 
        player={player} 
        allowsFullscreen
        allowsPictureInPicture
      />
      <TouchableOpacity
        style={styles.videoOverlay}
        onPress={() => {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }}
      >
        <View style={styles.playButton}>
          {isPlaying ? (
            <Pause size={24} color={Colors.white} />
          ) : (
            <Play size={24} color={Colors.white} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoView: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});