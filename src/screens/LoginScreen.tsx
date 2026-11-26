
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

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert(
        'Мәліметтерді енгізіңіз',
        'Телефон нөмірі мен құпиясөзді толтырыңыз.'
      );
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert(
        'Телефон нөмірі',
        'Телефон нөмірін дұрыс енгізіңіз.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Құпиясөз',
        'Құпиясөз кемінде 6 таңбадан тұруы керек.'
      );
      return;
    }

    try {
      setLoading(true);

      const savedProfile = await AsyncStorage.getItem(PROFILE_KEY);

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        if (
          profile.phone &&
          profile.phone.replace(/\D/g, '') !== phone.replace(/\D/g, '')
        ) {
          Alert.alert(
            'Кіру мүмкін болмады',
            'Бұл телефон нөмірі сақталған профильге сәйкес келмейді.'
          );
          return;
        }
      } else {
        await AsyncStorage.setItem(
          PROFILE_KEY,
          JSON.stringify({
            name: 'Қолданушы',
            phone: phone.trim(),
            email: '',
          })
        );
      }

      Alert.alert(
        'Сәтті!',
        'Демонстрациялық режимде жүйеге кірдіңіз.',
        [
          {
            text: 'Жалғастыру',
            onPress: () => navigation.replace('Main'),
          },
        ]
      );
    } catch (error) {
      console.log('Кіру қатесі:', error);

      Alert.alert(
        'Қате',
        'Жүйеге кіру кезінде қате пайда болды.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={23} color="#222" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🛒</Text>
        </View>

        <Text style={styles.title}>
          Қош келдіңіз!
        </Text>

        <Text style={styles.subtitle}>
          ҮШ ҚЫЗ MARKET дүкеніне кіру
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Телефон нөмірі
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#53B175"
            />

            <TextInput
              style={styles.input}
              placeholder="+7 777 000 00 00"
              placeholderTextColor="#AAAAAA"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <Text style={styles.label}>
            Құпиясөз
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#53B175"
            />

            <TextInput
              style={styles.input}
              placeholder="Құпиясөзді енгізіңіз"
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

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>
              Құпиясөзді ұмыттыңыз ба?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Кіру...' : 'Жүйеге кіру'}
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Аккаунтыңыз жоқ па?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.registerLink}>
                Тіркелу
              </Text>
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
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: '#EDF7EF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },

  logoEmoji: {
    fontSize: 48,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 25,
  },

  subtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },

  form: {
    marginTop: 35,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 9,
    marginTop: 15,
  },

  inputContainer: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    marginLeft: 11,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 13,
  },

  forgotText: {
    fontSize: 12,
    color: '#53B175',
    fontWeight: '600',
  },

  loginButton: {
    height: 55,
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

  loginButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    gap: 5,
  },

  registerText: {
    fontSize: 12,
    color: '#888',
  },

  registerLink: {
    fontSize: 12,
    color: '#53B175',
    fontWeight: 'bold',
  },

  footer: {
    fontSize: 10,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 40,
  },
});
