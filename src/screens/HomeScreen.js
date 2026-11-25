
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { id: 'c1', title: 'Сүт өнімдері', icon: '🥛' },
  { id: 'c2', title: 'Нан өнімдері', icon: '🍞' },
  { id: 'c3', title: 'Жеміс-жидек', icon: '🍎' },
  { id: 'c4', title: 'Көкөністер', icon: '🥦' },
  { id: 'c5', title: 'Ет пен құс', icon: '🍗' },
  { id: 'c6', title: 'Балық', icon: '🐟' },
  { id: 'c7', title: 'Тәттілер', icon: '🍫' },
  { id: 'c8', title: 'Кофе мен шай', icon: '☕' },
  { id: 'c9', title: 'Сусындар', icon: '🥤' },
  { id: 'c10', title: 'Жұмыртқа', icon: '🥚' },
  { id: 'c11', title: 'Ірімшік', icon: '🧀' },
  { id: 'c12', title: 'Мұздатылған өнімдер', icon: '🧊' },
  { id: 'c13', title: 'Тұрмыстық заттар', icon: '🧼' },
  { id: 'c14', title: 'Дайын тағамдар', icon: '🍕' },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Қызыл алма', price: 499, image: '🍎', category: 'Жеміс-жидек' },
  { id: 2, name: 'Банан', price: 690, image: '🍌', category: 'Жеміс-жидек' },
  { id: 3, name: 'Апельсин', price: 750, image: '🍊', category: 'Жеміс-жидек' },
  { id: 4, name: 'Сүт 3,2%', price: 520, image: '🥛', category: 'Сүт өнімдері' },
];

const BEST_SELLING = [
  { id: 5, name: 'Нан', price: 220, image: '🍞', category: 'Нан өнімдері' },
  { id: 6, name: 'Жұмыртқа', price: 640, image: '🥚', category: 'Жұмыртқа' },
  { id: 7, name: 'Қияр', price: 580, image: '🥒', category: 'Көкөністер' },
  { id: 8, name: 'Шырын', price: 450, image: '🧃', category: 'Сусындар' },
];

const DISCOUNT_PRODUCTS = [
  {
    id: 101,
    name: 'Сары май',
    price: 899,
    oldPrice: 1149,
    discount: '-22%',
    image: '🧈',
    category: 'Сүт өнімдері',
  },
  {
    id: 102,
    name: 'Шоколад',
    price: 599,
    oldPrice: 850,
    discount: '-30%',
    image: '🍫',
    category: 'Тәттілер',
  },
  {
    id: 103,
    name: 'Кофе',
    price: 1490,
    oldPrice: 1890,
    discount: '-21%',
    image: '☕',
    category: 'Кофе мен шай',
  },
  {
    id: 104,
    name: 'Апельсин шырыны',
    price: 390,
    oldPrice: 550,
    discount: '-29%',
    image: '🧃',
    category: 'Сусындар',
  },
];

const NEW_PRODUCTS = [
  { id: 105, name: 'Құлпынай йогурты', price: 450, image: '🍓', category: 'Сүт өнімдері' },
  { id: 106, name: 'Пицца', price: 1590, image: '🍕', category: 'Дайын тағамдар' },
  { id: 107, name: 'Жасыл шай', price: 790, image: '🍵', category: 'Кофе мен шай' },
  { id: 108, name: 'Балмұздақ', price: 650, image: '🍦', category: 'Мұздатылған өнімдер' },
];

