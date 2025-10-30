import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import Toast from 'react-native-toast-message';

const LOCATION_PERMISSION_KEY = '@location_permission_granted';

export const checkLocationPermission = async () => {
  try {
    // First check if location services are enabled
    const serviceEnabled = await Location.hasServicesEnabledAsync();
    if (!serviceEnabled) {
      console.log("Location services are not enabled");
      return false;
    }

    // Get current permission status
    let { status } = await Location.getForegroundPermissionsAsync();
    
    // If permission is not granted, request it
    if (status !== 'granted') {
      console.log("Requesting location permission...");
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus === 'granted') {
        await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, 'granted');
        return true;
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

export const getUserLocation = async () => {
  try {
    // console.log("Getting user location...");
    
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      console.log("Location permission denied");
      throw new Error("Location permission not granted. Please enable location access in your device settings.");
    }
    Toast.show({
      type: 'info',
      text1: 'Please wait while we fetch your location...',
    });
    console.log("Permission granted, getting current position...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      maxAge: 5000, // Accept a location reading from the last 5 seconds
    });

    console.log("Location obtained:", {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error; // Throw the error so we can handle it in the profile creation
  }
};
