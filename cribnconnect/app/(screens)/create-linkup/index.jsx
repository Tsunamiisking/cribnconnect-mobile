import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Users, MapPin, Calendar, Lock, Globe } from "lucide-react-native"
import BackHeader from "@/components/BackHeader"
import { Colors } from "@/constants/Colors"
import { router } from "expo-router"

/**
 * CreateLinkupScreen
 * - Simplified linkup creation process
 * - Essential fields only for quick group creation
 */
export default function CreateLinkupScreen() {
  const [formData, setFormData] = useState({
    title: "",
    interest: "",
    location: "",
    schedule: "",
    privacy: "public", // "public" or "private"
    description: "",
  })

  const privacyOptions = [
    { id: "public", name: "Public", description: "Anyone can find and join", icon: Globe },
    { id: "private", name: "Private", description: "Invite only", icon: Lock },
  ]

  const handleCreate = () => {
    // Simple validation - only title and interest are required
    if (!formData.title || !formData.interest) {
      alert("Please enter a group name and interest/topic")
      return
    }

    // TODO: Implement actual linkup creation
    console.log("Creating linkup:", formData)
    
    // Navigate back to linkups screen
    router.back()
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <BackHeader title="Create Linkup" showUser={true} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Coffee & Code Buddies"
            value={formData.title}
            onChangeText={(value) => updateField("title", value)}
          />
        </View>

        {/* Interest */}
        <View style={styles.section}>
          <Text style={styles.label}>Interest/Topic *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Tech & Programming"
            value={formData.interest}
            onChangeText={(value) => updateField("interest", value)}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Location (Optional)</Text>
          <Text style={styles.subtitle}>Add if you meet in person, leave blank for online groups</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Downtown Cafe, Lagos"
            value={formData.location}
            onChangeText={(value) => updateField("location", value)}
          />
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.label}>Schedule</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Every Wednesday, 2:00 PM"
            value={formData.schedule}
            onChangeText={(value) => updateField("schedule", value)}
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.label}>Privacy</Text>
          <Text style={styles.subtitle}>Choose who can find and join your group</Text>
          
          <View style={styles.privacyOptions}>
            {privacyOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.privacyOption,
                  formData.privacy === option.id && styles.selectedPrivacy
                ]}
                onPress={() => updateField("privacy", option.id)}
              >
                <option.icon 
                  size={20} 
                  color={formData.privacy === option.id ? Colors.primary : Colors.gray500} 
                />
                <View style={styles.privacyContent}>
                  <Text style={[
                    styles.privacyName,
                    formData.privacy === option.id && styles.selectedText
                  ]}>
                    {option.name}
                  </Text>
                  <Text style={styles.privacyDescription}>{option.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell people what your group is about..."
            value={formData.description}
            onChangeText={(value) => updateField("description", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Create Button */}
        <View style={styles.createSection}>
          <Pressable style={styles.createButton} onPress={handleCreate}>
            <Users size={20} color="white" />
            <Text style={styles.createButtonText}>Create Linkup</Text>
          </Pressable>
          
          <Text style={styles.helpText}>
            Your group will be visible to others based on privacy settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray900,
    backgroundColor: Colors.lightBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  privacyOptions: {
    gap: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  selectedPrivacy: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  privacyContent: {
    marginLeft: 16,
    flex: 1,
  },
  privacyName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
  },
  selectedText: {
    color: Colors.primary,
  },
  privacyDescription: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 2,
  },
  createSection: {
    marginBottom: 32,
    paddingTop: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 26,
    marginBottom: 12,
  },
  createButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  helpText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
