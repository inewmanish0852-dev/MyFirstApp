import AsyncStorage from "@react-native-async-storage/async-storage";
const TOKEN_KEY = "token";

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.log("Token Save Error", error);
  }
};


export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.log("Token Get Error", error);
    return null;
  }
};


export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.log("Token Remove Error", error);
  }
};


export const isLoggedIn = async () => {
  const token = await getToken();
  return token !== null;
};