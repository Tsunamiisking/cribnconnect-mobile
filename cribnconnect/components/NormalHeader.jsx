import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import ProfilePopup from './ProfilePopup'

export default function NormalHeader({ title="Title" }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleProfilePress = () => {
    setShowProfilePopup(true);
  };

  return (
    <>
      <View style={styles.container} className='flex-row justify-between items-center px-4 py-3'>
        <Text style={styles.text} className='text-black'>{title}</Text>
        <Pressable onPress={handleProfilePress}>
          <View style={styles.profileButton} className='h-14 w-14 rounded-full items-center justify-center'>
            <Text style={styles.profileText}>GU</Text>
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
