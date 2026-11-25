
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useCart } from '../context/CartContext';

const CATEGORIES = [
  'Барлығы',
  'Сүт өнімдері',
  'Нан өнімдері',
  'Жеміс-жидек',
  'Көкөністер',
  'Ет пен құс',
  'Балық',
  'Тәттілер',
  'Кофе мен шай',
  'Сусындар',
  'Жұмыртқа',
  'Ірімшік',
  'Мұздатылған өнімдер',
  'Тұрмыстық заттар',
  'Дайын тағамдар',
];

const PRODUCTS = [
  // Сүт өнімдері
  { id: 1, name: 'Сүт 3,2%', price: 520, image: '🥛', category: 'Сүт өнімдері' },
  { id: 2, name: 'Айран', price: 450, image: '🥛', category: 'Сүт өнімдері' },
  { id: 3, name: 'Йогурт', price: 390, image: '🍶', category: 'Сүт өнімдері' },
  { id: 4, name: 'Сары май', price: 899, image: '🧈', category: 'Сүт өнімдері' },

  // Нан өнімдері
  { id: 5, name: 'Ақ нан', price: 220, image: '🍞', category: 'Нан өнімдері' },
  { id: 6, name: 'Қара нан', price: 250, image: '🥖', category: 'Нан өнімдері' },
  { id: 7, name: 'Батон', price: 280, image: '🥐', category: 'Нан өнімдері' },
  { id: 8, name: 'Тоқаш', price: 180, image: '🥯', category: 'Нан өнімдері' },

  // Жеміс-жидек
  { id: 9, name: 'Қызыл алма', price: 499, image: '🍎', category: 'Жеміс-жидек' },
  { id: 10, name: 'Банан', price: 690, image: '🍌', category: 'Жеміс-жидек' },
  { id: 11, name: 'Апельсин', price: 750, image: '🍊', category: 'Жеміс-жидек' },
  { id: 12, name: 'Құлпынай', price: 1200, image: '🍓', category: 'Жеміс-жидек' },

  // Көкөністер
  { id: 13, name: 'Қияр', price: 580, image: '🥒', category: 'Көкөністер' },
  { id: 14, name: 'Қызанақ', price: 650, image: '🍅', category: 'Көкөністер' },
  { id: 15, name: 'Картоп', price: 250, image: '🥔', category: 'Көкөністер' },
  { id: 16, name: 'Сәбіз', price: 220, image: '🥕', category: 'Көкөністер' },

  // Ет пен құс
  { id: 17, name: 'Тауық еті', price: 1800, image: '🍗', category: 'Ет пен құс' },
  { id: 18, name: 'Сиыр еті', price: 3200, image: '🥩', category: 'Ет пен құс' },
  { id: 19, name: 'Фарш', price: 2100, image: '🥩', category: 'Ет пен құс' },
  { id: 20, name: 'Тауық қанаты', price: 1450, image: '🍗', category: 'Ет пен құс' },

  // Балық
  { id: 21, name: 'Албырт балығы', price: 4500, image: '🐟', category: 'Балық' },
  { id: 22, name: 'Сазан', price: 1900, image: '🐠', category: 'Балық' },
  { id: 23, name: 'Тунец', price: 2300, image: '🐟', category: 'Балық' },
  { id: 24, name: 'Асшаян', price: 2800, image: '🦐', category: 'Балық' },

  // Тәттілер
  { id: 25, name: 'Шоколад', price: 599, image: '🍫', category: 'Тәттілер' },
  { id: 26, name: 'Кәмпит', price: 850, image: '🍬', category: 'Тәттілер' },
  { id: 27, name: 'Печенье', price: 450, image: '🍪', category: 'Тәттілер' },
  { id: 28, name: 'Торт', price: 2500, image: '🎂', category: 'Тәттілер' },

  // Кофе мен шай
  { id: 29, name: 'Қара шай', price: 650, image: '🍵', category: 'Кофе мен шай' },
  { id: 30, name: 'Жасыл шай', price: 790, image: '🍵', category: 'Кофе мен шай' },
  { id: 31, name: 'Еритін кофе', price: 1490, image: '☕', category: 'Кофе мен шай' },
  { id: 32, name: 'Капучино', price: 1200, image: '☕', category: 'Кофе мен шай' },

  // Сусындар
  { id: 33, name: 'Апельсин шырыны', price: 390, image: '🧃', category: 'Сусындар' },
  { id: 34, name: 'Кола', price: 550, image: '🥤', category: 'Сусындар' },
  { id: 35, name: 'Минералды су', price: 250, image: '💧', category: 'Сусындар' },
  { id: 36, name: 'Лимонад', price: 450, image: '🍹', category: 'Сусындар' },

  // Жұмыртқа
  { id: 37, name: 'Тауық жұмыртқасы', price: 640, image: '🥚', category: 'Жұмыртқа' },
  { id: 38, name: 'Үй жұмыртқасы', price: 850, image: '🥚', category: 'Жұмыртқа' },
  { id: 39, name: 'Бөдене жұмыртқасы', price: 750, image: '🥚', category: 'Жұмыртқа' },
  { id: 40, name: 'Жұмыртқа 30 дана', price: 1650, image: '🥚', category: 'Жұмыртқа' },

  // Ірімшік
  { id: 41, name: 'Қатты ірімшік', price: 1800, image: '🧀', category: 'Ірімшік' },
  { id: 42, name: 'Моцарелла', price: 1500, image: '🧀', category: 'Ірімшік' },
  { id: 43, name: 'Сүзбе ірімшік', price: 950, image: '🧀', category: 'Ірімшік' },
  { id: 44, name: 'Балқытылған ірімшік', price: 650, image: '🧀', category: 'Ірімшік' },

  // Мұздатылған өнімдер
  { id: 45, name: 'Балмұздақ', price: 650, image: '🍦', category: 'Мұздатылған өнімдер' },
  { id: 46, name: 'Мұздатылған пицца', price: 1590, image: '🍕', category: 'Мұздатылған өнімдер' },
  { id: 47, name: 'Тұшпара', price: 1250, image: '🥟', category: 'Мұздатылған өнімдер' },
  { id: 48, name: 'Мұздатылған көкөніс', price: 890, image: '🥦', category: 'Мұздатылған өнімдер' },

  // Тұрмыстық заттар
  { id: 49, name: 'Сұйық сабын', price: 650, image: '🧼', category: 'Тұрмыстық заттар' },
  { id: 50, name: 'Ыдыс жуғыш зат', price: 750, image: '🧴', category: 'Тұрмыстық заттар' },
  { id: 51, name: 'Қағаз майлық', price: 350, image: '🧻', category: 'Тұрмыстық заттар' },
  { id: 52, name: 'Тіс пастасы', price: 590, image: '🪥', category: 'Тұрмыстық заттар' },

  // Дайын тағамдар
  { id: 53, name: 'Пицца', price: 1590, image: '🍕', category: 'Дайын тағамдар' },
  { id: 54, name: 'Бургер', price: 1290, image: '🍔', category: 'Дайын тағамдар' },
  { id: 55, name: 'Суши', price: 2200, image: '🍣', category: 'Дайын тағамдар' },
  { id: 56, name: 'Сэндвич', price: 850, image: '🥪', category: 'Дайын тағамдар' },
];

