// src/navigation/BottomTab.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import ChatListScreen from '../screens/ChatListScreen';
import AccountScreen from '../screens/AccountScreen';
import { NotificationsScreen } from '../screens/GalleryScreen';
import GalleryScreen from '../screens/GalleryScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ symbol, focused }) => (
  <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
    <Text style={[styles.iconSymbol, focused && styles.iconSymbolActive]}>{symbol}</Text>
  </View>
);

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tab.Screen name="Home"     component={HomeScreen}         options={{ tabBarLabel: 'Home',     tabBarIcon: ({ focused }) => <TabIcon symbol="🏠" focused={focused} /> }} />
      <Tab.Screen name="Products" component={ProductListScreen}  options={{ tabBarLabel: 'Products', tabBarIcon: ({ focused }) => <TabIcon symbol="🛍️" focused={focused} /> }} />
      <Tab.Screen name="Cart"     component={CartScreen}         options={{ tabBarLabel: 'Cart',     tabBarIcon: ({ focused }) => <TabIcon symbol="🛒" focused={focused} /> }} />
      <Tab.Screen name="Chats"    component={ChatListScreen}     options={{ tabBarLabel: 'Chat',     tabBarIcon: ({ focused }) => <TabIcon symbol="💬" focused={focused} /> }} />
      <Tab.Screen name="Account"  component={AccountScreen}      options={{ tabBarLabel: 'Account',  tabBarIcon: ({ focused }) => <TabIcon symbol="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70, backgroundColor: '#FFFFFF',
    borderTopWidth: 0, elevation: 20,
    shadowColor: 'rgba(26,60,110,0.2)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1, shadowRadius: 16,
    paddingBottom: 8, paddingTop: 4,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconBoxActive: { backgroundColor: `${colors.primary}15` },
  iconSymbol: { fontSize: 20, opacity: 0.5 },
  iconSymbolActive: { opacity: 1 },
});