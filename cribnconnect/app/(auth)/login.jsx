import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    
    // TODO: Add API integration for login
    // Example API call:
    // try {
    //   const response = await api.login({ email, password });
    //   if (response.success) {
    //     // Store auth token
    //     // Navigate to main app
    //     router.replace('/(tabs)');
    //   }
    // } catch (error) {
    //   // Handle login error
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
              Welcome back!
            </Text>
            <Text style={styles.welcomeSubtitle} className="text-base text-gray-600">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form} className="mb-8">
            <View style={styles.inputGroup} className="mb-4">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup} className="mb-6">
              <Text style={styles.label} className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                style={styles.input}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              className="bg-blue-600 py-4 rounded-lg mb-4"
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText} className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword} className="items-center">
              <Text style={styles.forgotPasswordText} className="text-blue-600 text-base">
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Login Options */}
          <View style={styles.socialLogin} className="mb-8">
            <Text style={styles.orText} className="text-center text-gray-500 mb-4">
              Or continue with
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

          {/* Sign Up Link */}
          <View style={styles.footer} className="flex-row justify-center items-center">
            <Text style={styles.footerText} className="text-gray-600">
              Don't have an account? 
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.signUpLink} className="text-blue-600 font-semibold ml-1">
                  Sign Up
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
  loginButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 16,
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
  },
  footerText: {
    color: '#6b7280',
  },
  signUpLink: {
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 4,
  },
});
