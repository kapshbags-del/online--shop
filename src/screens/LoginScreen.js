
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛒</Text>

      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>
        Enter your email and password
      </Text>

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

      <TouchableOpacity style={styles.forgot}>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Main')}>
       </TouchableOpacity>

         <TouchableOpacity
            style={styles.button}
          onPress={() => navigation.replace('Main')}>
         <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}>

          <Text style={styles.footer}>
              Don't have an account? Sign Up
            </Text>
       </TouchableOpacity>

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
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#181725',
  },
  subtitle: {
    color: '#7C7C7C',
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    color: '#7C7C7C',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    paddingVertical: 12,
    marginBottom: 25,
    fontSize: 16,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 17,
    borderRadius: 15,
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
