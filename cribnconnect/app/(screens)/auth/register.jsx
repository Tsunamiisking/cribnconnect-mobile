import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = () => {
    // Add registration logic here
    console.log('Registration attempt:', formData);
    router.back();
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join us to find your perfect home</ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <View style={styles.nameRow}>
              <ThemedView style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <ThemedText style={styles.label}>First Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  value={formData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                />
              </ThemedView>

              <ThemedView style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <ThemedText style={styles.label}>Last Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                />
              </ThemedView>
            </View>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
              />
            </ThemedView>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
            <Link href="/(screens)/auth/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.signInLink}>Sign In</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
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
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  nameRow: {
    flexDirection: 'row',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  registerButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
  },
  signInLink: {
    color: '#2196f3',
    fontWeight: '600',
  },
});
