// storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  console.log("StoreData key value", key ,value)
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(key," saved! in async storage");

  } catch (e) {
    console.log("Store error:", e);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.log("Get error:", e);
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("Remove error:", e);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log("Clear error:", e);
  }
};
