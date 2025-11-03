import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import api from '@/api/api';

/**
 * useHeartbeat Hook
 * Sends periodic heartbeat to backend to update user's active status
 * Uses polling approach with AppState awareness
 */
export const useHeartbeat = () => {
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const sendHeartbeat = async () => {
    try {
      await api.post('/users/heartbeat');
      console.log('Heartbeat sent successfully');
    } catch (error) {
      console.error('Heartbeat failed:', error.message);
      // Don't throw - heartbeat failures should be silent
    }
  };

  const startHeartbeat = () => {
    // Send immediate heartbeat
    sendHeartbeat();
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Send heartbeat every 3 minutes (180000ms)
    // Backend considers user offline if lastSeen > 5 minutes
    intervalRef.current = setInterval(sendHeartbeat, 3 * 60 * 1000);
  };

  const stopHeartbeat = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      // App has come to foreground
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground - starting heartbeat');
        startHeartbeat();
      }
      
      // App has gone to background
      if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('App has gone to the background - stopping heartbeat');
        stopHeartbeat();
      }

      appStateRef.current = nextAppState;
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Start heartbeat if app is currently active
    if (AppState.currentState === 'active') {
      startHeartbeat();
    }

    // Cleanup
    return () => {
      stopHeartbeat();
      subscription.remove();
    };
  }, []);

  return null;
};
