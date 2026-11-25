
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  const deliveryPrice = cartItems.length > 0 ? 500 : 0;
  const finalPrice = totalPrice + deliveryPrice;

  const goToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Себет бос', 'Алдымен тауар қосыңыз!');
      return;
    }

    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Менің себетім</Text>

      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyImage}>🛒</Text>
          <Text style={styles.emptyTitle}>Себетіңіз бос</Text>
          <Text style={styles.emptyText}>
            Өзіңізге ұнаған тауарларды себетке қосыңыз
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.buttonText}>
              Тауарларды қарау
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.list}>
            {cartItems.map((item) => (
              <View style={styles.item} key={item.id}>
                <Text style={styles.image}>
                  {item.image || '🛍️'}
                </Text>

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.name || item.title}
                  </Text>

                  <Text style={styles.price}>
                    {Number(item.price).toFixed(0)} ₸
                  </Text>

                  <View style={styles.quantityBox}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(item.id)}
                    >
                      <Text style={styles.quantitySymbol}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.id)}
                    >
                      <Text style={styles.quantitySymbol}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.right}>
                  <TouchableOpacity
                    style={styles.remove}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeText}>×</Text>
                  </TouchableOpacity>

                  <Text style={styles.itemTotal}>
                    {(Number(item.price) * item.quantity).toFixed(0)} ₸
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.total}>
              <Text style={styles.totalText}>
                Тауарлар бағасы
              </Text>
              <Text style={styles.totalPrice}>
                {totalPrice.toFixed(0)} ₸
              </Text>
            </View>

            <View style={styles.total}>
              <Text style={styles.totalText}>
                Жеткізу ақысы
              </Text>
              <Text style={styles.totalPrice}>
                {deliveryPrice} ₸
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.total}>
              <Text style={styles.totalText}>
                Жалпы сома
              </Text>
              <Text style={styles.finalPrice}>
                {finalPrice.toFixed(0)} ₸
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={goToCheckout}
            >
              <Text style={styles.buttonText}>
                Тапсырысты рәсімдеу →
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 25,
    color: '#181725',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    paddingVertical: 20,
  },
  image: {
    fontSize: 40,
    width: 55,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#181725',
  },
  price: {
    marginTop: 8,
    color: '#7C7C7C',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  remove: {
    padding: 5,
  },
  removeText: {
    fontSize: 25,
    color: '#B0B0B0',
  },
  itemTotal: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantitySymbol: {
    fontSize: 20,
    color: '#53B175',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 12,
    fontWeight: 'bold',
  },
  summary: {
    paddingTop: 15,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  finalPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#53B175',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginTop: 18,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 18,
    borderRadius: 15,
    marginTop: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    fontSize: 70,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyText: {
    color: '#7C7C7C',
    textAlign: 'center',
    marginTop: 10,
  },
  shopButton: {
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
});
