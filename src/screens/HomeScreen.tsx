
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCart, CartProduct } from '../context/CartContext';

type Product = CartProduct & {
  category: string;
  image: string;
  description: string;
};

const CATEGORIES = [
  { id: '1', title: 'Сүт өнімдері', icon: '🥛' },
  { id: '2', title: 'Нан өнімдері', icon: '🍞' },
  { id: '3', title: 'Жеміс-жидек', icon: '🍎' },
  { id: '4', title: 'Көкөністер', icon: '🥕' },
  { id: '5', title: 'Ет пен құс', icon: '🍗' },
  { id: '6', title: 'Балық', icon: '🐟' },
  { id: '7', title: 'Тәттілер', icon: '🍫' },
  { id: '8', title: 'Кофе мен шай', icon: '☕' },
  { id: '9', title: 'Сусындар', icon: '🧃' },
  { id: '10', title: 'Жұмыртқа', icon: '🥚' },
  { id: '11', title: 'Ірімшік', icon: '🧀' },
  { id: '12', title: 'Мұздатылған өнімдер', icon: '🍦' },
  { id: '13', title: 'Тұрмыстық заттар', icon: '🧼' },
  { id: '14', title: 'Дайын тағамдар', icon: '🍱' },
];

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 201,
    name: 'Қызыл алма',
    price: 800,
    image: '🍎',
    category: 'Жеміс-жидек',
    description: 'Балғын алма',
  },
  {
    id: 202,
    name: 'Банан',
    price: 950,
    image: '🍌',
    category: 'Жеміс-жидек',
    description: 'Тәтті банан',
  },
  {
    id: 203,
    name: 'Сүт',
    price: 650,
    image: '🥛',
    category: 'Сүт өнімдері',
    description: 'Жаңа сүт',
  },
  {
    id: 204,
    name: 'Ақ нан',
    price: 250,
    image: '🍞',
    category: 'Нан өнімдері',
    description: 'Жаңа піскен нан',
  },
];

const DISCOUNT_PRODUCTS: Product[] = [
  {
    id: 205,
    name: 'Апельсин',
    price: 900,
    image: '🍊',
    category: 'Жеміс-жидек',
    description: 'Шырынды апельсин',
  },
  {
    id: 206,
    name: 'Йогурт',
    price: 450,
    image: '🍶',
    category: 'Сүт өнімдері',
    description: 'Табиғи йогурт',
  },
];

export default function HomeScreen({ navigation }: any) {
  const { addToCart } = useCart();

  const [search, setSearch] = useState('');

  const openCategory = (category: string) => {
    navigation.navigate('Products', {
      selectedCategory: category,
    });
  };

  const goCatalog = () => {
    navigation.navigate('Products', {
      selectedCategory: 'Барлығы',
    });
  };

  const goAddress = () => {
    navigation.navigate('Address');
  };

  const filteredProducts = FEATURED_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderProduct = (product: Product) => (
    <View style={styles.productCard} key={String(product.id)}>
      <Text style={styles.productEmoji}>{product.image}</Text>

      <Text style={styles.productName}>
        {product.name}
      </Text>

      <Text style={styles.productDescription}>
        {product.description}
      </Text>

      <View style={styles.productBottom}>
        <Text style={styles.price}>
          {product.price.toLocaleString('kk-KZ')} ₸
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product)}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Жоғарғы бөлік */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>ҮШ ҚЫЗ MARKET</Text>
            <Text style={styles.locationTitle}>
              <Ionicons name="location" size={15} color="#53B175" />
              {' '}Алматы, Қазақстан
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={23} color="#53B175" />
          </TouchableOpacity>
        </View>

        {/* Іздеу */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={21} color="#777" />

          <TextInput
            style={styles.searchInput}
            placeholder="Тауар іздеу..."
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#777" />
            </TouchableOpacity>
          )}
        </View>

        {/* Жылдам жеткізу */}
        <TouchableOpacity
          style={styles.deliveryBanner}
          onPress={goAddress}
          activeOpacity={0.85}
        >
          <View style={styles.deliveryText}>
            <Text style={styles.deliveryTitle}>
              Жылдам жеткізу
            </Text>

            <Text style={styles.deliverySubtitle}>
              Тапсырысыңды есігіңе дейін жеткіземіз
            </Text>

            <Text style={styles.deliveryLink}>
              Мекенжайды таңдау →
            </Text>
          </View>

          <Text style={styles.deliveryEmoji}>🚚</Text>
        </TouchableOpacity>

        {/* Санаттар */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Санаттар</Text>

          <TouchableOpacity onPress={goCatalog}>
            <Text style={styles.seeAll}>Барлығы</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => openCategory(category.title)}
            >
              <Text style={styles.categoryEmoji}>
                {category.icon}
              </Text>

              <Text style={styles.categoryTitle}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Танымал тауарлар */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Танымал тауарлар
          </Text>

          <TouchableOpacity onPress={goCatalog}>
            <Text style={styles.seeAll}>Барлығын көру</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredProducts.map(renderProduct)}
        </ScrollView>

        {/* Жеңілдіктер */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Арнайы ұсыныстар
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DISCOUNT_PRODUCTS.map(renderProduct)}
        </ScrollView>

        {/* Барлық тауарлар */}
        <TouchableOpacity
          style={styles.allProductsButton}
          onPress={goCatalog}
        >
          <Text style={styles.allProductsText}>
            Барлық тауарларды көру
          </Text>

          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },

  logo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#53B175',
  },

  locationTitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },

  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  deliveryBanner: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deliveryText: {
    flex: 1,
  },

  deliveryTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#285D3B',
  },

  deliverySubtitle: {
    fontSize: 12,
    color: '#55765D',
    marginTop: 7,
  },

  deliveryLink: {
    color: '#53B175',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },

  deliveryEmoji: {
    fontSize: 48,
    marginLeft: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
  },

  seeAll: {
    color: '#53B175',
    fontSize: 13,
    fontWeight: '600',
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },

  categoryCard: {
    width: '23%',
    minHeight: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },

  categoryEmoji: {
    fontSize: 28,
  },

  categoryTitle: {
    fontSize: 10,
    color: '#444',
    textAlign: 'center',
    marginTop: 6,
  },

  productCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginLeft: 15,
    marginBottom: 10,
    padding: 12,
  },

  productEmoji: {
    fontSize: 55,
    textAlign: 'center',
    marginVertical: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },

  productDescription: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },

  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },

  addButton: {
    width: 32,
    height: 32,
    backgroundColor: '#53B175',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  allProductsButton: {
    margin: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#53B175',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  allProductsText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
