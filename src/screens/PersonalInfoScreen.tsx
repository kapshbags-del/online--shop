
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type UserInfo = {
  name: string;
  phone: string;
  email: string;
};

const PROFILE_KEY = '@ush_kiz_profile';
const BONUS_KEY = '@ush_kiz_bonus_balance';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<UserInfo>({
    name: 'Қонақ',
    phone: '',
    email: '',
  });

  const [bonusBalance, setBonusBalance] = useState(0);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem(PROFILE_KEY);
      const savedBonus = await AsyncStorage.getItem(BONUS_KEY);

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);

        setUser({
          name: parsed.name || 'Қонақ',
          phone: parsed.phone || '',
          email: parsed.email || '',
        });
      }

      if (savedBonus) {
        setBonusBalance(Number(savedBonus) || 0);
      }
    } catch (error) {
      console.log('Профильді жүктеу қатесі:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const menuItems = [
    {
      title: 'Жеке ақпарат',
      subtitle: 'Атыңызды және байланыс деректерін өзгерту',
      icon: 'person-outline',
      screen: 'PersonalInfo',
    },
    {
      title: 'Менің тапсырыстарым',
      subtitle: 'Тапсырыстар тарихын қарау',
      icon: 'receipt-outline',
      screen: 'Orders',
    },
    {
      title: 'Жеткізу мекенжайы',
      subtitle: 'Мекенжай мен жеткізу уақытын таңдау',
      icon: 'location-outline',
      screen: 'Address',
    },
    {
      title: 'Төлем әдістері',
      subtitle: 'Төлем баптауларын басқару',
      icon: 'card-outline',
      screen: 'Payment',
    },
  ];

  const openMenu = (screen: string) => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    Alert.alert(
      'Шығу',
      'Аккаунттан шыққыңыз келе ме?',
      [
        {
          text: 'Болдырмау',
          style: 'cancel',
        },
        {
          text: 'Шығу',
          style: 'destructive',
          onPress: () => navigation.replace('Welcome'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Жеке кабинет</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={38}
              color="#53B175"
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.name}
            </Text>

            <Text style={styles.userPhone}>
              {user.phone || 'Телефон нөмірі көрсетілмеген'}
            </Text>

            <Text style={styles.userEmail}>
              {user.email || 'Email көрсетілмеген'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => openMenu('PersonalInfo')}
          >
            <Ionicons
              name="create-outline"
              size={23}
              color="#53B175"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bonusCard}>
          <View style={styles.bonusIcon}>
            <Ionicons
              name="gift-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.bonusInfo}>
            <Text style={styles.bonusTitle}>
              Менің бонустарым
            </Text>

            <Text style={styles.bonusSubtitle}>
              Келесі тапсырыста пайдалануға болады
            </Text>
          </View>

          <Text style={styles.bonusAmount}>
            {bonusBalance.toLocaleString('kk-KZ')} ₸
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Менің аккаунтым
        </Text>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.screen}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuBorder,
              ]}
              onPress={() => openMenu(item.screen)}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={23}
                  color="#53B175"
                />
              </View>

              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>
                  {item.title}
                </Text>

                <Text style={styles.menuSubtitle}>
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#AAAAAA"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#E74C3C"
          />

          <Text style={styles.logoutText}>
            Аккаунттан шығу
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          ҮШ ҚЫЗ MARKET · 1.0.0
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

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    padding: 17,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#EAF6EC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userInfo: {
    flex: 1,
    marginLeft: 13,
  },

  userName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },

  userPhone: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },

  bonusCard: {
    backgroundColor: '#53B175',
    marginHorizontal: 15,
    marginTop: 17,
    padding: 17,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bonusIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#78C891',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bonusInfo: {
    flex: 1,
    marginLeft: 12,
  },

  bonusTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  bonusSubtitle: {
    color: '#E7F7EB',
    fontSize: 10,
    marginTop: 5,
  },

  bonusAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 12,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 16,
    paddingHorizontal: 15,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
  },

  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },

  menuSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },

  logoutButton: {
    marginHorizontal: 15,
    marginTop: 22,
    padding: 17,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E74C3C',
  },

  version: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 11,
    marginVertical: 22,
  },
});
