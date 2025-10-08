import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    MapPin,
    MessageCircle,
} from "lucide-react-native";
import { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function PersonCard({ person }) {
  const [localImageIndex, setLocalImageIndex] = useState(0);
  const currentImage = person.images[localImageIndex] || person.images[0];

  const handleImageSwipe = (direction) => {
    if (direction === 'left' && localImageIndex < person.images.length - 1) {
      setLocalImageIndex(prev => prev + 1);
    } else if (direction === 'right' && localImageIndex > 0) {
      setLocalImageIndex(prev => prev - 1);
    }
  };

  const handleLike = () => {
    console.log("Liked:", person.name);
    // TODO: Add like functionality
  };

  const handleMessage = () => {
    console.log("Message:", person.name);
    router.push(`/(screens)/chat/${person.id}`);
  };

  return (
    <View style={styles.personCard}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: currentImage }} style={styles.personImage} />
        
        {/* Image Navigation Overlays */}
        {person.images.length > 1 && (
          <>
            {localImageIndex > 0 && (
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.leftNavButton]}
                onPress={() => handleImageSwipe('right')}
              >
                <ChevronLeft size={24} color={Colors.white} />
              </TouchableOpacity>
            )}
            
            {localImageIndex < person.images.length - 1 && (
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.rightNavButton]}
                onPress={() => handleImageSwipe('left')}
              >
                <ChevronRight size={24} color={Colors.white} />
              </TouchableOpacity>
            )}

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {person.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === localImageIndex && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {/* Online Status */}
        <View style={styles.onlineStatus}>
          <View style={[
            styles.onlineIndicator, 
            person.isOnline && styles.onlineIndicatorActive
          ]} />
          <Text style={styles.lastSeenText}>{person.lastSeen}</Text>
        </View>
      </View>

      {/* Person Info */}
      <View style={styles.personInfo}>
        <View style={styles.personHeader}>
          <Text style={styles.personName}>
            {person.name}, {person.age}
          </Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.gray500} />
            <Text style={styles.distanceText}>{person.distance}</Text>
          </View>
        </View>

        <Text style={styles.personBio}>{person.bio}</Text>

        {/* Interests */}
        <View style={styles.interestsContainer}>
          {person.interests.slice(0, 3).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          {person.interests.length > 3 && (
            <Text style={styles.moreInterests}>+{person.interests.length - 3} more</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Heart size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <MessageCircle size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  personCard: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    borderRadius: 20,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    height: 400,
    position: 'relative',
    backgroundColor: Colors.gray100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  personImage: {
    width: '100%',
    height: '100%',
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  leftNavButton: {
    left: 16,
  },
  rightNavButton: {
    right: 16,
  },
  imageIndicators: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeIndicator: {
    backgroundColor: Colors.white,
  },
  onlineStatus: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray400,
  },
  onlineIndicatorActive: {
    backgroundColor: Colors.emerald,
  },
  lastSeenText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Regular',
  },
  personInfo: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  personName: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.gray900,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
  },
  personBio: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  moreInterests: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  messageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});