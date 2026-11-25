
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYMENT_KEY = '@ush_kiz_payment';

const CURRENCIES = [
  { code: 'KZT', name: 'Теңге', flag: '🇰🇿' },
  { code: 'USD', name: 'Доллар', flag: '🇺🇸' },
  { code: 'CNY', name: 'Юань', flag: '🇨🇳' },
  { code: 'EUR', name: 'Еуро', flag: '🇪🇺' },
  { code: 'RUB', name: 'Рубль', flag: '🇷🇺' },
  { code: 'KRW', name: 'Вон', flag: '🇰🇷' },
];

const PAYMENT_METHODS = [
  {
    id: 'cash',
    title: 'Қолма-қол ақша',
    description: 'Жеткізу кезінде төлеу',
    icon: '💵',
  },
  {
    id: 'card',
    title: 'Банк картасы',
    description: 'Visa немесе Mastercard',
    icon: '💳',
  },
  {
    id: 'qr',
    title: 'QR арқылы төлеу',
    description: 'QR төлем (демо)',
    icon: '📱',
  },
  {
    id: 'installment',
    title: 'Бөліп төлеу',
    description: 'Ай сайынғы төлемді есептеу (демо)',
    icon: '📅',
  },
];

export default function PaymentScreen({ navigation, route }) {
  const amountKZT = Number(route?.params?.amount) || 10000;
  const hasRealAmount = Number(route?.params?.amount) > 0;

  const [currency, setCurrency] = useState('KZT');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [months, setMonths] = useState(3);
  const [rates, setRates] = useState({ KZT: 1 });
  const [loading, setLoading] = useState(true);
  const [rateError, setRateError] = useState(false);

  // Сақталған төлем параметрлерін жүктеу
  useEffect(() => {
    loadPaymentSettings();
    loadExchangeRates();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(PAYMENT_KEY);

      if (saved) {
        const data = JSON.parse(saved);
        setCurrency(data.currency || 'KZT');
        setPaymentMethod(data.paymentMethod || 'cash');
        setMonths(data.months || 3);
      }
    } catch (error) {
      console.log('Төлем мәліметтерін жүктеу қатесі:', error);
    }
  };

  // KZT-ден басқа валютаға айырбастау
  const loadExchangeRates = async () => {
    try {
      const response = await fetch(
        'https://open.er-api.com/v6/latest/KZT'
      );

      const data = await response.json();

      if (data.result === 'success' && data.rates) {
        setRates(data.rates);
        setRateError(false);
      } else {
        setRateError(true);
      }
    } catch (error) {
      setRateError(true);
    } finally {
      setLoading(false);
    }
  };

  const convertedAmount = rates[currency]
    ? amountKZT * rates[currency]
    : null;

  const formatMoney = (amount, code) => {
    if (amount === null || amount === undefined) {
      return 'Курс қолжетімсіз';
    }

    return `${amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })} ${code}`;
  };

  // Төлем параметрлерін сақтау
  const handleSave = async () => {
    try {
      const settings = {
        currency,
        paymentMethod,
        months,
      };

      await AsyncStorage.setItem(
        PAYMENT_KEY,
        JSON.stringify(settings)
      );

      Alert.alert(
        'Сәтті сақталды',
        'Төлем параметрлері сақталды.',
        [
          {
            text: 'Жақсы',
            onPress: () => {
              if (navigation?.canGoBack()) {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Қате', 'Мәліметтерді сақтау мүмкін болмады.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Тақырып */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Төлем әдістері</Text>

          <View style={{ width: 36 }} />
        </View>

        {/* Төлем сомасы */}
        <View style={styles.amountCard}>
          <Text style={styles.cardLabel}>
            {hasRealAmount ? 'Тапсырыс сомасы' : 'Есептеу мысалы'}
          </Text>

          <Text style={styles.mainAmount}>
            {formatMoney(amountKZT, 'KZT')}
          </Text>

          <Text style={styles.smallText}>
            Нақты төлем теңгемен есептеледі
          </Text>
        </View>

        {/* Валюта таңдау */}
        <Text style={styles.sectionTitle}>
          Валютаны таңдаңыз
        </Text>

        <View style={styles.currencyGrid}>
          {CURRENCIES.map((item) => {
            const active = currency === item.code;

            return (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.currencyCard,
                  active && styles.activeCurrency,
                ]}
                onPress={() => setCurrency(item.code)}
              >
                <Text style={styles.currencyFlag}>
                  {item.flag}
                </Text>

                <Text
                  style={[
                    styles.currencyCode,
                    active && styles.activeText,
                  ]}
                >
                  {item.code}
                </Text>

                <Text style={styles.currencyName}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Айырбастау нәтижесі */}
        <View style={styles.exchangeCard}>
          <Text style={styles.exchangeTitle}>
            Валюта бойынша есептеу
          </Text>

          {loading ? (
            <ActivityIndicator color="#22A852" />
          ) : (
            <>
              <Text style={styles.exchangeAmount}>
                {formatMoney(convertedAmount, currency)}
              </Text>

              {rateError ? (
                <Text style={styles.errorText}>
                  Курс жүктелмеді. Интернетті тексеріңіз.
                </Text>
              ) : (
                <Text style={styles.smallText}>
                  Валюта бағамы интернет арқылы алынады.
                </Text>
              )}
            </>
          )}
        </View>

        {/* Төлем әдісі */}
        <Text style={styles.sectionTitle}>
          Төлем әдісін таңдаңыз
        </Text>

        {PAYMENT_METHODS.map((item) => {
          const active = paymentMethod === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.methodCard,
                active && styles.activeMethod,
              ]}
              onPress={() => setPaymentMethod(item.id)}
            >
              <Text style={styles.methodIcon}>
                {item.icon}
              </Text>

              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>
                  {item.title}
                </Text>

                <Text style={styles.methodDescription}>
                  {item.description}
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  active && styles.radioActive,
                ]}
              >
                {active && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Бөліп төлеу */}
        {paymentMethod === 'installment' && (
          <View style={styles.installmentCard}>
            <Text style={styles.sectionTitle}>
              Бөліп төлеу мерзімі
            </Text>

            <View style={styles.monthsRow}>
              {[3, 6, 12].map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthButton,
                    months === month && styles.monthActive,
                  ]}
                  onPress={() => setMonths(month)}
                >
                  <Text
                    style={[
                      styles.monthText,
                      months === month && styles.monthTextActive,
                    ]}
                  >
                    {month} ай
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.installmentAmount}>
              Айына: {formatMoney(amountKZT / months, 'KZT')}
            </Text>

            <Text style={styles.smallText}>
              Бұл тек оқу жобасына арналған есептеу.
              Нақты бөліп төлеу қызметі қосылмаған.
            </Text>
          </View>
        )}

        {/* Сақтау */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            Төлем параметрлерін сақтау
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Қауіпсіздік: карта нөмірі мен CVV коды бұл
          қосымшада сақталмайды. Нақты төлем әзірше қосылмаған.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  container: {
    padding: 16,
    paddingBottom: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 25,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },
  amountCard: {
    backgroundColor: '#22A852',
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
  },
  cardLabel: {
    color: '#E8F8ED',
    fontSize: 14,
  },
  mainAmount: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    marginVertical: 8,
  },
  smallText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 7,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 15,
  },
  currencyCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 13,
    padding: 12,
    alignItems: 'center',
  },
  activeCurrency: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22A852',
  },
  currencyFlag: {
    fontSize: 24,
    marginBottom: 5,
  },
  currencyCode: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  currencyName: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 3,
  },
  activeText: {
    color: '#15803D',
  },
  exchangeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exchangeTitle: {
    color: '#6B7280',
    fontSize: 13,
  },
  exchangeAmount: {
    fontSize: 23,
    fontWeight: '800',
    color: '#22A852',
    marginTop: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 8,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMethod: {
    borderColor: '#22A852',
    backgroundColor: '#F0FDF4',
  },
  methodIcon: {
    fontSize: 27,
    marginRight: 13,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  methodDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#22A852',
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22A852',
  },
  installmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 15,
  },
  monthsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  monthButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  monthActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22A852',
  },
  monthText: {
    fontWeight: '700',
    color: '#374151',
  },
  monthTextActive: {
    color: '#15803D',
  },
  installmentAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#22A852',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#22A852',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 15,
  },
});
