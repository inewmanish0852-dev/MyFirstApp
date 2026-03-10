// src/navigation/BottomTab.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import AccountScreen from '../screens/AccountScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Simple SVG-free icon component using Unicode/Emoji symbols
const TabIcon = ({ symbol, label, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
    <Text style={[styles.tabIconSymbol, focused && styles.tabIconSymbolActive]}>
      {symbol}
    </Text>
  </View>
);

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'About',
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="ℹ️" label="About" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contact',
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="✉️" label="Contact" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="👤" label="Account" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: 'rgba(26,60,110,0.2)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: `${colors.primary}15`,
  },
  tabIconSymbol: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabIconSymbolActive: {
    opacity: 1,
  },
});

export default BottomTab;