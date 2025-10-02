import useHostingStore from "@/stores/hostingStore";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { CloudUpload, Play, X } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Step8({ styles }) {
  const { apartmentData, addMediaToApartment, removeMediaFromApartment } = useHostingStore();
  const [mediaFiles, setMediaFiles] = useState(apartmentData.media || []);
  const [isSelecting, setIsSelecting] = useState(false);

const generateThumbnail = async (videoUri) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1500, // get frame at 1.5s
    });
    return uri;
  } catch (e) {
    console.warn("Thumbnail generation failed:", e);
    return null;
  }
};

const handleMediaSelection = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    alert("Permission required!");
    return;
  }

  setIsSelecting(true);

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      for (const asset of result.assets) {
        let mediaItem;

        if (asset.type === "video") {
          // Generate thumbnail for local display
          const thumbnail = await generateThumbnail(asset.uri);

          mediaItem = {
            // For backend submission (will be populated after upload)
            public_id: null, // Will be set by Cloudinary
            url: null, // Will be set by Cloudinary
            resource_type: "video",
            thumbnail_url: null, // Will be set by Cloudinary
            width: asset.width || null,
            height: asset.height || null,
            format: asset.fileName?.split('.').pop() || "mp4",
            size: asset.fileSize || 0,
            
            // For local display and upload
            localUri: asset.uri,
            localThumbnail: thumbnail,
            filename: asset.fileName || `video_${Date.now()}.mp4`,
            duration: asset.duration || 0,
            mimeType: "video/mp4"
          };
        } else {
          mediaItem = {
            // For backend submission (will be populated after upload)
            public_id: null, // Will be set by Cloudinary
            url: null, // Will be set by Cloudinary
            resource_type: "image",
            thumbnail_url: null, // Will be set by Cloudinary for smaller variants
            width: asset.width || null,
            height: asset.height || null,
            format: asset.fileName?.split('.').pop() || "jpg",
            size: asset.fileSize || 0,
            
            // For local display and upload
            localUri: asset.uri,
            filename: asset.fileName || `image_${Date.now()}.jpg`,
            mimeType: "image/jpeg"
          };
        }

        // Add to store (this will be sent to backend later)
        addMediaToApartment(mediaItem);
        
        // Update local state for display
        setMediaFiles(prev => [...prev, mediaItem]);
      }
    }
  } catch (error) {
    console.error('Media selection failed:', error);
    alert(`Selection failed: ${error.message}`);
  } finally {
    setIsSelecting(false);
  }
};

const removeMedia = (index) => {
  removeMediaFromApartment(index);
  setMediaFiles(prev => prev.filter((_, i) => i !== index));
};

const renderMediaItem = ({ item, index }) => (
  <View
    style={{
      width: (Dimensions.get("window").width - 72) / 2,
      height: 160,
      margin: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: styles.borderColor || "#E5E7EB",
      overflow: "hidden",
      position: "relative",
    }}
  >
    {item.resource_type === "video" ? (
      <Image
        source={{ uri: item.localThumbnail || item.localUri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    ) : (
      <Image
        source={{ uri: item.localUri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    )}

    {item.resource_type === "video" && (
      <View
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          backgroundColor: "rgba(0,0,0,0.75)",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 12, marginRight: 4 }}>
          Video
        </Text>
        <Play size={14} color="white" />
      </View>
    )}

    <TouchableOpacity
      onPress={() => removeMedia(index)}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.75)",
        borderRadius: 12,
        padding: 4,
      }}
    >
      <X size={16} color="white" />
    </TouchableOpacity>
  </View>
);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Select Pictures / Videos</Text>
        <Text style={styles.sectionSubtitle}>
          Choose images or videos to include with your listing
        </Text>

        <View style={styles.uploadContainer}>
          <Text
            style={[
              styles.labelText,
              { marginBottom: 12, textAlign: "center" },
            ]}
          >
            Select images or videos of your available space
          </Text>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleMediaSelection}
            disabled={isSelecting}
          >
            <CloudUpload size={32} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: "Sora-Regular",
                marginLeft: 8,
              }}
            >
              {isSelecting ? "Selecting..." : "Select Media"}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.warning}>*Select one video and as many images as possible. Your video will be the cover display of your apartment listing.</Text>
        </View>
        <View
          style={{
            marginVertical: 24,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            height: 24,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 1,
              backgroundColor: "#B0B0B0",
            }}
          />
          <View style={{ backgroundColor: "#fff", paddingHorizontal: 8 }}>
            <Text style={[styles.labelText]}>Selected Items</Text>
          </View>
        </View>

        {mediaFiles.length > 0 && (
          <FlatList
            data={mediaFiles}
            renderItem={renderMediaItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              paddingHorizontal: 6,
            }}
            style={{ marginTop: 16 }}
          />
        )}
      </View>
    </View>
  );
}
