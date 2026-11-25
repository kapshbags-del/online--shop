
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const categories = [
  { id: 1, name: 'Жемістер', image: '🍎', color: '#E8F5E9' },
  { id: 2, name: 'Көкөністер', image: '🥦', color: '#FFF3E0' },
  { id: 3, name: 'Сүт өнімдері', image: '🥛', color: '#E3F2FD' },
  { id: 4, name: 'Ет өнімдері', image: '🥩', color: '#FCE4EC' },
  { id: 5, name: 'Нан өнімдері', image: '🍞', color: '#FFF8E1' },
  { id: 6, name: 'Сусындар', image: '🧃', color: '#F3E5F5' },
  { id: 7, name: 'Тәттілер', image: '🍫', color: '#FBE9E7' },
  { id: 8, name: 'Теңіз өнімдері', image: '🐟', color: '#E0F7FA' },
];

export default function CategoriesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Өнім санаттары</Text>

      <View style={styles.grid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.color }]}
          >
            <Text style={styles.image}>{item.image}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  image: {
    fontSize: 55,
    marginBottom: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
});
