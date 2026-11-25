
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = '@ush_kiz_profile';
const BONUS_KEY = '@ush_kiz_bonus_balance';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    name: 'Пайдаланушы',
    email: 'user@email.com',
    phone: '',
  });

  const [bonusBalance, setBonusBalance] = useState(0);

  // Профиль мен бонус балансын жүктеу
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const savedData = await AsyncStorage.getItem(STORAGE_KEY);
          const savedBonus = await AsyncStorage.getItem(BONUS_KEY);

          if (savedData) {
            setUser(JSON.parse(savedData));
          }

          setBonusBalance(
            Math.max(0, Number(savedBonus) || 0)
          );
        } catch (error) {
          console.log('Мәліметтерді жүктеу қатесі:', error);
        }
      };

      loadData();
    }, [])
  );

  // Профиль мәзірі
  const menuItems = [
    { title: 'Менің тапсырыстарым', icon: '📦' },
    { title: 'Жеке мәліметтер', icon: '👤' },
    { title: 'Жеткізу мекенжайы', icon: '📍' },
    { title: 'Төлем әдістері', icon: '💳' },
    { title: 'Менің бонустарым', icon: '🎁' },
    { title: 'Хабарландырулар', icon: '🔔' },
    { title: 'Көмек және қолдау', icon: '❓' },
    { title: 'Қосымша туралы', icon: 'ℹ️' },
  ];

  // Мәзір батырмаларын басқару
  const handleMenuPress = (title) => {
    if (title === 'Менің тапсырыстарым') {
      navigation.navigate('Orders');
    } else if (title === 'Жеткізу мекенжайы') {
      navigation.navigate('Address');
    } else if (title === 'Жеке мәліметтер') {
      navigation.navigate('PersonalInfo');
    } else if (title === 'Төлем әдістері') {
      navigation.navigate('Payment');
    } else if (title === 'Менің бонустарым') {
      Alert.alert(
        '🎁 Менің бонустарым',
        `Қазіргі бонус балансыңыз: ${bonusBalance.toLocaleString('kk-KZ')} ₸\n\nӘр тапсырыстан тауарлар бағасының 1%-ы бонус болып жиналады.`
      );
    } else {
      Alert.alert(title, 'Бұл бөлім әзірге дайындалу үстінде.');
    }
  };

  // Жүйеден шығу
  const handleLogout = () => {
    Alert.alert(
      'Жүйеден шығу',
      'Жүйеден шыққыңыз келе ме?',
      [
        {
          text: 'Болдырмау',
          style: 'cancel',
        },
        {
          text: 'Шығу',
          onPress: () => {
            let parent = navigation;

            while (parent.getParent()) {
              parent = parent.getParent();
            }

            parent.navigate('Welcome');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Менің профилім</Text>

      <Text style={styles.subtitle}>
        ҮШ ҚЫЗ MARKET дүкеніне қош келдіңіз!
      </Text>

      {/* Пайдаланушы ақпараты */}
      <View style={styles.userCard}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatar}>👩🏻</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.member}>
            ⭐ Тұрақты сатып алушы
          </Text>
        </View>
      </View>

      {/* Бонустар */}
      <TouchableOpacity
        style={styles.bonusCard}
        onPress={() => handleMenuPress('Менің бонустарым')}
      >
        <View>
          <Text style={styles.bonusTitle}>
            Менің бонустарым 🎁
          </Text>

          <Text style={styles.bonusText}>
            Әр сатып алудан 1% бонус жинаңыз!
          </Text>
        </View>

        <Text style={styles.bonusAmount}>
          {bonusBalance.toLocaleString('kk-KZ')} ₸
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Жеке кабинет</Text>

      {/* Мәзір тізімі */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          style={styles.menuItem}
          key={index}
          onPress={() => handleMenuPress(item.title)}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
              <Text style={styles.menuIcon}>
                {item.icon}
              </Text>
            </View>

            <Text style={styles.menuText}>
              {item.title}
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Жүйеден шығу */}
      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          ↗️ Жүйеден шығу
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        ҮШ ҚЫЗ MARKET · 1.0.0 нұсқасы
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F7',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 25,
    color: '#222222',
  },

  subtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 6,
    marginBottom: 22,
  },

  userCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 18,
  },

  avatarBox: {
    width: 65,
    height: 65,
    backgroundColor: '#E9F5EC',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  avatar: {
    fontSize: 37,
  },

  userInfo: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },

  email: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },

  member: {
    color: '#53B175',
    fontSize: 12,
    marginTop: 6,
  },

  bonusCard: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  bonusTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#286B3A',
  },

  bonusText: {
    fontSize: 12,
    color: '#578363',
    marginTop: 6,
  },

  bonusAmount: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#278344',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 42,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  menuIcon: {
    fontSize: 21,
  },

  menuText: {
    fontSize: 15,
    color: '#333333',
  },

  arrow: {
    fontSize: 25,
    color: '#999999',
  },

  logout: {
    backgroundColor: '#FCEAEA',
    padding: 17,
    borderRadius: 15,
    marginTop: 28,
  },

  logoutText: {
    color: '#D9534F',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  version: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 22,
    marginBottom: 35,
  },
});
