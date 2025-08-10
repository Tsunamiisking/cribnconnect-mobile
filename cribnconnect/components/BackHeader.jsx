import { View, Text, Pressable } from 'react-native'
import React from 'react'

export default function BackHeader({ title }) {
  return (
    <View className=''>
      <Text className='text-white text-lg font-semibold'>{title}</Text>
    </View>
  )
}
