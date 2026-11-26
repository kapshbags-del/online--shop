
import React from 'react';

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

import { useCart, CartProduct } from '../context/CartContext';

export default function CartScreen({ navigation }: any) {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  const deliveryPrice = cartItems.length > 0 ? 500 : 0;
  const finalPrice = totalPrice + deliveryPrice;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Себет бос', 'Алдымен тауар таңдаңыз');
      return;
    }

    navigation.navigate('Checkout');
  };

  const renderCartItem = (item: CartProduct) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : Number(String(item.price).replace(/[^\d.]/g, ''));

    const quantity = item.quantity || 1;

    return (
      <View style={styles.productCard} key={String(item.id)}>
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>
            {item.image || '🛒'}
          </Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {item.name}
          </Text>

          <Text style={styles.productPrice}>
            {price.toLocaleString('kk-KZ')} ₸
          </Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => decreaseQuantity(item.id)}
            >
              <Ionicons name="remove" size={19} color="#53B175" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {quantity}
            </Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => increaseQuantity(item.id)}
            >
              <Ionicons name="add" size={19} color="#53B175" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <TouchableOpacity
            onPress={() => removeFromCart(item.id)}
          >
            <Ionicons name="trash-outline" size={21} color="#E74C3C" />
          </TouchableOpacity>

          <Text style={styles.itemTotal}>
            {(price * quantity).toLocaleString('kk-KZ')} ₸
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Менің себетім</Text>
        <Text style={styles.headerSubtitle}>
          Таңдаған тауарларың
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>

          <Text style={styles.emptyTitle}>
            Себетіңіз бос
          </Text>

          <Text style={styles.emptyDescription}>
            Қажетті тауарларды таңдап, себетке қосыңыз
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.shopButtonText}>
              Тауарларды қарау
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {cartItems.map(renderCartItem)}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>
                Тапсырыс қорытындысы
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Тауарлар құны
                </Text>

                <Text style={styles.summaryValue}>
                  {totalPrice.toLocaleString('kk-KZ')} ₸
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Жеткізу ақысы
                </Text>

                <Text style={styles.summaryValue}>
                  {deliveryPrice.toLocaleString('kk-KZ')} ₸
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>
                  Жалпы сома
                </Text>

                <Text style={styles.totalValue}>
                  {finalPrice.toLocaleString('kk-KZ')} ₸
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>
                Жалпы төлем
              </Text>

              <Text style={styles.footerPrice}>
                {finalPrice.toLocaleString('kk-KZ')} ₸
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>
                Тапсырыс беру
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </>
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
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 5,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: {
    width: 75,
    height: 75,
    borderRadius: 13,
    backgroundColor: '#F2F8F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productEmoji: {
    fontSize: 38,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  productPrice: {
    color: '#53B175',
    fontSize: 13,
    marginTop: 5,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    gap: 13,
  },

  quantityButton: {
    width: 29,
    height: 29,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCEBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },

  rightColumn: {
    height: 75,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  itemTotal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
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
    color: '#222',
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#53B175',
  },

  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footerLabel: {
    color: '#888',
    fontSize: 12,
  },

  footerPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },

  checkoutButton: {
    backgroundColor: '#53B175',
    paddingHorizontal: 17,
    paddingVertical: 14,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  checkoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
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

