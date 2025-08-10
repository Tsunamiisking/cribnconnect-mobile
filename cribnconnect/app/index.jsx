import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container} className="flex-1 bg-blue-50">
      {/* Hero Section */}
      <View style={styles.hero} className="flex-1 justify-center items-center px-6">
        <View style={styles.logoContainer} className="mb-8">
          <Text style={styles.logo} className="text-6xl mb-2">🏠</Text>
          <Text style={styles.appName} className="text-3xl font-bold text-blue-600 text-center">
            Crib & Connect
          </Text>
          <Text style={styles.tagline} className="text-lg text-gray-600 text-center mt-2">
            Discover. Connect. Experience.
          </Text>
        </View>

        <View style={styles.features} className="mb-8">
          <Text style={styles.featureText} className="text-base text-gray-700 text-center mb-2">
            🏡 Find your perfect apartment
          </Text>
          <Text style={styles.featureText} className="text-base text-gray-700 text-center mb-2">
            🎉 Attend amazing local events
          </Text>
          <Text style={styles.featureText} className="text-base text-gray-700 text-center mb-2">
            🤝 Connect with like-minded people
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions} className="px-6 pb-8">
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.primaryButton} className="bg-blue-600 py-4 rounded-lg mb-4">
            <Text style={styles.primaryButtonText} className="text-white text-center font-semibold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.secondaryButton} className="border-2 border-blue-600 py-4 rounded-lg">
            <Text style={styles.secondaryButtonText} className="text-blue-600 text-center font-semibold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Quick Demo Access */}
        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.demoButton} className="mt-4">
            <Text style={styles.demoButtonText} className="text-gray-500 text-center">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  features: {
    marginBottom: 32,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  demoButton: {
    marginTop: 16,
  },
  demoButtonText: {
    color: '#6b7280',
    textAlign: 'center',
  },
});
