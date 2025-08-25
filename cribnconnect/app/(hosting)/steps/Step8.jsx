import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import { useState } from "react";
import { CloudUpload, X } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';

export default function Step8({ styles }) {
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleUpload = async () => {
    // Pick both images and videos
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      const newAssets = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image'
      }));
      setMediaFiles(prev => [...prev, ...newAssets]);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderMediaItem = ({ item, index }) => (
    <View style={{
      width: (Dimensions.get('window').width - 72) / 2,
      height: 160,
      margin: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: styles.borderColor || '#E5E7EB',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Image
        source={{ uri: item.uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      {item.type === 'video' && (
        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          backgroundColor: 'rgba(0,0,0,0.75)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}>
          <Text style={{ color: 'white', fontSize: 12 }}>Video</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => removeMedia(index)}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.75)',
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
        <Text style={styles.stepTitle}>Upload Pictures / Videos</Text>
        <Text style={styles.sectionSubtitle}>
          Select images or videos to upload
        </Text>

        <View style={styles.uploadContainer}>
          <Text
            style={[
              styles.labelText,
              { marginBottom: 12, textAlign: "center" },
            ]}
          >
            Tap to Upload images or videos of available space
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
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
              Upload
            </Text>
          </TouchableOpacity>
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
            <Text style={[styles.labelText]}>Uploaded Items</Text>
          </View>
        </View>

        {mediaFiles.length > 0 && (
          <FlatList
            data={mediaFiles}
            renderItem={renderMediaItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              paddingHorizontal: 6,
            }}
            style={{ marginTop: 16 }}
          />
        )}
      </View>
    </View>
  );
}
