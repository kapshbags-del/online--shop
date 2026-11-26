
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OrderSuccessScreen({ navigation, route }: any) {
  const order = route?.params?.order;

  const orderNumber = order?.id
    ? `#${String(order.id).slice(-8)}`
    : '#00000000';

  const totalPrice = Number(order?.finalPrice || 0);

  const deliveryDate = order?.deliveryInfo?.date;
  const deliverySlot = order?.deliveryInfo?.slot;

  const goToOrders = () => {
    navigation.replace('Orders');
  };

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: {
            screen: 'Home',
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successIcon}>
          <Ionicons
            name="checkmark"
            size={65}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>
          Тапсырыс қабылданды!
        </Text>

        <Text style={styles.subtitle}>
          Сатып алғаныңызға рақмет!
          Тапсырысыңыз сәтті сақталды.
        </Text>

        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>
            Тапсырыс ақпараты
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Тапсырыс нөмірі
            </Text>

            <Text style={styles.value}>
              {orderNumber}
            </Text>
          </View>

          <View style={styles.line} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Тапсырыс күйі
            </Text>

            <Text style={styles.status}>
              Қабылданды
            </Text>
          </View>

          <View style={styles.line} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Төлем әдісі
            </Text>

            <Text style={styles.value}>
              {order?.payment || 'Қолма-қол ақша'}
            </Text>
          </View>

          <View style={styles.line} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Тауар саны
            </Text>

            <Text style={styles.value}>
              {order?.items?.length || 0}
            </Text>
          </View>

          <View style={styles.line} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Жалпы сома
            </Text>

            <Text style={styles.total}>
              {totalPrice.toLocaleString('kk-KZ')} ₸
            </Text>
          </View>
        </View>

        {deliveryDate && (
          <View style={styles.deliveryCard}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#53B175"
            />

            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>
                Жеткізу уақыты
              </Text>

              <Text style={styles.deliverySubtitle}>
                {deliveryDate} · {deliverySlot || 'Уақыты таңдалмаған'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#53B175"
          />

          <Text style={styles.noteText}>
            Тапсырыстың мәліметтерін «Менің тапсырыстарым»
            бөлімінен көре аласыз.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={goToOrders}
        >
          <Text style={styles.primaryButtonText}>
            Менің тапсырыстарым
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={goToHome}
        >
          <Text style={styles.secondaryButtonText}>
            Басты бетке оралу
          </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 35,
  },

  successIcon: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: '#53B175',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 30,
  },

  orderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },

  label: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },

  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },

  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#53B175',
  },

  total: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#53B175',
  },

  line: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  deliveryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  deliveryText: {
    marginLeft: 12,
    flex: 1,
  },

  deliveryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },

  deliverySubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 5,
  },

  noteCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF7EF',
    borderRadius: 12,
    padding: 13,
    marginTop: 15,
  },

  noteText: {
    flex: 1,
    fontSize: 11,
    color: '#55745C',
    marginLeft: 9,
    lineHeight: 17,
  },

  primaryButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#53B175',
    borderRadius: 13,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  secondaryButton: {
    width: '100%',
    height: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#53B175',
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#53B175',
  },
});
