
import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { CartProvider } from './src/context/CartContext';

// Экрандарды импорттау
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CartScreen from './src/screens/CartScreen';
import FavouriteScreen from './src/screens/FavouriteScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import FilterScreen from './src/screens/FilterScreen';

import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';
import OrdersScreen from './src/screens/OrdersScreen';

import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import AddressScreen from './src/screens/AddressScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import DeliveryTrackingScreen from './src/screens/DeliveryTrackingScreen';

// Тауар типі
export type Product = {
  id: number | string;
  name: string;
  price: number | string;
  image?: string;
  category?: string;
  description?: string;
};

// Төменгі мәзірдің типтері
export type MainTabParamList = {
  Home: undefined;

  Products:
    | {
        selectedCategory?: string;
      }
    | undefined;

  Cart: undefined;
  Favourite: undefined;
  Profile: undefined;
};

// Негізгі экрандардың типтері
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;

  ProductDetails: {
    product: Product;
  };

  Categories: undefined;
  Filter: undefined;
  Checkout: undefined;
  OrderSuccess: undefined;
  Orders: undefined;
  PersonalInfo: undefined;
  Address: undefined;
  Payment: {
    amount?: number;
  } | undefined;

  DeliveryTracking:
    | {
        order?: any;
        address?: any;
      }
    | undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tab =
  createBottomTabNavigator<MainTabParamList>();

// Төменгі навигация
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#53B175',
        tabBarInactiveTintColor: '#999999',

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 7,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => {
          let iconName:
            | 'home-outline'
            | 'grid-outline'
            | 'cart-outline'
            | 'heart-outline'
            | 'person-outline' = 'home-outline';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Products') {
            iconName = 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          } else if (route.name === 'Favourite') {
            iconName = 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Басты бет',
        }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Тауарлар',
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Себет',
        }}
      />

      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          title: 'Таңдаулылар',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
        }}
      />
    </Tab.Navigator>
  );
}

// Негізгі қосымша
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {/* Кіру және тіркелу */}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
          />

          {/* Негізгі беттер */}
          <Stack.Screen
            name="Main"
            component={MainTabs}
          />

          {/* Тауарлар */}
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />

          <Stack.Screen
            name="Categories"
            component={CategoriesScreen}
          />

          <Stack.Screen
            name="Filter"
            component={FilterScreen}
          />

          {/* Тапсырыс */}
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
          />

          <Stack.Screen
            name="OrderSuccess"
            component={OrderSuccessScreen}
          />

          <Stack.Screen
            name="Orders"
            component={OrdersScreen}
          />

          {/* Профиль */}
          <Stack.Screen
            name="PersonalInfo"
            component={PersonalInfoScreen}
          />

          <Stack.Screen
            name="Address"
            component={AddressScreen}
          />

          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
          />

          {/* Жеткізу */}
          <Stack.Screen
            name="DeliveryTracking"
            component={DeliveryTrackingScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
