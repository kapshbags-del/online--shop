
import React, { useState } from 'react';

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

import { useCart } from '../context/CartContext';

export default function ProductDetailsScreen({
  navigation,
  route,
}: any) {
  const product = route?.params?.product;

  const {
    addToCart,
    toggleFavourite,
    favouriteItems,
  } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Тауар туралы</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={55} color="#999" />
          <Text style={styles.emptyText}>
            Тауар туралы ақпарат табылмады.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const price = Number(product.price) || 0;
  const total = price * quantity;

  const isFavourite = favouriteItems.some(
    (item: any) => item.id === product.id
  );

  const changeQuantity = (amount: number) => {
    setQuantity((previous) => Math.max(1, previous + amount));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    Alert.alert(
      'Себетке қосылды',
      `${product.name} себетке ${quantity} дана болып қосылды.`,
      [
        {
          text: 'Жалғастыру',
          style: 'cancel',
        },
        {
          text: 'Себетке өту',
          onPress: () => navigation.navigate('Main', {
            screen: 'Cart',
          }),
        },
      ]
    );
  };

  const handleFavourite = () => {
    toggleFavourite(product);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={23} color="#222" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Тауар туралы
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleFavourite}
          >
            <Ionicons
              name={isFavourite ? 'heart' : 'heart-outline'}
              size={23}
              color={isFavourite ? '#E74C3C' : '#222'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.productEmoji}>
            {product.image || '🛒'}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>
                {product.name}
              </Text>

              <Text style={styles.category}>
                {product.category || 'Тауар'}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {price.toLocaleString('kk-KZ')} ₸
              </Text>
              <Text style={styles.unit}>
                1 дана
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Тауар сипаттамасы
          </Text>

          <Text style={styles.description}>
            {product.description ||
              `${product.name} — ҮШ ҚЫЗ MARKET дүкеніндегі сапалы өнім. Күнделікті тұтынуға арналған. Тауар туралы қосымша ақпаратты дүкеннен білуге болады.`}
          </Text>

          <View style={styles.divider} />

          <View style={styles.quantityRow}>
            <Text style={styles.sectionTitle}>
              Саны
            </Text>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => changeQuantity(-1)}
              >
                <Ionicons name="remove" size={20} color="#53B175" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>
                {quantity}
              </Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => changeQuantity(1)}
              >
                <Ionicons name="add" size={20} color="#53B175" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>
              Жалпы бағасы
            </Text>

            <Text style={styles.totalPrice}>
              {total.toLocaleString('kk-KZ')} ₸
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Ionicons
              name="cart-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Себетке қосу
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleFavourite}
          >
            <Ionicons
              name={isFavourite ? 'heart' : 'heart-outline'}
              size={21}
              color="#E74C3C"
            />

            <Text style={styles.favouriteText}>
              {isFavourite
                ? 'Таңдаулылардан алып тастау'
                : 'Таңдаулыларға қосу'}
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  imageContainer: {
    height: 250,
    backgroundColor: '#EDF7EF',
    marginHorizontal: 15,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productEmoji: {
    fontSize: 110,
  },

  detailsContainer: {
    padding: 20,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
  },

  category: {
    fontSize: 12,
    color: '#999',
    marginTop: 7,
  },

  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },

  price: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#53B175',
  },

  unit: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  description: {
    fontSize: 12,
    color: '#888',
    lineHeight: 21,
    marginTop: 10,
  },

  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },

  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 16,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 13,
    color: '#777',
  },

  totalPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#53B175',
  },

  addButton: {
    height: 55,
    backgroundColor: '#53B175',
    borderRadius: 13,
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  addButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  favouriteButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    marginTop: 8,
  },

  favouriteText: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 15,
  },
});
