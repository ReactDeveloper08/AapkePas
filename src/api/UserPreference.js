'use strict';
import AsyncStorage from '@react-native-community/async-storage';
import {encryptData, decryptData} from './EncryptionUtility';

// User Preferences Keys
export const KEYS = {
  USER_INFO: 'userInfo',
  DEVICE_UNIQUE_ID: 'deviceId',
  WALLET_BALANCE: 'walletBalance',
  WISE_LOCATION: 'location_data',
  NWE_LOCATION: 'location',
  NEW_CURRENCY: 'currency',
  FIREBASE_AUTH: 'isChatEnable',
  CONSULTATION_ID: 'consultationId',
  CHANNEL_DATA: 'channelDeta2',
};

// Methods
export const storeData = async (key, data) => {
  // console.log('store Data01))', data);
  try {
    const info = JSON.stringify(data);
    // console.log('Info ==', info);
    const encryptedInfo = await encryptData(info);
    await AsyncStorage.setItem(key, encryptedInfo);
  } catch (error) {
    console.log(error.message);
  }
};

export const getData = async key => {
  try {
    const rawData = await AsyncStorage.getItem(key);
    if (!rawData) {
      return null;
    }

    const decryptedInfo = await decryptData(rawData);
    const info = JSON.parse(decryptedInfo);
    return info;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error.message);
  }
};
