import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Camera, Image as ImageIcon, Play, RefreshCw, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EventImages({ styles }) {
  const { eventData, addMediaToEvent, removeMediaFromEvent, updateMediaInEvent } = useHostingStore();
  const [mediaFiles, setMediaFiles] = useState(eventData.media || []);
  const [isSelecting, setIsSelecting] = useState(false);

  // Check for missing media files on component mount
  useEffect(() => {
    const checkMediaFiles = async () => {
      if (mediaFiles.length > 0) {
        const updatedMedia = mediaFiles.map((media) => {
          if (!media.localUri || media.localUri === "") {
            return { ...media, needsReselection: true };
          }
          return media;
        });
        
        const hasChanges = updatedMedia.some((m, i) => m.needsReselection !== mediaFiles[i].needsReselection);
        if (hasChanges) {
          setMediaFiles(updatedMedia);
        }
      }
    };
    
    checkMediaFiles();
  }, []);

  // Update local state when store changes
  useEffect(() => {
    setMediaFiles(eventData.media || []);
  }, [eventData.media]);

  const generateThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 0,
      });
      return uri;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return null;
    }
  };

  const handleMediaSelection = async () => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to upload photos and videos."
        );
        setIsSelecting(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max for videos
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newMediaFiles = [];

        for (const asset of result.assets) {
          const mediaType = asset.type === "video" ? "video" : "image";
          let thumbnailUri = null;

          if (mediaType === "video") {
            thumbnailUri = await generateThumbnail(asset.uri);
          }

          const mediaFile = {
            localUri: asset.uri,
            resource_type: mediaType,
            localThumbnail: thumbnailUri,
            width: asset.width,
            height: asset.height,
            duration: asset.duration,
            needsReselection: false,
          };

          newMediaFiles.push(mediaFile);
          addMediaToEvent(mediaFile);
        }

        setMediaFiles((prev) => [...prev, ...newMediaFiles]);
      }
    } catch (error) {
      console.error("Error selecting media:", error);
      Alert.alert("Error", "Failed to select media. Please try again.");
    } finally {
      setIsSelecting(false);
    }
  };

  const removeMedia = (index) => {
    removeMediaFromEvent(index);
  };

  const handleReselectMedia = async (index) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to reselect media."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: false,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const mediaType = asset.type === "video" ? "video" : "image";
        let thumbnailUri = null;

        if (mediaType === "video") {
          thumbnailUri = await generateThumbnail(asset.uri);
        }

        const updatedMedia = {
          localUri: asset.uri,
          resource_type: mediaType,
          localThumbnail: thumbnailUri,
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
          needsReselection: false,
        };

        updateMediaInEvent(index, updatedMedia);
      }
    } catch (error) {
      console.error("Error reselecting media:", error);
      Alert.alert("Error", "Failed to reselect media. Please try again.");
    }
  };

  const renderMediaItem = ({ item, index }) => (
    <View
      style={{
        width: (Dimensions.get("window").width - 72) / 2,
        height: 160,
        margin: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: item.needsReselection ? "#FF6B6B" : (styles.borderColor || "#E5E7EB"),
        overflow: "hidden",
        position: "relative",
        backgroundColor: item.needsReselection ? "#FFF5F5" : "transparent",
      }}
    >
      {item.needsReselection ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F8F8F8",
          }}
        >
          <RefreshCw size={32} color="#FF6B6B" />
          <Text style={{ 
            color: "#FF6B6B", 
            fontSize: 12, 
            textAlign: "center",
            marginTop: 8,
            paddingHorizontal: 8 
          }}>
            Media Missing{"\n"}Tap to reselect
          </Text>
        </View>
      ) : item.resource_type === "video" ? (
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

      {item.resource_type === "video" && !item.needsReselection && (
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

      {item.needsReselection ? (
        <TouchableOpacity
          onPress={() => handleReselectMedia(index)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#FF6B6B",
            borderRadius: 12,
            padding: 6,
          }}
        >
          <RefreshCw size={14} color="white" />
        </TouchableOpacity>
      ) : (
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
      )}
    </View>
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Event Photos & Videos</Text>
      <Text style={styles.sectionSubtitle}>
        Add photos and videos to showcase your event (Max 60 seconds for videos)
      </Text>

      <View style={{ marginTop: 24 }}>
        {/* Media Grid */}
        {mediaFiles.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <FlatList
              data={mediaFiles}
              renderItem={renderMediaItem}
              keyExtractor={(item, index) => `media-${index}`}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "flex-start",
              }}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Add Media Button */}
        <TouchableOpacity
          onPress={handleMediaSelection}
          disabled={isSelecting}
          style={[
            styles.typeOption,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 20,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: Colors.primary,
              backgroundColor: Colors.blue50,
            },
          ]}
        >
          {isSelecting ? (
            <Text style={[styles.labelText, { color: Colors.primary }]}>
              Loading...
            </Text>
          ) : (
            <>
              <Camera size={24} color={Colors.primary} />
              <Text
                style={[
                  styles.labelText,
                  { color: Colors.primary, marginLeft: 12 },
                ]}
              >
                {mediaFiles.length > 0 ? "Add More Media" : "Add Photos & Videos"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Media Count Info */}
        {mediaFiles.length > 0 && (
          <View
            style={[
              styles.typeOption,
              { marginTop: 16, backgroundColor: Colors.blue50 },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ImageIcon size={20} color={Colors.primary} />
              <Text
                style={[
                  styles.labelText,
                  { color: Colors.primary, marginLeft: 8 },
                ]}
              >
                {mediaFiles.length} {mediaFiles.length === 1 ? "file" : "files"} added
              </Text>
            </View>
            <Text style={[styles.typeOptionDescription, { marginTop: 8 }]}>
              {mediaFiles.filter(m => m.resource_type === "image").length} photos • {" "}
              {mediaFiles.filter(m => m.resource_type === "video").length} videos
            </Text>
            {mediaFiles.some(m => m.needsReselection) && (
              <Text style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>
                ⚠️ Some files need to be reselected
              </Text>
            )}
          </View>
        )}

        {/* Tips */}
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.typeOptionDescription, { fontSize: 13 }]}>
            💡 Tips:{"\n"}
            • Add high-quality photos showing the event venue, atmosphere, or past events{"\n"}
            • Videos should be under 60 seconds{"\n"}
            • Include promotional content, highlights, or teaser clips{"\n"}
            • First image will be used as the cover photo
          </Text>
        </View>
      </View>
    </View>
  );
}