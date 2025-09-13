import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackHeader from '@/components/BackHeader'
import { Colors } from '@/constants/Colors'
import React from 'react'

const EditProfile = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Edit Profile" showUser={false} />
      <View>
        <Text>EditProfile</Text>
      </View>
    </SafeAreaView>
  )
}

export default EditProfile