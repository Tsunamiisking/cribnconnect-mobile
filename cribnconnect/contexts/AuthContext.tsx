import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  publicProfileId: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshPublicProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  publicProfileId: null,
  loading: true,
  isAuthenticated: false,
  refreshPublicProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [publicProfileId, setPublicProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch and store public profile ID
  const fetchPublicProfile = async (firebaseUser: User) => {
    try {
      // Check AsyncStorage first for cached value
      const cachedProfileId = await AsyncStorage.getItem('publicProfileId');
      if (cachedProfileId) {
        setPublicProfileId(cachedProfileId);
      }

      // Fetch fresh data from backend
      const response = await api.get('/public-profile/me');
      const profileId = response.data?._id;
      
      if (profileId) {
        setPublicProfileId(profileId);
        // Cache it in AsyncStorage
        await AsyncStorage.setItem('publicProfileId', profileId);
      }
    } catch (error) {
      console.log('Could not fetch public profile:', error);
      // User might not have created their public profile yet
      // This is okay - publicProfileId will remain null
    }
  };

  // Refresh public profile (can be called after user creates/updates profile)
  const refreshPublicProfile = async () => {
    if (user) {
      await fetchPublicProfile(user);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // User is logged in, fetch their public profile ID
        await fetchPublicProfile(firebaseUser);
      } else {
        // User is logged out, clear public profile ID
        setPublicProfileId(null);
        await AsyncStorage.removeItem('publicProfileId');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    publicProfileId,
    loading,
    isAuthenticated: !!user,
    refreshPublicProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
