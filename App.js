// App.js
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import BottomTab from "./src/navigation/BottomTab";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import { isLoggedIn } from "./src/utils/auth";

const Stack = createNativeStackNavigator();

export default function App() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await isLoggedIn();
      setLoggedIn(result);
    } catch (e) {
      setLoggedIn(false);
    } finally {
      setChecking(false);
    }
  };

  // Jab tak token check ho raha hai, loading screen dikhao
  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={loggedIn ? "MainTabs" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={BottomTab} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F2548",
    alignItems: "center",
    justifyContent: "center",
  },
});