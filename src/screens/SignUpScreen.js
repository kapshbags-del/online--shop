
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛒</Text>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Create your account
      </Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Create Account
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account? Log In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 25,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 55,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#181725',
  },
  subtitle: {
    color: '#7C7C7C',
    marginTop: 10,
    marginBottom: 25,
  },
  label: {
    color: '#7C7C7C',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 17,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    marginTop: 25,
    color: '#7C7C7C',
  },
});
