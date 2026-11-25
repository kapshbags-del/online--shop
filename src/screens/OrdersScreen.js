
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ORDERS_KEY = '@ush_kiz_orders';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  // Тапсырыстарды жүктеу
  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem(ORDERS_KEY);

      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    } catch (error) {
      console.log('Тапсырыстарды оқу қатесі:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  // Ақша форматы
  const formatMoney = (amount, currency = 'KZT') => {
    return `${Number(amount || 0).toLocaleString('kk-KZ', {
      maximumFractionDigits: 2,
    })} ${currency}`;
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Менің тапсырыстарым</Text>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛍️</Text>

          <Text style={styles.emptyTitle}>
            Әзірге тапсырыс жоқ
          </Text>

          <Text style={styles.emptyText}>
            Сатып алған тауарларың осы жерде көрсетіледі.
          </Text>
        </View>
      ) : (
        orders.map((orderItem) => {
          const currency = orderItem.currency || 'KZT';

          return (
            <View key={orderItem.id} style={styles.card}>
              {/* Тапсырыс нөмірі */}
              <View style={styles.cardHeader}>
                <Text style={styles.orderNumber}>
                  Тапсырыс №{String(orderItem.id).slice(-6)}
                </Text>

                <Text style={styles.status}>
                  {orderItem.status || 'Қабылданды'}
                </Text>
              </View>

              <Text style={styles.date}>
                {orderItem.createdAt
                  ? new Date(orderItem.createdAt).toLocaleString('kk-KZ')
                  : 'Күні көрсетілмеген'}
              </Text>

              <View style={styles.divider} />

              {/* Тауарлар */}
              <Text style={styles.sectionTitle}>Тауарлар:</Text>

              {(orderItem.items || []).map((item, index) => (
                <View
                  key={`${item.id}-${index}`}
                  style={styles.product}
                >
                  <Text style={styles.productName}>
                    {item.name} × {item.quantity}
                  </Text>

                  <Text style={styles.productPrice}>
                    {formatMoney(
                      Number(item.price) * Number(item.quantity || 1)
                    )}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              {/* Жеткізу ақпараты */}
              <Text style={styles.sectionTitle}>
                Жеткізу ақпараты
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Мекенжай:</Text>

                <Text style={styles.infoValue}>
                  {orderItem.address || 'Көрсетілмеген'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Телефон:</Text>

                <Text style={styles.infoValue}>
                  {orderItem.phone || 'Көрсетілмеген'}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Төлем ақпараты */}
              <Text style={styles.sectionTitle}>
                Төлем ақпараты
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Төлем әдісі:
                </Text>

                <Text style={styles.infoValue}>
                  {orderItem.payment || 'Қолма-қол ақша'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Таңдалған валюта:
                </Text>

                <Text style={styles.infoValue}>
                  {currency}
                </Text>
              </View>

              {orderItem.paymentMethod === 'installment' && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                      Бөліп төлеу:
                    </Text>

                    <Text style={styles.infoValue}>
                      {orderItem.installmentMonths || 3} ай
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                      Ай сайын:
                    </Text>

                    <Text style={styles.infoValue}>
                      {formatMoney(orderItem.monthlyPayment)}
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.divider} />

              {/* Сома */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Тауарлар бағасы
                </Text>

                <Text style={styles.price}>
                  {formatMoney(orderItem.productsPrice)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Жеткізу ақысы
                </Text>

                <Text style={styles.price}>
                  {formatMoney(orderItem.deliveryPrice)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Жалпы сома
                </Text>

                <Text style={styles.totalPrice}>
                  {formatMoney(orderItem.finalPrice)}
                </Text>
              </View>

              <Text style={styles.currencyNote}>
                Төлем сомасы теңгемен есептелген.
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 18,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#222222',
  },

  empty: {
    alignItems: 'center',
    marginTop: 90,
    padding: 20,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },

  status: {
    color: '#53B175',
    fontWeight: 'bold',
    fontSize: 13,
  },

  date: {
    color: '#888888',
    fontSize: 12,
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 13,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222222',
  },

  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  productName: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    color: '#333333',
  },

  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  infoLabel: {
    color: '#777777',
    fontSize: 14,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
    color: '#333333',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },

  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#53B175',
  },

  currencyNote: {
    color: '#999999',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 10,
  },
});
