
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ush_kiz_profile';

export default function PersonalInfoScreen({ navigation }) {
  const [name, setName] = useState('Пайдаланушы');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('user@email.com');
  const [loading, setLoading] = useState(true);

  // Бұрын сақталған ақпаратты жүктеу
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const profile = JSON.parse(savedData);

        setName(profile.name || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
      }
    } catch (error) {
      Alert.alert('Қате', 'Ақпаратты жүктеу мүмкін болмады.');
    } finally {
      setLoading(false);
    }
  };

  // Ақпаратты телефон жадына сақтау
  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Қате', 'Барлық жолдарды толтырыңыз.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Қате', 'Электрондық пошта дұрыс емес.');
      return;
    }

    try {
      const profile = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
      );

      Alert.alert('Сәтті!', 'Жеке мәліметтер сақталды.');
    } catch (error) {
      Alert.alert('Қате', 'Ақпаратты сақтау мүмкін болмады.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#53B175" />
        <Text style={styles.loadingText}>Жүктелуде...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Жеке мәліметтер</Text>

      <Text style={styles.subtitle}>
        Жеке ақпаратыңызды осында өзгерте аласыз.
      </Text>

      <View style={styles.avatarBox}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.avatarText}>
          Профиль ақпараты
        </Text>
      </View>

      <Text style={styles.label}>Аты-жөніңіз</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Аты-жөніңізді енгізіңіз"
      />

      <Text style={styles.label}>Телефон нөмірі</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+7 777 000 00 00"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Электрондық пошта</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Сақтау</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Артқа қайту</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F7',
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#53B175',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 20,
  },
  subtitle: {
    color: '#888888',
    fontSize: 14,
    marginTop: 7,
    marginBottom: 25,
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    fontSize: 65,
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 60,
  },
  avatarText: {
    color: '#666666',
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 9,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#53B175',
    padding: 17,
    borderRadius: 13,
    marginTop: 30,
  },
  saveText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 15,
    marginBottom: 30,
  },
  backText: {
    color: '#53B175',
    textAlign: 'center',
    fontSize: 15,
  },
});
