import { View, Text, Pressable } from 'react-native'
import React from 'react'

export default function NormalHeader({ title="Header" }) {
  return (
    <View className=''>
      <Text className='text-white text-lg font-semibold'>{title}</Text>
    </View>
  )
}
