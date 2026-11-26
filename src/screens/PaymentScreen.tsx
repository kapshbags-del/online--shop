
import React, { useState, useCallback } from 'react';

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

const PAYMENT_KEY = '@ush_kiz_payment';

const CURRENCIES = [
  { code: 'KZT', name: 'Қазақстан теңгесі', symbol: '₸', rate: 1 },
  { code: 'USD', name: 'АҚШ доллары', symbol: '$', rate: 0.0020 },
  { code: 'CNY', name: 'Қытай юані', symbol: '¥', rate: 0.0144 },
  { code: 'EUR', name: 'Еуро', symbol: '€', rate: 0.00185 },
  { code: 'RUB', name: 'Ресей рублі', symbol: '₽', rate: 0.18 },
  { code: 'KRW', name: 'Оңтүстік Корея воны', symbol: '₩', rate: 2.75 },
];

const PAYMENT_METHODS = [
  {
    id: 'cash',
    title: 'Қолма-қол ақша',
    subtitle: 'Жеткізу кезінде төлеу',
    icon: 'cash-outline',
  },
  {
    id: 'card',
    title: 'Банк картасы',
    subtitle: 'Карта арқылы төлеу (демо)',
    icon: 'card-outline',
  },
  {
    id: 'qr',
    title: 'QR төлем',
    subtitle: 'QR арқылы төлеу (демо)',
    icon: 'qr-code-outline',
  },
  {
    id: 'installment',
    title: 'Бөліп төлеу',
    subtitle: 'Төлемді бірнеше айға бөлу (демо)',
    icon: 'calendar-outline',
  },
];

