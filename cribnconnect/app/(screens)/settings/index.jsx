import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import BackHeader from '@/components/BackHeader'

const SettingsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title='Settings' showUser={false}/>
    </SafeAreaView>
  )
}

export default SettingsScreen