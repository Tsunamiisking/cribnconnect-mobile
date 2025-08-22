import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HostTypeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What would you like to host?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, styles.apartmentButton]}
          onPress={() => router.push('/(hosting)/add-apartment')}
        >
          <Text style={styles.optionText}>Host Apartment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, styles.eventButton]}
          onPress={() => router.push('/(hosting)/add-event')}
        >
          <Text style={styles.optionText}>Host Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    width: '100%',
    paddingVertical: 24,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  apartmentButton: {
    backgroundColor: '#eff6ff',
  },
  eventButton: {
    backgroundColor: '#fef9c3',
  },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
  },
});
