
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const ORDERS_KEY = '@ush_kiz_orders';
const PAYMENT_KEY = '@ush_kiz_payment';
const BONUS_KEY = '@ush_kiz_bonus_balance';
const ADDRESS_KEY = '@ush_kiz_delivery_address';

const PAYMENT_NAMES = {
  cash: 'Қолма-қол ақша',
  card: 'Банк картасы',
  qr: 'QR арқылы төлеу',
  installment: 'Бөліп төлеу',
};

export default function CheckoutScreen({ navigation }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'KZT',
    paymentMethod: 'cash',
    months: 3,
  });

  const [bonusBalance, setBonusBalance] = useState(0);
  const [useBonus, setUseBonus] = useState(false);
  const [saving, setSaving] = useState(false);

  const { cartItems, totalPrice, clearCart } = useCart();

  const deliveryPrice = cartItems.length > 0 ? 500 : 0;
  const finalPrice = totalPrice + deliveryPrice;

  // Төлем, бонус және жеткізу мәліметтерін жүктеу
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const savedPayment = await AsyncStorage.getItem(PAYMENT_KEY);
          const savedBonus = await AsyncStorage.getItem(BONUS_KEY);
          const savedAddress = await AsyncStorage.getItem(ADDRESS_KEY);

          if (savedPayment) {
            const data = JSON.parse(savedPayment);

            setPaymentSettings({
              currency: data.currency || 'KZT',
              paymentMethod: data.paymentMethod || 'cash',
              months: data.months || 3,
            });
          }

          setBonusBalance(
            Math.max(0, Number(savedBonus) || 0)
          );

          if (savedAddress) {
            const data = JSON.parse(savedAddress);

            setDeliveryDetails(data);
            setAddress(data.fullAddress || '');
          }
        } catch (error) {
          console.log('Деректерді жүктеу қатесі:', error);
        }
      };

      loadData();
    }, [])
  );

  const paymentName =
    PAYMENT_NAMES[paymentSettings.paymentMethod] ||
    'Қолма-қол ақша';

  // Бонус сомасы
  const bonusUsed = useBonus
    ? Math.min(bonusBalance, finalPrice)
    : 0;

  const amountToPay = Math.max(0, finalPrice - bonusUsed);

  // Жиналатын бонус
  const bonusEarned = Math.floor(totalPrice * 0.01);

  const monthlyPayment =
    amountToPay / paymentSettings.months;

  // Мекенжай таңдау экраны
  const openAddressScreen = () => {
    navigation.navigate('Address');
  };

  // Төлем экраны
  const openPaymentScreen = () => {
    navigation.navigate('Payment', {
      amount: amountToPay,
    });
  };

  // Бонусты қосу немесе өшіру
  const toggleBonus = () => {
    if (bonusBalance <= 0) {
      Alert.alert(
        'Бонус жоқ',
        'Әзірге жиналған бонусыңыз жоқ.'
      );
      return;
    }

    setUseBonus(previous => !previous);
  };

  // Тапсырысты рәсімдеу
  const order = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        'Себет бос',
        'Алдымен себетке тауар қосыңыз.'
      );
      return;
    }

    if (!deliveryDetails || !address.trim()) {
      Alert.alert(
        'Мекенжай таңдалмаған',
        'Алдымен жеткізу мекенжайын, күнін және уақытын таңдаңыз.',
        [
          {
            text: 'Мекенжай таңдау',
            onPress: openAddressScreen,
          },
          {
            text: 'Бас тарту',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    if (!deliveryDetails.date || !deliveryDetails.slot) {
      Alert.alert(
        'Жеткізу уақытын таңдаңыз',
        'Мекенжай бөлімінде жеткізу күні мен уақытын белгілеңіз.',
        [
          {
            text: 'Таңдау',
            onPress: openAddressScreen,
          },
          {
            text: 'Бас тарту',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        'Ескерту',
        'Телефон нөмірін енгізіңіз.'
      );
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert(
        'Ескерту',
        'Телефон нөмірін дұрыс енгізіңіз.'
      );
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      const savedPayment = await AsyncStorage.getItem(PAYMENT_KEY);

      const currentPayment = savedPayment
        ? JSON.parse(savedPayment)
        : paymentSettings;

      const oldOrders = await AsyncStorage.getItem(ORDERS_KEY);
      const orders = oldOrders ? JSON.parse(oldOrders) : [];

      const latestBonus = await AsyncStorage.getItem(BONUS_KEY);

      const currentBonusBalance = Math.max(
        0,
        Number(latestBonus) || 0
      );

      // Бонус балансын қайта тексеру
      const actualBonusUsed = useBonus
        ? Math.min(currentBonusBalance, finalPrice)
        : 0;

      const actualAmountToPay =
        finalPrice - actualBonusUsed;

      const earned = Math.floor(totalPrice * 0.01);

      const method = currentPayment.paymentMethod || 'cash';
      const months = currentPayment.months || 3;

      const newBonusBalance =
        currentBonusBalance - actualBonusUsed + earned;

      // Жеткізу мәліметтерін жеке сақтау
      const deliveryInfo = {
        ...deliveryDetails,
        fullAddress: address.trim(),
        date: deliveryDetails.date,
        slot: deliveryDetails.slot,
      };

      // Жаңа тапсырыс
      const newOrder = {
        id: Date.now().toString(),

        items: cartItems,

        address: address.trim(),
        phone: phone.trim(),

        deliveryInfo,

        payment: PAYMENT_NAMES[method] || 'Қолма-қол ақша',
        paymentMethod: method,
        currency: currentPayment.currency || 'KZT',

        installmentMonths:
          method === 'installment' ? months : null,

        monthlyPayment:
          method === 'installment'
            ? actualAmountToPay / months
            : null,

        productsPrice: totalPrice,
        deliveryPrice,

        bonusUsed: actualBonusUsed,
        bonusEarned: earned,
        finalPrice: actualAmountToPay,

        createdAt: new Date().toISOString(),
        status: 'Қабылданды',
        deliveryStatus: 'Тапсырыс қабылданды',
      };

      // Тапсырыстарды сақтау
      await AsyncStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([newOrder, ...orders])
      );

      // Бонус балансын сақтау
      await AsyncStorage.setItem(
        BONUS_KEY,
        String(newBonusBalance)
      );

      setBonusBalance(newBonusBalance);
      setUseBonus(false);

      Alert.alert(
        'Тапсырыс расталды!',
        `Төлем сомасы: ${actualAmountToPay.toLocaleString('kk-KZ')} ₸\n` +
        `Қолданылған бонус: ${actualBonusUsed} ₸\n` +
        `Жиналған бонус: ${earned} ₸\n` +
        `Жаңа бонус балансы: ${newBonusBalance} ₸`,
        [
          {
            text: 'Жалғастыру',
            onPress: () => {
              clearCart();
              navigation.navigate('OrderSuccess');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Қате',
        'Тапсырысты сақтау мүмкін болмады. Қайталап көріңіз.'
      );

      console.log('Тапсырысты сақтау қатесі:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Тапсырысты рәсімдеу
      </Text>

      {/* Жеткізу мекенжайы */}
      <Text style={styles.heading}>
        Жеткізу мекенжайы
      </Text>

      <View style={styles.addressCard}>
        <Text style={styles.addressText}>
          {address || 'Мекенжай әлі таңдалмаған'}
        </Text>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={openAddressScreen}
        >
          <Text style={styles.changeButtonText}>
            {address ? 'Өзгерту' : 'Мекенжай таңдау'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Жеткізу күні мен уақыты */}
      {deliveryDetails && (
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>
            🚚 Жеткізу уақыты
          </Text>

          <Text style={styles.deliveryText}>
            📅 Күні: {deliveryDetails.date || 'Таңдалмаған'}
          </Text>

          <Text style={styles.deliveryText}>
            🕒 Уақыты: {deliveryDetails.slot || 'Таңдалмаған'}
          </Text>
        </View>
      )}

      {/* Телефон */}
      <Text style={styles.heading}>
        Телефон нөмірі
      </Text>

      <TextInput
        style={styles.input}
        placeholder="+7 700 000 00 00"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Төлем */}
      <Text style={styles.heading}>
        Төлем әдісі
      </Text>

      <View style={styles.paymentCard}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>
            💳 {paymentName}
          </Text>

          <Text style={styles.paymentDescription}>
            Валюта: {paymentSettings.currency}
          </Text>

          {paymentSettings.paymentMethod === 'installment' && (
            <Text style={styles.paymentDescription}>
              {paymentSettings.months} ай ×{' '}
              {monthlyPayment.toLocaleString('kk-KZ', {
                maximumFractionDigits: 2,
              })} ₸
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={openPaymentScreen}
        >
          <Text style={styles.changeButtonText}>
            Өзгерту
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={openPaymentScreen}
      >
        <Text style={styles.paymentButtonText}>
          + Төлем әдісін таңдау
        </Text>
      </TouchableOpacity>

      {/* Бонустар */}
      <Text style={styles.heading}>
        🎁 Менің бонустарым
      </Text>

      <View style={styles.bonusCard}>
        <Text style={styles.bonusTitle}>
          Бонус балансы
        </Text>

        <Text style={styles.bonusAmount}>
          {bonusBalance.toLocaleString('kk-KZ')} ₸
        </Text>

        <Text style={styles.bonusDescription}>
          Әр тапсырыстан 1% бонус жинайсыз
        </Text>

        <TouchableOpacity
          style={[
            styles.bonusButton,
            useBonus && styles.bonusButtonActive,
          ]}
          onPress={toggleBonus}
        >
          <Text
            style={[
              styles.bonusButtonText,
              useBonus && styles.bonusButtonTextActive,
            ]}
          >
            {useBonus
              ? '✓ Бонус қолданылуда'
              : 'Бонусты қолдану'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Тапсырыс сомасы */}
      <Text style={styles.heading}>
        Тапсырыс сомасы
      </Text>

      <View style={styles.total}>
        <Text style={styles.totalText}>
          Тауарлар бағасы
        </Text>
        <Text style={styles.price}>
          {totalPrice.toLocaleString('kk-KZ')} ₸
        </Text>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalText}>
          Жеткізу ақысы
        </Text>
        <Text style={styles.price}>
          {deliveryPrice.toLocaleString('kk-KZ')} ₸
        </Text>
      </View>

      {bonusUsed > 0 && (
        <View style={styles.total}>
          <Text style={styles.bonusDiscountText}>
            Қолданылған бонус
          </Text>
          <Text style={styles.bonusDiscountText}>
            -{bonusUsed.toLocaleString('kk-KZ')} ₸
          </Text>
        </View>
      )}

      <View style={styles.total}>
        <Text style={styles.totalText}>
          Жалпы төлем
        </Text>
        <Text style={styles.finalPrice}>
          {amountToPay.toLocaleString('kk-KZ')} ₸
        </Text>
      </View>

      <Text style={styles.earnedText}>
        Осы тапсырыстан {bonusEarned.toLocaleString('kk-KZ')} ₸ бонус жинайсыз
      </Text>

      {/* Тапсырысты растау */}
      <TouchableOpacity
        style={[
          styles.button,
          saving && styles.disabledButton,
        ]}
        onPress={order}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Сақталуда...' : 'Тапсырысты растау'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Бонустар осы құрылғыда сақталады.
        Бұл нұсқада нақты банк төлемі орындалмайды.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 25,
    color: '#222222',
  },
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#222222',
  },
  input: {
    backgroundColor: '#F2F3F2',
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
  },
  addressCard: {
    backgroundColor: '#F2F3F2',
    padding: 15,
    borderRadius: 13,
  },
  addressText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 21,
    marginBottom: 12,
  },
  deliveryCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#53B175',
    borderWidth: 1,
    borderRadius: 13,
    padding: 15,
    marginTop: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#287A49',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#53B175',
    borderRadius: 13,
    padding: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#777777',
    marginTop: 5,
  },
  changeButton: {
    backgroundColor: '#53B175',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  paymentButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#53B175',
    marginTop: 12,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bonusCard: {
    backgroundColor: '#FFF8E7',
    borderColor: '#F3C969',
    borderWidth: 1,
    borderRadius: 15,
    padding: 18,
  },
  bonusTitle: {
    fontSize: 15,
    color: '#775A19',
  },
  bonusAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C18A16',
    marginTop: 7,
  },
  bonusDescription: {
    fontSize: 13,
    color: '#92742E',
    marginTop: 5,
  },
  bonusButton: {
    borderWidth: 1,
    borderColor: '#C18A16',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    marginTop: 15,
  },
  bonusButtonActive: {
    backgroundColor: '#C18A16',
  },
  bonusButtonText: {
    color: '#A47716',
    fontWeight: 'bold',
  },
  bonusButtonTextActive: {
    color: '#FFFFFF',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  finalPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#53B175',
  },
  bonusDiscountText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C18A16',
  },
  earnedText: {
    color: '#53B175',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#53B175',
    padding: 18,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 35,
  },
});