export default function ProductsScreen({
  navigation,
  route,
  onAddToCart,
  onBack,
}) {
  const {
    addToCart,
    favouriteItems,
    addToFavorites,
    removeFromFavorites,
  } = useCart();

  const initialCategory = route?.params?.selectedCategory || 'Барлығы';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [addedIds, setAddedIds] = useState([]);

  // Басты беттен жаңа санат келгенде жаңарту
  useEffect(() => {
    const category = route?.params?.selectedCategory;
    if (category) {
      setSelectedCategory(category);
    }
  }, [route?.params?.selectedCategory]);

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Барлығы' ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
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

    setAddedIds((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id]
    );
  };

  const handleFavourite = (item) => {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
            >
              <Text style={styles.backText}>‹ Артқа</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}

          <Text style={styles.title}>Тауарлар</Text>
          <View style={styles.placeholder} />
        </View>

        <TextInput
          style={styles.search}
          placeholder="Тауар іздеу..."
          placeholderTextColor="#7C7C7C"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;

            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.resultHeader}>
          <Text style={styles.resultText}>
            {selectedCategory}
          </Text>
          <Text style={styles.countText}>
            {filteredProducts.length} тауар
          </Text>
        </View>

        <View style={styles.grid}>
          {filteredProducts.map((item) => {
            const isAdded = addedIds.includes(item.id);

            const isFavourite = favouriteItems.some(
              (product) => product.id === item.id
            );

            return (
              <View style={styles.card} key={item.id}>
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => handleFavourite(item)}
                >
                  <Text style={styles.heart}>
                    {isFavourite ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.image}>{item.image}</Text>

                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.price}>
                  {item.price.toLocaleString('kk-KZ')} ₸
                </Text>

                <TouchableOpacity
                  style={[
                    styles.button,
                    isAdded && styles.buttonAdded,
                  ]}
                  onPress={() => handleAdd(item)}
                >
                  <Text style={styles.buttonText}>
                    {isAdded ? 'Қосылды ✓' : 'Қосу +'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {filteredProducts.length === 0 && (
          <Text style={styles.emptyText}>
            Тауар табылмады
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 16,
    color: '#16A34A',
    fontWeight: '700',
  },
  placeholder: {
    width: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },
  search: {
    backgroundColor: '#F2F3F2',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 18,
    marginBottom: 14,
    fontSize: 15,
    color: '#111827',
  },
  categoryScroll: {
    marginBottom: 18,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#53B175',
  },
  categoryChipText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  countText: {
    color: '#6B7280',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  heartButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  heart: {
    fontSize: 22,
  },
  image: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    minHeight: 38,
  },
  price: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#16A34A',
  },
  button: {
    backgroundColor: '#53B175',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonAdded: {
    backgroundColor: '#15803D',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#7C7C7C',
    fontSize: 16,
  },
});
