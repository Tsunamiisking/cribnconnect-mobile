import { Colors } from "@/constants/Colors";
import { Video } from "expo-av";
import { Play } from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProfileView({ 
  profile, 
  isEditable = false,
  isCreating = false,
  onEditPress,
  onImagePress,
  onBioPress,
  onInterestsPress
}) {
  if (!profile) {
    return null;
  }

  const images = profile.images || [];
  
  // Placeholder components for creation mode
  const EditIndicator = ({ onPress, children, placeholder }) => {
    if (!isCreating) return children;
    
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={[
          styles.editIndicator,
          !children && styles.emptyEditIndicator
        ]}
      >
        {children || (
          <Text style={styles.placeholderText}>{placeholder}</Text>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView>
            <ScrollView 
      className="flex-1 bg-white" 
      showsVerticalScrollIndicator={false}
    >
      {/* Media Gallery */}
      <EditIndicator
        onPress={onImagePress}
        placeholder="Tap to add photos or videos"
      />
        <View style={styles.mediaGallery}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
          >
            {images.length > 0 ? (
              images.map((image, index) => (
                <Image
                  key={`image-${index}`}
                  source={{ uri: image }}
                  style={styles.mediaItem}
                  resizeMode="cover"
                />
              ))
            ) : (
              <View style={[styles.mediaItem, styles.emptyMediaItem]}>
                <Text style={styles.emptyMediaText}>No media added</Text>
              </View>
            )}

          {profile.video && (
            <View style={styles.mediaItem}>
              <Video
                source={{ uri: profile.video.uri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                isLooping
                shouldPlay={false}
                isMuted={true}
              />
              <View style={styles.playButton}>
                <Play color="white" size={24} />
              </View>
            </View>
          )}
        </ScrollView>
        
        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[styles.dot, { backgroundColor: Colors.white }]}
            />
          ))}
          {profile.video && (
            <View
              style={[styles.dot, { backgroundColor: Colors.white }]}
            />
          )}
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.username}>{profile.username || 'User'}</Text>
          {isEditable && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEditPress}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Interests */}
        <EditIndicator
          onPress={onInterestsPress}
          placeholder="Add your interests"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))
              ) : isCreating && (
                <View style={[styles.interestTag, styles.emptyInterestTag]}>
                  <Text style={styles.placeholderText}>Add interests</Text>
                </View>
              )}
            </View>
          </View>
        </EditIndicator>

        {/* Bio */}
        <EditIndicator
          onPress={onBioPress}
          placeholder="Tell others about yourself"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            {profile.bio ? (
              <Text style={styles.bioText}>{profile.bio}</Text>
            ) : isCreating && (
              <Text style={styles.placeholderText}>Add a bio</Text>
            )}
          </View>
        </EditIndicator>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  editIndicator: {
    opacity: 1,
  },
  emptyEditIndicator: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.gray500,
    fontSize: 16,
    fontFamily: 'Sora-Regular',
  },
  emptyMediaItem: {
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMediaText: {
    color: Colors.gray500,
    fontSize: 18,
    fontFamily: 'Sora-Medium',
  },
  emptyInterestTag: {
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
  },
  mediaGallery: {
    height: width * 1.2, // Aspect ratio 5:6
    backgroundColor: Colors.gray100,
    position: "relative",
  },
  mediaItem: {
    width: width,
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pageIndicator: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
    opacity: 0.8,
  },
  infoContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Sora-Medium",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
  },
  bioText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    lineHeight: 24,
  },
});