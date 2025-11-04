import { Colors } from "@/constants/Colors";
import { Globe, Heart, Lock } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LinkupHeader({ linkup, isBookmarked, onBookmark }) {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: linkup.imageUri }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      {/* Bookmark Button Overlay */}
      <TouchableOpacity style={styles.bookmarkButton} onPress={onBookmark}>
        <Heart
          size={24}
          color={Colors.white}
          fill={isBookmarked ? Colors.emerald : "transparent"}
        />
      </TouchableOpacity>

      {/* Privacy Badge Overlay */}
      <View style={styles.privacyBadge}>
        {linkup.privacy === "private" ? (
          <Lock size={16} color={Colors.white} />
        ) : (
          <Globe size={16} color={Colors.white} />
        )}
        <Text style={styles.privacyText}>
          {linkup.privacy === "private" ? "Private Group" : "Public Group"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 220,
    width: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  bookmarkButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  privacyText: {
    color: Colors.white,
    marginLeft: 6,
    fontFamily: "Sora-Medium",
    fontSize: 14,
  },
});
