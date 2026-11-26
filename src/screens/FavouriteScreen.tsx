
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

export default function FavouriteScreen({ navigation }: any) {
  const {
    favouriteItems,
    removeFromFavourite,
    addToCart,
  } = useCart();

  const handleAddToCart = (item: CartProduct) => {
    addToCart(item);

    Alert.alert(
      'Сәтті!',
      `${item.name} себетке қосылды`
    );
  };

  const renderItem = (item: CartProduct) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : Number(String(item.price).replace(/[^\d.]/g, ''));

    return (
      <View style={styles.productCard} key={String(item.id)}>
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>
            {item.image || '🛍️'}
          </Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {item.name}
          </Text>

          {item.category ? (
            <Text style={styles.productCategory}>
              {item.category}
            </Text>
          ) : null}

          <Text style={styles.productPrice}>
            {price.toLocaleString('kk-KZ')} ₸
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons
              name="cart-outline"
              size={17}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Себетке қосу
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => removeFromFavourite(item.id)}
        >
          <Ionicons
            name="heart"
            size={23}
            color="#E74C3C"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Таңдаулылар ❤️
        </Text>

        <Text style={styles.headerSubtitle}>
          Сақтаған сүйікті тауарларың
        </Text>
      </View>

      {favouriteItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>💚</Text>

          <Text style={styles.emptyTitle}>
            Әзірге тауар жоқ
          </Text>

          <Text style={styles.emptyDescription}>
            Ұнаған тауарларыңа жүрек белгісін бас.
            Олар осы жерде сақталады.
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
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              Барлығы: {favouriteItems.length} тауар
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {favouriteItems.map(renderItem)}
          </ScrollView>
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

  countContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  countText: {
    color: '#888',
    fontSize: 13,
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
    width: 80,
    height: 85,
    borderRadius: 13,
    backgroundColor: '#F2F8F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productEmoji: {
    fontSize: 40,
  },

  productInfo: {
    flex: 1,
    marginLeft: 13,
  },

  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  productCategory: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },

  productPrice: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },

  addButton: {
    backgroundColor: '#53B175',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 9,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  heartButton: {
    padding: 8,
    alignSelf: 'flex-start',
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
