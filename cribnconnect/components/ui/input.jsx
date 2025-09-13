import { View, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

export default function Input({ placeholder, value, onChangeText }) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles.inputView}
    />
  )
}

const styles = StyleSheet.create({
    inputView: {
    display: "flex",
    flexDirection: "row",
    fontSize: 16,
    fontFamily: "Sora-Regular",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderWidth: 1,
    width: 80,
    height: 50,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    color: "#111827",
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
  },
})
