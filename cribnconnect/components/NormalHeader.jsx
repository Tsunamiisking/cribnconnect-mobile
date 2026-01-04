import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import ProfilePopup from './ProfilePopup'
import { useAuth } from '@/contexts/AuthContext'

export default function NormalHeader({ title="Title" }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const { user: authUser, publicProfile, isAuthenticated, loading } = useAuth();
  

  const handleProfilePress = () => {
    setShowProfilePopup(true);
  };

  // Get user initials
  const getUserInitials = () => {
    if (publicProfile?.firstName && publicProfile?.lastName) {
      return `${publicProfile.firstName[0]}${publicProfile.lastName[0]}`.toUpperCase();
    }
    if (authUser?.displayName) {
      const names = authUser.displayName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return authUser.displayName.substring(0, 2).toUpperCase();
    }
    if (authUser?.email) {
      return authUser.email.substring(0, 2).toUpperCase();
    }
    return "GU";
  };

  return (
    <>
      <View style={styles.container} className='flex-row justify-between items-center px-4 py-3'>
        <Text style={styles.text} className='text-black'>{title}</Text>
        <Pressable onPress={handleProfilePress}>
          <View style={styles.profileButton} className='h-14 w-14 rounded-full items-center justify-center'>
            <Text style={styles.profileText}>{getUserInitials()}</Text>
          </View>
        </Pressable>
      </View>

      <ProfilePopup 
        visible={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 28,
    fontFamily: "Urbanist-Bold",
    color: Colors.primary,
  },
  profileButton: {
    backgroundColor: Colors.primary,
  },
  profileText: {
    color: 'white',
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
  }
})
