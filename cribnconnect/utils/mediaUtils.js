import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Alert } from 'react-native';

export const generateVideoThumbnail = async (videoUri) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1500,
    });
    return uri;
  } catch (e) {
    console.warn("Thumbnail generation failed:", e);
    return null;
  }
};

export const requestMediaLibraryPermission = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      "Permission Required",
      "Please allow access to your photo library to upload media."
    );
    return false;
  }
  return true;
};

export const pickImages = async (currentCount = 0, maxImages = 3) => {
  if (currentCount >= maxImages) {
    Alert.alert("Maximum Images", `You can only upload up to ${maxImages} images`);
    return null;
  }

  if (!(await requestMediaLibraryPermission())) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: maxImages - currentCount,
    });

    if (!result.canceled) {
      return result.assets.map((asset) => ({
        url: asset.uri,
        type: 'image'
      }));
    }
  } catch (error) {
    console.error('Error picking images:', error);
    Alert.alert('Error', 'Failed to pick images. Please try again.');
  }
  return null;
};

export const pickVideo = async () => {
  if (!(await requestMediaLibraryPermission())) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      const videoUri = result.assets[0].uri;
      const thumbnail = await generateVideoThumbnail(videoUri);
      
      return {
        url: videoUri,
        thumbnail,
        type: 'video'
      };
    }
  } catch (error) {
    console.error('Error picking video:', error);
    Alert.alert('Error', 'Failed to pick video. Please try again.');
  }
  return null;
};