import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

export default function NormalHeader({ title="Title" }) {
  return (
    <View style={styles.container} className='flex-row justify-between items-center px-4 py-3'>
      <Text style={styles.text} className='text-black'>{title}</Text>
      <Pressable>
        <View style={styles.profileButton} className='h-12 w-12 rounded-full items-center justify-center'>
          <Text style={styles.profileText}>GU</Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    fontSize: 14,
  }
})
