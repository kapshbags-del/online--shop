
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  {
    id: '1',
    name: 'Жеміс-жидек',
    icon: '🍎',
    color: '#FFF0E8',
  },
  {
    id: '2',
    name: 'Көкөністер',
    icon: '🥦',
    color: '#E8F5E9',
  },
  {
    id: '3',
    name: 'Сүт өнімдері',
    icon: '🥛',
    color: '#E3F2FD',
  },
  {
    id: '4',
    name: 'Нан өнімдері',
    icon: '🍞',
    color: '#FFF3E0',
  },
  {
    id: '5',
    name: 'Ет және құс',
    icon: '🍗',
    color: '#FCE4EC',
  },
  {
    id: '6',
    name: 'Балық',
    icon: '🐟',
    color: '#E0F7FA',
  },
  {
    id: '7',
    name: 'Сусындар',
    icon: '🥤',
    color: '#F3E5F5',
  },
  {
    id: '8',
    name: 'Тәттілер',
    icon: '🍫',
    color: '#FBE9E7',
  },
  {
    id: '9',
    name: 'Мұздатылған өнімдер',
    icon: '🧊',
    color: '#E1F5FE',
  },
  {
    id: '10',
    name: 'Тұрмыстық заттар',
    icon: '🧴',
    color: '#F1F8E9',
  },
  {
    id: '11',
    name: 'Шай және кофе',
    icon: '☕',
    color: '#EFEBE9',
  },
  {
    id: '12',
    name: 'Дайын тағамдар',
    icon: '🍱',
    color: '#FFF8E1',
  },
  {
    id: '13',
    name: 'Жұмыртқа',
    icon: '🥚',
    color: '#FFFDE7',
  },
  {
    id: '14',
    name: 'Жеке күтім',
    icon: '🧼',
    color: '#F3E5F5',
  },
];

export default function CategoriesScreen({ navigation }: any) {
  const openCategory = (categoryName: string) => {
    navigation.navigate('Main', {
      screen: 'Products',
      params: {
        selectedCategory: categoryName,
      },
    });
  };

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.8}
      onPress={() => openCategory(item.name)}
    >
      <View
        style={[
          styles.categoryImage,
          { backgroundColor: item.color },
        ]}
      >
        <Text style={styles.categoryEmoji}>
          {item.icon}
        </Text>
      </View>

      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>
          {item.name}
        </Text>

        <Text style={styles.categorySubtitle}>
          Тауарларды көру
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color="#AAAAAA"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Санаттар
        </Text>
      </View>

      <View style={styles.intro}>
        <Text style={styles.introTitle}>
          Өнімдерді таңдаңыз
        </Text>

        <Text style={styles.introSubtitle}>
          Өзіңізге қажетті санатты ашыңыз
        </Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
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
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 15,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 13,
  },

  intro: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  introTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
  },

  introSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },

  list: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryImage: {
    width: 57,
    height: 57,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryEmoji: {
    fontSize: 30,
  },

  categoryInfo: {
    flex: 1,
    marginLeft: 13,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  categorySubtitle: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 5,
  },
});