export default function PaymentScreen({ navigation, route }: any) {
  const [currency, setCurrency] = useState('KZT');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [months, setMonths] = useState(3);
  const [saving, setSaving] = useState(false);

  const amount = Number(route?.params?.amount || 0);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(PAYMENT_KEY);

      if (saved) {
        const settings = JSON.parse(saved);

        setCurrency(settings.currency || 'KZT');
        setPaymentMethod(settings.paymentMethod || 'cash');
        setMonths(settings.months || 3);
      }
    } catch (error) {
      console.log('Төлем баптауларын жүктеу қатесі:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const selectedCurrency =
    CURRENCIES.find((item) => item.code === currency) ||
    CURRENCIES[0];

  const convertedAmount = amount * selectedCurrency.rate;

  const saveSettings = async () => {
    const settings = {
      currency,
      paymentMethod,
      months,
    };

    try {
      setSaving(true);

      await AsyncStorage.setItem(
        PAYMENT_KEY,
        JSON.stringify(settings)
      );

      Alert.alert(
        'Сәтті сақталды',
        'Төлем баптаулары сақталды',
        [
          {
            text: 'Жақсы',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Қате', 'Баптауларды сақтау мүмкін болмады');
    } finally {
      setSaving(false);
    }
  };

  const selectMethod = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={23} color="#222" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Төлем әдістері
          </Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>
            Тапсырыс сомасы
          </Text>

          <Text style={styles.amountValue}>
            {amount.toLocaleString('kk-KZ')} ₸
          </Text>

          <Text style={styles.convertedAmount}>
            Таңдалған валюта: {convertedAmount.toLocaleString(
              'en-US',
              { maximumFractionDigits: 2 }
            )} {selectedCurrency.symbol}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Валютаны таңдаңыз
          </Text>

          <View style={styles.currencyGrid}>
            {CURRENCIES.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.currencyCard,
                  currency === item.code && styles.selectedCurrency,
                ]}
                onPress={() => setCurrency(item.code)}
              >
                <Text
                  style={[
                    styles.currencyCode,
                    currency === item.code && styles.selectedText,
                  ]}
                >
                  {item.code}
                </Text>

                <Text
                  style={[
                    styles.currencyName,
                    currency === item.code && styles.selectedText,
                  ]}
                >
                  {item.name}
                </Text>

                {currency === item.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color="#FFFFFF"
                    style={styles.currencyCheck}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.note}>
            Валюта тек соманы көрсету үшін қолданылады.
            Нақты төлем теңгемен есептеледі.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Төлем тәсілі
          </Text>

          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                paymentMethod === method.id && styles.selectedMethod,
              ]}
              onPress={() => selectMethod(method.id)}
            >
              <View style={styles.methodIcon}>
                <Ionicons
                  name={method.icon as any}
                  size={25}
                  color="#53B175"
                />
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>
                  {method.title}
                </Text>

                <Text style={styles.methodSubtitle}>
                  {method.subtitle}
                </Text>
              </View>

              <Ionicons
                name={
                  paymentMethod === method.id
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={22}
                color={
                  paymentMethod === method.id
                    ? '#53B175'
                    : '#BBBBBB'
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        {paymentMethod === 'installment' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Бөліп төлеу мерзімі
            </Text>

            <View style={styles.monthsRow}>
              {[3, 6, 9, 12].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.monthButton,
                    months === value && styles.selectedMonth,
                  ]}
                  onPress={() => setMonths(value)}
                >
                  <Text
                    style={[
                      styles.monthText,
                      months === value && styles.selectedText,
                    ]}
                  >
                    {value} ай
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.installmentCard}>
              <Text style={styles.installmentLabel}>
                Ай сайынғы есептік төлем
              </Text>

              <Text style={styles.installmentValue}>
                {(amount / months).toLocaleString('kk-KZ', {
                  maximumFractionDigits: 0,
                })} ₸
              </Text>
            </View>

            <Text style={styles.note}>
              Бұл тек демонстрациялық есеп. Нақты бөліп төлеу
              банк немесе төлем провайдері арқылы рәсімделмейді.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={saveSettings}
          disabled={saving}
        >
          <Ionicons name="save-outline" size={20} color="#FFFFFF" />

          <Text style={styles.saveButtonText}>
            {saving ? 'Сақталуда...' : 'Баптауларды сақтау'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Бұл оқу жобасының демонстрациялық төлем экраны.
          Банк картасынан нақты ақша алынбайды.
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
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 14,
  },

  amountCard: {
    backgroundColor: '#53B175',
    marginHorizontal: 15,
    padding: 22,
    borderRadius: 17,
    alignItems: 'center',
  },

  amountLabel: {
    color: '#E8F7EC',
    fontSize: 13,
  },

  amountValue: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: 'bold',
    marginTop: 8,
  },

  convertedAmount: {
    color: '#E8F7EC',
    fontSize: 12,
    marginTop: 9,
  },

  section: {
    marginHorizontal: 15,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
  },

  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  currencyCard: {
    width: '31%',
    minHeight: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
    justifyContent: 'center',
  },

  selectedCurrency: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },

  currencyCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },

  currencyName: {
    fontSize: 9,
    color: '#888',
    marginTop: 5,
  },

  selectedText: {
    color: '#FFFFFF',
  },

  currencyCheck: {
    position: 'absolute',
    right: 5,
    top: 5,
  },

  note: {
    fontSize: 10,
    color: '#999',
    lineHeight: 16,
    marginTop: 10,
  },

  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  selectedMethod: {
    borderColor: '#53B175',
    backgroundColor: '#F1FAF3',
  },

  methodIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EAF6EC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },

  methodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },

  methodSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },

  monthsRow: {
    flexDirection: 'row',
    gap: 9,
  },

  monthButton: {
    flex: 1,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  selectedMonth: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },

  monthText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
  },

  installmentCard: {
    backgroundColor: '#EAF6EC',
    borderRadius: 12,
    padding: 17,
    marginTop: 15,
  },

  installmentLabel: {
    color: '#777',
    fontSize: 12,
  },

  installmentValue: {
    color: '#53B175',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 7,
  },

  saveButton: {
    backgroundColor: '#53B175',
    marginHorizontal: 15,
    marginTop: 30,
    height: 55,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  footerNote: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom: 30,
  },
});
