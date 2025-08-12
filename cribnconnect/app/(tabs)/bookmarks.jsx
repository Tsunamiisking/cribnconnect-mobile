import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import NormalHeader from '@/components/NormalHeader'
import React from 'react'

export default function Bookmarkscreen() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <NormalHeader title="Bookmarks" />
    </SafeAreaView>
  )
}