import { ScrollView, View, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Preferences</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Push Notifications</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Receive alerts about new apartments and updates
              </ThemedText>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Location Access</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Allow location access for nearby apartment suggestions
              </ThemedText>
            </View>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Dark Mode</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Use dark theme throughout the app
              </ThemedText>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
          
          <TouchableOpacity style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Change Password</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Privacy Policy</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Terms of Service</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Support</ThemedText>
          
          <TouchableOpacity style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Help Center</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Contact Support</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Report a Problem</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <TouchableOpacity style={styles.dangerButton}>
            <ThemedText style={styles.dangerButtonText}>Delete Account</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  settingDescription: {
    color: '#666',
    fontSize: 14,
  },
  menuButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuButtonText: {
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  dangerButtonText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
});
