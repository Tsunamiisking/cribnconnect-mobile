import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    
    // TODO: Add API integration for registration
    // Example API call:
    // try {
    //   const response = await api.register(formData);
    //   if (response.success) {
    //     // Store auth token
    //     // Navigate to main app or onboarding
    //     router.replace('/(tabs)');
    //   }
    // } catch (error) {
    //   // Handle registration error
    // }
    
    // Temporary navigation for demo
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content} className="flex-1 px-6 pt-8">
          
          {/* Welcome Message */}
          <View style={styles.header} className="mb-8">
            <Text style={styles.welcomeTitle} className="text-2xl font-bold text-gray-900 mb-2">
              Join Crib & Connect
            </Text>
            <Text style={styles.welcomeSubtitle} className="text-base text-gray-600">
              Create your account to get started
            </Text>
          </View>

          {/* Registration Form */}
          <View style={styles.form} className="mb-8">
            <View style={styles.nameRow} className="flex-row space-x-4 mb-4">
              <View style={styles.nameInput} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  First Name
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                  placeholder="First name"
                  value={formData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                  autoComplete="given-name"
                />
              </View>

              <View style={styles.nameInput} className="flex-1">
                <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                  autoComplete="family-name"
                />
              </View>
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              className="bg-blue-600 py-4 rounded-lg mb-4"
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText} className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <View style={styles.terms} className="mb-8">
            <Text style={styles.termsText} className="text-center text-gray-500 text-sm leading-5">
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink} className="text-blue-600">Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink} className="text-blue-600">Privacy Policy</Text>
            </Text>
          </View>

          {/* Social Registration Options */}
          <View style={styles.socialLogin} className="mb-8">
            <Text style={styles.orText} className="text-center text-gray-500 mb-4">
              Or sign up with
            </Text>
            
            <View style={styles.socialButtons} className="flex-row space-x-4">
              <TouchableOpacity style={styles.socialButton} className="flex-1 bg-gray-100 py-3 rounded-lg">
                <Text style={styles.socialButtonText} className="text-center font-medium">
                  📱 Google
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton} className="flex-1 bg-gray-100 py-3 rounded-lg">
                <Text style={styles.socialButtonText} className="text-center font-medium">
                  📘 Facebook
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Link */}
          <View style={styles.footer} className="flex-row justify-center items-center pb-8">
            <Text style={styles.footerText} className="text-gray-600">
              Already have an account? 
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.signInLink} className="text-blue-600 font-semibold ml-1">
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  terms: {
    marginBottom: 32,
  },
  termsText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#2563eb',
  },
  socialLogin: {
    marginBottom: 32,
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  socialButtonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    color: '#6b7280',
  },
  signInLink: {
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 4,
  },
});
