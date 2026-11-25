
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_KEY = '@ush_kiz_orders';

const STEPS = [
  {
    title: 'Тапсырыс қабылданды',
    description: 'Тапсырысыңыз жүйеге қабылданды.',
    icon: '📋',
  },
  {
    title: 'Тапсырыс дайындалуда',
    description: 'Тауарлар жинақталып жатыр.',
    icon: '🛒',
  },
  {
    title: 'Курьерге берілді',
    description: 'Тапсырыс курьерге тапсырылды.',
    icon: '📦',
  },
  {
    title: 'Жолда',
    description: 'Тапсырысыңыз жеткізу жолында.',
    icon: '🚚',
  },
  {
    title: 'Жеткізілді',
    description: 'Тапсырысыңыз жеткізілді.',
    icon: '🏠',
  },
];

export default function DeliveryTrackingScreen({ route, navigation }) {
  const passedOrder = route?.params?.order;
  const passedAddress = route?.params?.address;

  const [order, setOrder] = useState(passedOrder || null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Тапсырыс деректерін жүктеу
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem(ORDERS_KEY);
        const orders = savedOrders
          ? JSON.parse(savedOrders)
          : [];

        let selectedOrder = passedOrder;

        if (passedOrder?.id) {
          const foundOrder = orders.find(
            item => item.id === passedOrder.id
          );

          if (foundOrder) {
            selectedOrder = foundOrder;
          }
        }

        if (selectedOrder) {
          setOrder(selectedOrder);

          const savedStep = Number(
            selectedOrder.deliveryStep ?? 0
          );

          setCurrentStep(
            Math.max(0, Math.min(savedStep, STEPS.length - 1))
          );
        }
      } catch (error) {
        console.log('Тапсырысты жүктеу қатесі:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [passedOrder?.id]);

  // Жеткізу күйін сақтау
  const saveStep = async (newStep) => {
    if (!order?.id || saving) return;

    setSaving(true);

    try {
      const savedOrders = await AsyncStorage.getItem(ORDERS_KEY);
      const orders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      const updatedOrders = orders.map(item => {
        if (item.id === order.id) {
          return {
            ...item,
            deliveryStep: newStep,
            deliveryStatus: STEPS[newStep].title,
            status: STEPS[newStep].title,
          };
        }

        return item;
      });

      await AsyncStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(updatedOrders)
      );

      const updatedOrder = {
        ...order,
        deliveryStep: newStep,
        deliveryStatus: STEPS[newStep].title,
        status: STEPS[newStep].title,
      };

      setOrder(updatedOrder);
      setCurrentStep(newStep);
    } catch (error) {
      Alert.alert(
        'Қате',
        'Жеткізу күйін сақтау мүмкін болмады.'
      );

      console.log('Күйді сақтау қатесі:', error);
    } finally {
      setSaving(false);
    }
  };

  // Келесі кезең
  const nextStep = () => {
    if (currentStep >= STEPS.length - 1) {
      return;
    }

    const next = currentStep + 1;

    Alert.alert(
      'Жеткізу күйін өзгерту',
      `Келесі кезең: ${STEPS[next].title}`,
      [
        {
          text: 'Бас тарту',
          style: 'cancel',
        },
        {
          text: 'Растау',
          onPress: () => saveStep(next),
        },
      ]
    );
  };

  // Мекенжай
  const deliveryInfo =
    order?.deliveryInfo || passedAddress || {};

  const addressText =
    deliveryInfo.fullAddress ||
    order?.address ||
    'Мекенжай көрсетілмеген';

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Жүктелуде...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Тапсырыс табылмады.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>
            Артқа қайту
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          ← Артқа
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Жеткізуді бақылау
      </Text>

      <View style={styles.orderCard}>
        <Text style={styles.cardTitle}>
          Тапсырыс ақпараты
        </Text>

        <Text style={styles.infoText}>
          Тапсырыс №: {order.id}
        </Text>

        <Text style={styles.infoText}>
          Жалпы төлем: {Number(order.finalPrice || 0).toLocaleString('kk-KZ')} ₸
        </Text>

        <Text style={styles.infoText}>
          Телефон: {order.phone || 'Көрсетілмеген'}
        </Text>
      </View>

      <View style={styles.orderCard}>
        <Text style={styles.cardTitle}>
          📍 Жеткізу мекенжайы
        </Text>

        <Text style={styles.addressText}>
          {addressText}
        </Text>

        <Text style={styles.infoText}>
          📅 Күні: {deliveryInfo.date || 'Көрсетілмеген'}
        </Text>

        <Text style={styles.infoText}>
          🕒 Уақыты: {deliveryInfo.slot || 'Көрсетілмеген'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Жеткізу кезеңдері
      </Text>

      <View style={styles.timeline}>
        {STEPS.map((step, index) => {
          const completed = index <= currentStep;
          const active = index === currentStep;

          return (
            <View
              key={index}
              style={styles.stepRow}
            >
              <View style={styles.stepIconColumn}>
                <View
                  style={[
                    styles.stepCircle,
                    completed && styles.stepCircleActive,
                  ]}
                >
                  <Text style={styles.stepIcon}>
                    {step.icon}
                  </Text>
                </View>

                {index !== STEPS.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      index < currentStep && styles.lineActive,
                    ]}
                  />
                )}
              </View>

              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepTitle,
                    completed && styles.stepTitleActive,
                  ]}
                >
                  {step.title}
                </Text>

                <Text style={styles.stepDescription}>
                  {step.description}
                </Text>

                {active && (
                  <Text style={styles.currentLabel}>
                    Қазіргі кезең
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>
          Қазіргі тапсырыс күйі
        </Text>

        <Text style={styles.statusTitle}>
          {STEPS[currentStep].title}
        </Text>
      </View>

      {currentStep < STEPS.length - 1 ? (
        <TouchableOpacity
          style={[
            styles.button,
            saving && styles.disabledButton,
          ]}
          onPress={nextStep}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Сақталуда...' : 'Келесі кезеңге өту'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.completedCard}>
          <Text style={styles.completedText}>
            ✓ Тапсырыс жеткізілді!
          </Text>
        </View>
      )}

      <Text style={styles.footer}>
        Бұл — оқу жобасына арналған демонстрациялық
        жеткізу бақылауы. Күйді батырма арқылы қолмен
        өзгертесіз. Нақты курьердің GPS орны көрсетілмейді.
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 20,
    marginBottom: 20,
  },
  backText: {
    color: '#53B175',
    fontSize: 16,
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: '#F5F6F5',
    padding: 17,
    borderRadius: 14,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555555',
    marginTop: 7,
  },
  addressText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
    color: '#222222',
  },
  timeline: {
    paddingLeft: 5,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 90,
  },
  stepIconColumn: {
    alignItems: 'center',
    width: 48,
  },
  stepCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#DDF5E5',
    borderWidth: 1,
    borderColor: '#53B175',
  },
  stepIcon: {
    fontSize: 20,
  },
  line: {
    width: 3,
    height: 48,
    backgroundColor: '#E5E5E5',
  },
  lineActive: {
    backgroundColor: '#53B175',
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 3,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#999999',
  },
  stepTitleActive: {
    color: '#222222',
  },
  stepDescription: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  currentLabel: {
    color: '#53B175',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statusCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 13,
    padding: 17,
    marginTop: 15,
  },
  statusLabel: {
    color: '#777777',
    fontSize: 13,
  },
  statusTitle: {
    color: '#287A49',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 7,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 17,
    borderRadius: 13,
    marginTop: 25,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completedCard: {
    backgroundColor: '#DDF5E5',
    padding: 18,
    borderRadius: 13,
    marginTop: 25,
  },
  completedText: {
    color: '#287A49',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 17,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#53B175',
    padding: 14,
    borderRadius: 10,
  },
  footer: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 35,
  },
});
