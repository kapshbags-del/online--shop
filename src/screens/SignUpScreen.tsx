
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@ush_kiz_profile';

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Қате', 'Барлық өрістерді толтырыңыз.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Қате', 'Телефон нөмірін дұрыс енгізіңіз.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Қате', 'Электрондық поштаны дұрыс енгізіңіз.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Қате', 'Құпиясөз кемінде 6 таңбалы болуы керек.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Қате', 'Құпиясөздер сәйкес келмейді.');
      return;
    }

    try {
      setLoading(true);

      // Құпиясөз сақталмайды.
      // Тек профиль туралы мәліметтер сақталады.
      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
        })
      );

      Alert.alert(
        'Тіркелу аяқталды!',
        'Профиліңіз демонстрациялық режимде құрылды.',
        [
          {
            text: 'Жалғастыру',
            onPress: () => navigation.replace('Main'),
          },
        ]
      );
    } catch (error) {
      console.log('Тіркелу қатесі:', error);

      Alert.alert(
        'Қате',
        'Тіркелу кезінде қате пайда болды.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={23} color="#222" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🛒</Text>
        </View>

        <Text style={styles.title}>Тіркелу</Text>

        <Text style={styles.subtitle}>
          ҮШ ҚЫЗ MARKET дүкеніне қош келдіңіз!
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Аты-жөніңіз</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#53B175" />

            <TextInput
              style={styles.input}
              placeholder="Аты-жөніңізді енгізіңіз"
              placeholderTextColor="#AAAAAA"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Телефон нөмірі</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#53B175" />

            <TextInput
              style={styles.input}
              placeholder="+7 777 000 00 00"
              placeholderTextColor="#AAAAAA"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <Text style={styles.label}>Электрондық пошта</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#53B175" />

            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              placeholderTextColor="#AAAAAA"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Құпиясөз</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#53B175" />

            <TextInput
              style={styles.input}
              placeholder="Кемінде 6 таңба"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Құпиясөзді қайталаңыз</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#53B175" />

            <TextInput
              style={styles.input}
              placeholder="Құпиясөзді қайта енгізіңіз"
              placeholderTextColor="#AAAAAA"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Тіркелуде...' : 'Аккаунт құру'}
            </Text>

            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Аккаунтыңыз бар ма?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLink}>Кіру</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          ҮШ ҚЫЗ MARKET · Демонстрациялық қосымша
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F8',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: '#EDF7EF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  logo: {
    fontSize: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 18,
  },

  subtitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 7,
  },

  form: {
    marginTop: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 13,
  },

  inputContainer: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    marginLeft: 10,
  },

  registerButton: {
    height: 54,
    backgroundColor: '#53B175',
    borderRadius: 13,
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    gap: 5,
  },

  loginText: {
    fontSize: 12,
    color: '#888',
  },

  loginLink: {
    fontSize: 12,
    color: '#53B175',
    fontWeight: 'bold',
  },

  footer: {
    fontSize: 10,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 30,
  },
});
