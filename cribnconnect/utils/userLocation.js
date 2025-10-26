import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";

const LOCATION_PERMISSION_KEY = '@location_permission_granted';

export const checkLocationPermission = async () => {
  try {
    // Check if we already have permission stored
    const storedPermission = await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);
    
    if (!storedPermission) {
      // Request permission if not stored
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // Store the permission state
        await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, 'granted');
        return true;
      }
      return false;
    }
    
    // If we have stored permission, verify it's still valid
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

export const getUserLocation = async () => {
  try {
    const hasPermission = await checkLocationPermission();
    
    if (!hasPermission) {
      console.log("Location permission not granted");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};
