import MediaViewer from "@/components/MediaViewer";
import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { pickImages, pickVideo } from "@/utils/mediaUtils";
import { Camera, ImagePlus, Play, X } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Step8({ styles }) {
  const { apartmentData, addMediaToApartment, removeMediaFromApartment } = useHostingStore();
  const [uploading, setUploading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const mediaFiles = apartmentData.media || [];
  const images = mediaFiles.filter(m => m.resource_type === "image");
  const video = mediaFiles.find(m => m.resource_type === "video");

  const handleAddImages = async () => {
    setUploading(true);
    try {
      const selectedImages = await pickImages(images.length, 10); // Max 10 images
      
      if (selectedImages && selectedImages.length > 0) {
        for (const img of selectedImages) {
          const mediaItem = {
            public_id: null,
            url: null,
            resource_type: "image",
            thumbnail_url: null,
            width: null,
            height: null,
            format: "jpg",
            size: 0,
            localUri: img.url,
            filename: `image_${Date.now()}.jpg`,
            mimeType: "image/jpeg"
          };
          addMediaToApartment(mediaItem);
        }
      }
    } catch (error) {
      console.error('Error adding images:', error);
      Alert.alert('Error', 'Failed to add images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddVideo = async () => {
    if (video) {
      Alert.alert(
        "Video Already Added",
        "You can only add one video. Remove the existing video first."
      );
      return;
    }

    setUploading(true);
    try {
      const selectedVideo = await pickVideo();
      
      if (selectedVideo) {
        const mediaItem = {
          public_id: null,
          url: null,
          resource_type: "video",
          thumbnail_url: null,
          width: null,
          height: null,
          format: "mp4",
          size: 0,
          localUri: selectedVideo.url,
          localThumbnail: selectedVideo.thumbnail,
          filename: `video_${Date.now()}.mp4`,
          duration: 0,
          mimeType: "video/mp4"
        };
        addMediaToApartment(mediaItem);
      }
    } catch (error) {
      console.error('Error adding video:', error);
      Alert.alert('Error', 'Failed to add video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = (index) => {
    Alert.alert(
      "Remove Media",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            // Close viewer if it's open
            if (viewerVisible) {
              setViewerVisible(false);
            }
            removeMediaFromApartment(index);
          }
        }
      ]
    );
  };

  const handleImagePress = (index) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  // Prepare media for viewer (images only)
  const viewerMedia = images.map(img => ({
    url: img.localUri,
    type: 'image'
  }));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={styles.stepContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>Add Photos & Video</Text>
        <Text style={styles.sectionSubtitle}>
          Showcase your space with high-quality photos and a video tour
        </Text>

        {/* Video Section */}
        <View style={localStyles.section}>
          <Text style={styles.label}>Video Tour (Optional)</Text>
          <Text style={styles.typeOptionDescription}>
            Add a video to give potential guests a virtual tour. This will be the cover display.
          </Text>

          {video ? (
            <View style={localStyles.videoWrapper}>
              <Image
                source={{ uri: video.localThumbnail || video.localUri }}
                style={localStyles.videoPreview}
                resizeMode="cover"
              />
              <View style={localStyles.videoIndicator}>
                <Play size={14} color="white" />
                <Text style={localStyles.videoIndicatorText}>Video</Text>
              </View>
              <TouchableOpacity
                style={localStyles.removeButton}
                onPress={() => handleRemoveMedia(mediaFiles.findIndex(m => m === video))}
              >
                <X size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={localStyles.addVideoButton}
              onPress={handleAddVideo}
              disabled={uploading}
            >
              <Camera size={32} color={Colors.primary} />
              <Text style={localStyles.addButtonText}>
                {uploading ? "Adding Video..." : "Add Video"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Photos Section */}
        <View style={localStyles.section}>
          <Text style={styles.label}>Photos (Required)</Text>
          <Text style={styles.typeOptionDescription}>
            Add up to 10 high-quality photos of your space. The first photo will be the main listing image.
          </Text>

          <View style={localStyles.imagesContainer}>
            {images.map((img, index) => (
              <TouchableOpacity
                key={`image-${index}`}
                style={localStyles.imageWrapper}
                onPress={() => handleImagePress(index)}
              >
                <Image
                  source={{ uri: img.localUri }}
                  style={localStyles.imagePreview}
                  resizeMode="cover"
                />
                {index === 0 && (
                  <View style={localStyles.mainBadge}>
                    <Text style={localStyles.mainBadgeText}>Main</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={localStyles.removeButton}
                  onPress={() => handleRemoveMedia(mediaFiles.findIndex(m => m === img))}
                >
                  <X size={16} color={Colors.white} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {images.length < 10 && (
              <TouchableOpacity
                style={localStyles.addImageButton}
                onPress={handleAddImages}
                disabled={uploading}
              >
                <ImagePlus size={32} color={Colors.primary} />
                <Text style={localStyles.addButtonText}>
                  {uploading ? "Adding..." : "Add Photos"}
                </Text>
                {images.length > 0 && (
                  <Text style={localStyles.countText}>
                    {images.length}/10
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tips Section */}
        <View style={localStyles.tipsContainer}>
          <Text style={styles.label}>📸 Photography Tips</Text>
          <View style={localStyles.tipsList}>
            <Text style={localStyles.tipText}>• Use natural lighting when possible</Text>
            <Text style={localStyles.tipText}>• Show all rooms and key features</Text>
            <Text style={localStyles.tipText}>• Clean and stage your space before shooting</Text>
            <Text style={localStyles.tipText}>• Include wide-angle shots and detail shots</Text>
            <Text style={localStyles.tipText}>• Tap any photo to view full size</Text>
          </View>
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      <MediaViewer
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        media={viewerMedia}
        initialIndex={viewerIndex}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginTop: 12,
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  videoIndicatorText: {
    color: "white",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "Sora-Regular",
  },
  addVideoButton: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  imageWrapper: {
    width: "30%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  mainBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mainBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: "Sora-Medium",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageButton: {
    width: "30%",
    aspectRatio: 3 / 4,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
    textAlign: "center",
  },
  countText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  tipsContainer: {
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
  },
  tipsList: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
    marginBottom: 6,
    lineHeight: 20,
  },
});
