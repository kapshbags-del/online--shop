
import React, { useState, useCallback } from 'react';

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
import { useFocusEffect } from '@react-navigation/native';

import { useCart } from '../context/CartContext';

const ORDERS_KEY = '@ush_kiz_orders';
const PAYMENT_KEY = '@ush_kiz_payment';
const BONUS_KEY = '@ush_kiz_bonus_balance';
const ADDRESS_KEY = '@ush_kiz_delivery_address';

const PAYMENT_NAMES: Record<string, string> = {
  cash: 'Қолма-қол ақша',
  card: 'Банк картасы (демо)',
  qr: 'QR төлем (демо)',
  installment: 'Бөліп төлеу (демо)',
};

type PaymentSettings = {
  currency: string;
  paymentMethod: string;
  months: number;
};

export default function CheckoutScreen({ navigation }: any) {
  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  const [paymentSettings, setPaymentSettings] =
    useState<PaymentSettings>({
      currency: 'KZT',
      paymentMethod: 'cash',
      months: 3,
    });

  const [bonusBalance, setBonusBalance] = useState(0);
  const [useBonus, setUseBonus] = useState(false);
  const [saving, setSaving] = useState(false);

  const deliveryPrice = cartItems.length > 0 ? 500 : 0;
  const subtotal = totalPrice;
  const beforeBonus = subtotal + deliveryPrice;

  const actualBonusUsed = useBonus
    ? Math.min(bonusBalance, beforeBonus)
    : 0;

  const finalPrice = beforeBonus - actualBonusUsed;
  const bonusEarned = Math.floor(subtotal * 0.01);

  const loadData = async () => {
    try {
      const payment = await AsyncStorage.getItem(PAYMENT_KEY);
      const bonus = await AsyncStorage.getItem(BONUS_KEY);
      const savedAddress = await AsyncStorage.getItem(ADDRESS_KEY);

      if (payment) {
        setPaymentSettings({
          currency: JSON.parse(payment).currency || 'KZT',
          paymentMethod: JSON.parse(payment).paymentMethod || 'cash',
          months: JSON.parse(payment).months || 3,
        });
      }

      if (bonus) {
        setBonusBalance(Number(bonus) || 0);
      }

      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);

        setDeliveryInfo(parsedAddress);
        setAddress(parsedAddress.fullAddress || '');
      }
    } catch (error) {
      console.log('Мәліметтерді жүктеу қатесі:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const openAddressScreen = () => {
    navigation.navigate('Address');
  };

  const openPaymentScreen = () => {
    navigation.navigate('Payment', {
      amount: beforeBonus,
    });
  };

  const toggleBonus = () => {
    if (bonusBalance <= 0) {
      Alert.alert(
        'Бонус жоқ',
        'Сізде әзірге қолдануға болатын бонус жоқ.'
      );
      return;
    }

    setUseBonus((previous) => !previous);
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Себет бос', 'Алдымен тауар таңдаңыз.');
      return;
    }

    if (!address.trim()) {
      Alert.alert(
        'Мекенжай қажет',
        'Алдымен жеткізу мекенжайын енгізіңіз.',
        [
          { text: 'Болдырмау', style: 'cancel' },
          {
            text: 'Мекенжай енгізу',
            onPress: openAddressScreen,
          },
        ]
      );
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert(
        'Телефон нөмірі',
        'Дұрыс телефон нөмірін енгізіңіз.'
      );
      return;
    }

    try {
      setSaving(true);

      const savedOrders = await AsyncStorage.getItem(ORDERS_KEY);
      const orders = savedOrders ? JSON.parse(savedOrders) : [];

      const method = paymentSettings.paymentMethod;

      const newOrder = {
        id: Date.now().toString(),
        items: cartItems,
        address: address.trim(),
        deliveryInfo: deliveryInfo,
        phone: phone.trim(),
        payment: PAYMENT_NAMES[method] || 'Қолма-қол ақша',
        paymentMethod: method,
        currency: paymentSettings.currency,
        installmentMonths:
          method === 'installment'
            ? paymentSettings.months
            : null,
        monthlyPayment:
          method === 'installment'
            ? Math.ceil(finalPrice / paymentSettings.months)
            : null,
        productsPrice: subtotal,
        deliveryPrice,
        bonusUsed: actualBonusUsed,
        bonusEarned,
        finalPrice,
        createdAt: new Date().toISOString(),
        status: 'Қабылданды',
      };

      await AsyncStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([newOrder, ...orders])
      );

      const newBonusBalance =
        bonusBalance - actualBonusUsed + bonusEarned;

      await AsyncStorage.setItem(
        BONUS_KEY,
        String(newBonusBalance)
      );

      clearCart();

      navigation.replace('OrderSuccess', {
        order: newOrder,
      });
    } catch (error) {
      console.log('Тапсырысты сақтау қатесі:', error);

      Alert.alert(
        'Қате',
        'Тапсырысты сақтау мүмкін болмады. Қайта көріңіз.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={23} color="#222" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Тапсырысты рәсімдеу
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Жеткізу мекенжайы
          </Text>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={openAddressScreen}
          >
            <Ionicons
              name="location-outline"
              size={25}
              color="#53B175"
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                {address || 'Мекенжайды таңдаңыз'}
              </Text>

              <Text style={styles.infoSubtitle}>
                {deliveryInfo?.date
                  ? `Күні: ${deliveryInfo.date} · ${deliveryInfo.slot}`
                  : 'Жеткізу мекенжайын енгізіңіз'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={21}
              color="#999"
            />
          </TouchableOpacity>

          <Text style={styles.label}>
            Байланыс телефоны
          </Text>

          <TextInput
            style={styles.input}
            placeholder="+7 777 000 00 00"
            placeholderTextColor="#AAAAAA"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Төлем әдісі
          </Text>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={openPaymentScreen}
          >
            <Ionicons
              name="card-outline"
              size={25}
              color="#53B175"
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                {PAYMENT_NAMES[paymentSettings.paymentMethod]}
              </Text>

              <Text style={styles.infoSubtitle}>
                Валюта: {paymentSettings.currency}
                {paymentSettings.paymentMethod === 'installment'
                  ? ` · ${paymentSettings.months} ай`
                  : ''}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={21}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Бонустар
          </Text>

          <TouchableOpacity
            style={[
              styles.bonusCard,
              useBonus && styles.selectedBonus,
            ]}
            onPress={toggleBonus}
          >
            <Ionicons
              name="gift-outline"
              size={26}
              color="#53B175"
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Бонусты пайдалану
              </Text>

              <Text style={styles.infoSubtitle}>
                Баланс: {bonusBalance.toLocaleString('kk-KZ')} ₸
              </Text>
            </View>

            <Ionicons
              name={useBonus ? 'checkbox' : 'square-outline'}
              size={23}
              color="#53B175"
            />
          </TouchableOpacity>

          <Text style={styles.bonusHint}>
            Әр тапсырыстан тауарлар құнының 1%-ы бонус ретінде есептеледі.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Тапсырыс қорытындысы
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Тауарлар ({cartItems.length})
              </Text>

              <Text style={styles.summaryValue}>
                {subtotal.toLocaleString('kk-KZ')} ₸
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Жеткізу
              </Text>

              <Text style={styles.summaryValue}>
                {deliveryPrice.toLocaleString('kk-KZ')} ₸
              </Text>
            </View>

            {actualBonusUsed > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.bonusDiscount}>
                  Қолданылған бонус
                </Text>

                <Text style={styles.bonusDiscount}>
                  -{actualBonusUsed.toLocaleString('kk-KZ')} ₸
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Жалпы төлем
              </Text>

              <Text style={styles.totalValue}>
                {finalPrice.toLocaleString('kk-KZ')} ₸
              </Text>
            </View>

            <Text style={styles.earnedBonus}>
              Осы тапсырыстан {bonusEarned} ₸ бонус аласыз
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.orderButton,
            saving && styles.disabledButton,
          ]}
          onPress={placeOrder}
          disabled={saving}
        >
          <Text style={styles.orderButtonText}>
            {saving ? 'Сақталуда...' : 'Тапсырысты растау'}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Бұл оқу жобасының демонстрациялық тапсырыс рәсімдеу экраны.
          Нақты банк төлемі орындалмайды.
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 13,
  },

  section: {
    marginHorizontal: 15,
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },

  infoSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginTop: 17,
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 14,
    color: '#222',
    fontSize: 14,
  },

  bonusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  selectedBonus: {
    borderColor: '#53B175',
    backgroundColor: '#F1FAF3',
  },

  bonusHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 9,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 17,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 7,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#888',
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  bonusDiscount: {
    fontSize: 13,
    color: '#53B175',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  totalValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#53B175',
  },

  earnedBonus: {
    fontSize: 11,
    color: '#53B175',
    marginTop: 12,
  },

  orderButton: {
    backgroundColor: '#53B175',
    marginHorizontal: 15,
    marginTop: 25,
    height: 56,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  footerNote: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    marginHorizontal: 25,
    marginTop: 14,
    marginBottom: 30,
  },
});
