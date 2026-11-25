
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

export default function FavouriteScreen() {
  const {
    favouriteItems,
    removeFromFavorites,
    addToCart,
  } = useCart();

  const handleAdd = (item) => {
    addToCart(item);
    Alert.alert('Сәтті!', 'Тауар себетке қосылды');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Таңдаулылар ❤️</Text>

      {favouriteItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>
            Таңдаулы тауарлар жоқ
          </Text>
          <Text style={styles.emptyText}>
            Ұнаған тауарларыңызды таңдаулыларға қосыңыз.
          </Text>
        </View>
      ) : (
        favouriteItems.map((item) => (
          <View style={styles.item} key={item.id}>
            <Text style={styles.image}>{item.image}</Text>

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {Number(item.price).toLocaleString('kk-KZ')} ₸
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleAdd(item)}
              >
                <Text style={styles.buttonText}>Қосу</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.remove}
                onPress={() => removeFromFavorites(item.id)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
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
    color: '#111827',
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
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 8,
    color: '#53B175',
    fontWeight: 'bold',
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  remove: {
    padding: 5,
  },
  removeText: {
    color: '#E53935',
    fontSize: 18,
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 65,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyText: {
    color: '#7C7C7C',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});
