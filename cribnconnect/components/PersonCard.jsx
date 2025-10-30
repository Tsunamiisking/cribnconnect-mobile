import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import {
  Heart,
  MapPin,
  MessageCircle
} from "lucide-react-native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function PersonCard({ person, onPress }) {
  // We now have just one image per person
  const handleImagePress = () => {
    if (onPress) {
      onPress(person);
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
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={handleImagePress}
      >
        <Image 
          source={{ uri: person.image }} 
          style={styles.personImage}
          defaultSource={require('@/assets/images/default-avatar.jpg')}
        />

        <View style={styles.distanceOverlay}>
          <MapPin size={14} color={Colors.white} />
          <Text style={styles.distanceText}>{person.distance}</Text>
        </View>
      </TouchableOpacity>

      {/* Person Info */}
      <View style={styles.personInfo}>
        <View style={styles.personHeader}>
          <Text style={styles.personName}>{person.username}</Text>
        </View>

        <Text style={styles.personBio} numberOfLines={2}>{person.bio}</Text>

        {/* Interests */}
        <View style={styles.interestsContainer}>
          {person.interests?.slice(0, 3).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          {person.interests?.length > 3 && (
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
  distanceOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  distanceText: {
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