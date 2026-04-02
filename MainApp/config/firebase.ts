import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error - getReactNativePersistence is available at runtime in RN but may be missing in some Firebase internal types
  getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const GoogleConfig = {
  webClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOSCLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_ANDROIDCLIENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });

export const db = getFirestore(app);
export const storage = getStorage(app);