export default function HomeScreen({
  navigation,
  onAddToCart,
  onOpenCatalog,
  onOpenAddress,
}) {
  const {
    addToCart,
    favouriteItems,
    addToFavorites,
    removeFromFavorites,
  } = useCart();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const filterList = (list) =>
    list.filter((item) => {
      const matchesText = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const isFavorite = favouriteItems.some(
        (product) => product.id === item.id
      );

      const matchesFavorite = favoritesOnly ? isFavorite : true;

      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true;

      return matchesText && matchesFavorite && matchesCategory;
    });

  const handleAdd = (item) => {
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    };

    addToCart(product);

    if (onAddToCart) {
      onAddToCart(product);
    }

    Alert.alert('Сәтті!', `${item.name} себетке қосылды`);
  };

  const toggleFavorite = (item) => {
    const exists = favouriteItems.some(
      (product) => product.id === item.id
    );

    if (exists) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    }
  };

  const goCatalog = () => {
    if (onOpenCatalog) {
      onOpenCatalog();
    } else if (navigation) {
      navigation.navigate('Products');
    }
  };

  const goAddress = () => {
    if (onOpenAddress) {
      onOpenAddress();
    } else if (navigation) {
      navigation.navigate('Address');
    }
  };

  // Санатты Products экранына жіберу
  const openCategory = (category) => {
    if (navigation) {
      navigation.navigate('Products', {
        selectedCategory: category,
      });
    } else if (onOpenCatalog) {
      onOpenCatalog(category);
    }
  };

  const renderProduct = (item, showDiscount = false) => {
    const isFavorite = favouriteItems.some(
      (product) => product.id === item.id
    );

    return (
      <View style={styles.card} key={item.id}>
        {showDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>
              {item.discount}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.cardFavBtn}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.cardFavText}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.image}>{item.image}</Text>

        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        {showDiscount && (
          <Text style={styles.oldPrice}>
            {item.oldPrice.toLocaleString('kk-KZ')} ₸
          </Text>
        )}

        <Text style={styles.price}>
          {item.price.toLocaleString('kk-KZ')} ₸
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAdd(item)}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const filteredFeatured = filterList(FEATURED_PRODUCTS);
  const filteredBest = filterList(BEST_SELLING);
  const filteredDiscount = filterList(DISCOUNT_PRODUCTS);
  const filteredNew = filterList(NEW_PRODUCTS);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.logo}>🛒 ҮШ ҚЫЗ MARKET</Text>
            <Text style={styles.welcomeText}>Қош келдіңіз!</Text>
          </View>

          <TouchableOpacity
            style={styles.addressButton}
            onPress={goAddress}
          >
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText}>Мекенжай</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.mainBanner}
          onPress={goCatalog}
          activeOpacity={0.8}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerLabel}>АРНАЙЫ ҰСЫНЫС</Text>
            <Text style={styles.bannerTitle}>
              Дәмді әрі{'\n'}тиімді сатып ал!
            </Text>
            <Text style={styles.bannerDescription}>
              Таңдаулы тауарларға жеңілдіктер
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>
                Сатып алу →
              </Text>
            </View>
          </View>

          <Text style={styles.bannerEmoji}>🛍️🥑🍓</Text>
        </TouchableOpacity>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Тауар іздеу..."
              placeholderTextColor="#7C7C7C"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.heartBtn,
              favoritesOnly && styles.heartBtnActive,
            ]}
            onPress={() => setFavoritesOnly((prev) => !prev)}
          >
            <Text style={styles.heartIcon}>
              {favoritesOnly ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Санаттар</Text>
          <TouchableOpacity onPress={goCatalog}>
            <Text style={styles.seeAllLink}>Барлығы ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryTile}
              activeOpacity={0.7}
              onPress={() => openCategory(cat.title)}
            >
              <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              <Text style={styles.categoryTitle} numberOfLines={2}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.discountBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.discountTitle}>
              🔥 Бүгінгі жеңілдіктер
            </Text>
            <Text style={styles.discountDescription}>
              Таңдаулы тауарларға тиімді бағалар!
            </Text>
            <Text style={styles.timerText}>
              ⏱ Акция аяқталуына: {formatTimer(secondsLeft)}
            </Text>
          </View>
          <Text style={styles.discountEmoji}>🏷️</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Арнайы жеңілдіктер</Text>
          <Text style={styles.saleLabel}>ТИІМДІ</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredDiscount.map((item) => renderProduct(item, true))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Баға бәрін шешеді!</Text>
          <TouchableOpacity onPress={goCatalog}>
            <Text style={styles.seeAllLink}>Бәрі ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredFeatured.map((item) => renderProduct(item))}
        </ScrollView>

        <TouchableOpacity
          style={styles.adBanner}
          onPress={() => openCategory('Тәттілер')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.adSmallTitle}>ТӘТТІ СӘТТЕР</Text>
            <Text style={styles.adTitle}>
              Шоколад пен тәттілер әлемі
            </Text>
            <Text style={styles.adText}>
              Өзіңе ұнайтын дәмді таңда!
            </Text>
          </View>
          <Text style={styles.adEmoji}>🍫🍪🍬</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Көп сатылатындар</Text>
          <TouchableOpacity onPress={goCatalog}>
            <Text style={styles.seeAllLink}>Бәрі ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredBest.map((item) => renderProduct(item))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Жаңа тауарлар ✨</Text>
          <TouchableOpacity onPress={goCatalog}>
            <Text style={styles.seeAllLink}>Бәрі ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredNew.map((item) => renderProduct(item))}
        </ScrollView>

        <TouchableOpacity
          style={styles.infoBanner}
          activeOpacity={0.7}
          onPress={goAddress}
        >
          <Text style={styles.infoEmoji}>🚚</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Жылдам жеткізу</Text>
            <Text style={styles.infoText}>
              Мекенжай мен жеткізу уақытын таңдаңыз.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.infoBanner}>
          <Text style={styles.infoEmoji}>💚</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Сапалы өнімдер</Text>
            <Text style={styles.infoText}>
              Күнделікті қажет тауарлар бір жерде.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F6F8' },
  container: { flex: 1, paddingHorizontal: 14 },
  scrollContent: { paddingTop: 10, paddingBottom: 30 },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: { fontSize: 18, fontWeight: '900', color: '#16A34A' },
  welcomeText: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
  },
  addressIcon: { fontSize: 15, marginRight: 5 },
  addressText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  mainBanner: {
    backgroundColor: '#2E9D59',
    borderRadius: 20,
    padding: 18,
    minHeight: 180,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'hidden',
  },
  bannerContent: { flex: 1 },
  bannerLabel: { color: '#D1FAE5', fontSize: 11, fontWeight: '900' },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 8,
  },
  bannerDescription: { color: '#FFFFFF', fontSize: 12, marginTop: 7 },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  bannerButtonText: { color: '#15803D', fontWeight: '800', fontSize: 12 },
  bannerEmoji: { fontSize: 48, marginLeft: 5 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEEF2',
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  heartBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtnActive: { backgroundColor: '#FEE2E2' },
  heartIcon: { fontSize: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 13,
  },
  title: { fontSize: 19, fontWeight: '900', color: '#111827' },
  seeAllLink: { fontSize: 13, fontWeight: '700', color: '#16A34A' },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 20,
  },
  categoryTile: {
    width: '31.5%',
    minHeight: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryEmoji: { fontSize: 30 },
  categoryTitle: { fontSize: 11, fontWeight: '700', color: '#374151' },
  discountBanner: {
    backgroundColor: '#FFF0DF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  discountTitle: { fontSize: 19, fontWeight: '900', color: '#C2410C' },
  discountDescription: { fontSize: 12, color: '#7C2D12', marginTop: 6 },
  timerText: {
    fontSize: 12,
    color: '#C2410C',
    fontWeight: '800',
    marginTop: 8,
  },
  discountEmoji: { fontSize: 45, marginLeft: 8 },
  saleLabel: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '900',
  },
  card: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    marginBottom: 16,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    zIndex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  discountBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  cardFavBtn: { alignSelf: 'flex-end', padding: 2 },
  cardFavText: { fontSize: 18 },
  image: { fontSize: 46, textAlign: 'center', marginVertical: 8 },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    minHeight: 35,
  },
  oldPrice: {
    marginTop: 5,
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  price: { marginTop: 6, fontWeight: '900', fontSize: 15, color: '#16A34A' },
  addButton: {
    backgroundColor: '#22A852',
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  addText: { color: '#FFFFFF', fontSize: 23, fontWeight: '700', lineHeight: 25 },
  adBanner: {
    backgroundColor: '#E9B98E',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  adSmallTitle: { color: '#854D0E', fontSize: 10, fontWeight: '900' },
  adTitle: { color: '#422006', fontSize: 19, fontWeight: '900', marginTop: 7 },
  adText: { color: '#713F12', fontSize: 12, marginTop: 5 },
  adEmoji: { fontSize: 38, marginLeft: 8 },
  infoBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoEmoji: { fontSize: 30, marginRight: 13 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  infoText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  arrow: { fontSize: 27, color: '#16A34A', marginLeft: 8 },
});
