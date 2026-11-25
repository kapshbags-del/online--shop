
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { useCart } from '../context/CartContext';

export default function ProductDetailsScreen({ navigation }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const product = {
    id: 1,
    name: 'Қызыл алма',
    price: 499,
    image: '🍎',
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    Alert.alert('Сәтті!', 'Тауар себетке қосылды');

    navigation.navigate('Main', {
      screen: 'Cart',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageBox}>
        <Text style={styles.productImage}>🍎</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Қызыл алма</Text>
        <Text style={styles.subtitle}>1 кг, жаңа өнім</Text>

        <View style={styles.row}>
          <View style={styles.quantity}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.symbol}>−</Text>
            </TouchableOpacity>

            <Text style={styles.number}>{quantity}</Text>

            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>
            {(499 * quantity).toLocaleString('kk-KZ')} ₸
          </Text>
        </View>

        <Text style={styles.heading}>Өнім туралы</Text>

        <Text style={styles.description}>
          Жаңа әрі дәмді қызыл алма.
          Күнделікті тұтынуға арналған
          сапалы және пайдалы өнім.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>
            Себетке қосу
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageBox: {
    height: 280,
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    fontSize: 120,
  },
  content: {
    padding: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#7C7C7C',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 25,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 28,
    color: '#B3B3B3',
    padding: 10,
  },
  plus: {
    fontSize: 28,
    color: '#53B175',
    padding: 10,
  },
  number: {
    fontSize: 18,
    marginHorizontal: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#7C7C7C',
    lineHeight: 23,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 18,
    borderRadius: 15,
    marginTop: 35,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
