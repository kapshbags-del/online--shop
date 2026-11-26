
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

const ORDERS_KEY = '@ush_kiz_orders';
const ADDRESS_KEY = '@ush_kiz_delivery_address';

type OrderItem = {
  id: number | string;
  name: string;
  price: number | string;
  image?: string;
  quantity?: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  address?: string;
  deliveryInfo?: any;
  phone?: string;
  payment?: string;
  paymentMethod?: string;
  productsPrice?: number;
  deliveryPrice?: number;
  finalPrice?: number;
  createdAt?: string;
  status?: string;
};

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedAddress, setSavedAddress] = useState<any>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const savedOrders = await AsyncStorage.getItem(ORDERS_KEY);
      const address = await AsyncStorage.getItem(ADDRESS_KEY);

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders([]);
      }

      if (address) {
        setSavedAddress(JSON.parse(address));
      }
    } catch (error) {
      console.log('Тапсырыстарды жүктеу қатесі:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const formatPrice = (price: number | string | undefined) => {
    const value = Number(
      String(price || 0).replace(/[^\d.]/g, '')
    );

    return `${value.toLocaleString('kk-KZ')} ₸`;
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Күні көрсетілмеген';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Күні көрсетілмеген';
    }

    return parsedDate.toLocaleString('kk-KZ');
  };

  const getAddress = (order: Order) => {
    const info = order.deliveryInfo;

    if (info?.fullAddress) {
      return info.fullAddress;
    }

    if (typeof order.address === 'string' && order.address) {
      return order.address;
    }

    if (info?.street) {
      return `${info.street}, ${info.houseNumber || ''}`;
    }

    return 'Мекенжай көрсетілмеген';
  };

  const openTracking = (order: Order) => {
    navigation.navigate('DeliveryTracking', {
      order,
      address: order.deliveryInfo || savedAddress,
    });
  };

  const clearOrders = () => {
    if (orders.length === 0) return;

    Alert.alert(
      'Тапсырыстар тарихы',
      'Барлық тапсырыстар тарихын өшіргіңіз келе ме?',
      [
        {
          text: 'Болдырмау',
          style: 'cancel',
        },
        {
          text: 'Өшіру',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(ORDERS_KEY);
              setOrders([]);
              Alert.alert('Дайын', 'Тапсырыстар тарихы тазартылды');
            } catch (error) {
              Alert.alert('Қате', 'Тарихты өшіру мүмкін болмады');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Менің тапсырыстарым
          </Text>

          <Text style={styles.headerSubtitle}>
            Тапсырыстарыңыздың тарихы
          </Text>
        </View>

        {orders.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearOrders}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#E74C3C"
            />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyDescription}>
            Жүктелуде...
          </Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>

          <Text style={styles.emptyTitle}>
            Әзірге тапсырыс жоқ
          </Text>

          <Text style={styles.emptyDescription}>
            Сатып алған тауарларыңыз осы жерде көрсетіледі.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Main', {
              screen: 'Products',
            })}
          >
            <Text style={styles.shopButtonText}>
              Тауарларды қарау
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          <Text style={styles.countText}>
            Барлығы: {orders.length} тапсырыс
          </Text>

          {orders.map((order, index) => (
            <View
              key={order.id || String(index)}
              style={styles.orderCard}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>
                    Тапсырыс №{order.id}
                  </Text>

                  <Text style={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {order.status || 'Қабылданды'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>
                Тауарлар
              </Text>

              {order.items?.map((item, itemIndex) => {
                const price = Number(
                  String(item.price).replace(/[^\d.]/g, '')
                );

                const quantity = item.quantity || 1;

                return (
                  <View
                    key={`${item.id}-${itemIndex}`}
                    style={styles.productRow}
                  >
                    <Text style={styles.productEmoji}>
                      {item.image || '🛒'}
                    </Text>

                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {item.name}
                      </Text>

                      <Text style={styles.productQuantity}>
                        Саны: {quantity}
                      </Text>
                    </View>

                    <Text style={styles.productPrice}>
                      {formatPrice(price * quantity)}
                    </Text>
                  </View>
                );
              })}

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={19}
                  color="#53B175"
                />

                <Text style={styles.infoText}>
                  {getAddress(order)}
                </Text>
              </View>

              {order.phone ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color="#53B175"
                  />

                  <Text style={styles.infoText}>
                    {order.phone}
                  </Text>
                </View>
              ) : null}

              <View style={styles.infoRow}>
                <Ionicons
                  name="card-outline"
                  size={18}
                  color="#53B175"
                />

                <Text style={styles.infoText}>
                  {order.payment || 'Төлем әдісі көрсетілмеген'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Төленетін сома
                </Text>

                <Text style={styles.totalPrice}>
                  {formatPrice(order.finalPrice)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.trackingButton}
                onPress={() => openTracking(order)}
              >
                <Ionicons
                  name="location"
                  size={19}
                  color="#FFFFFF"
                />

                <Text style={styles.trackingButtonText}>
                  Жеткізуді бақылау
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },

  clearButton: {
    width: 42,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 25,
  },

  countText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  orderDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },

  statusBadge: {
    backgroundColor: '#EAF6EC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
  },

  statusText: {
    color: '#53B175',
    fontSize: 11,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 13,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },

  productEmoji: {
    fontSize: 28,
    width: 42,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  productQuantity: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },

  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 9,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#53B175',
  },

  trackingButton: {
    backgroundColor: '#53B175',
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  trackingButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 75,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
  },

  emptyDescription: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  shopButton: {
    backgroundColor: '#53B175',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
  },

  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
