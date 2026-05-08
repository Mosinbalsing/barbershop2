// storage.js
// cspell:ignore MMKV mmkv
import { MMKV } from "react-native-mmkv";
console.log("MMKV", MMKV);

const storage = new MMKV();

export const storeData = async (key, value) => {
  try {
    if (value === undefined) {
      storage.delete(key);
      return;
    }

    storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.log("Store error:", e);
  }
};

export const getData = async (key) => {
  try {
    const value = storage.getString(key);

    if (value == null) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (e) {
    console.log("Get error:", e);
  }
};

export const removeData = async (key) => {
  try {
    storage.delete(key);
  } catch (e) {
    console.log("Remove error:", e);
  }
};

export const clearAll = async () => {
  try {
    storage.clearAll();
  } catch (e) {
    console.log("Clear error:", e);
  }
};