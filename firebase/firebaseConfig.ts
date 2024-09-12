// ./firebase/firebaseConfig.ts
import { Platform } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase app if it's not already initialized
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0]; // Reuse existing Firebase app

// Initialize Firebase Auth
let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(firebaseApp);
} else {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Initialize Firestore
let webFirestore: Firestore | undefined;
if (Platform.OS === "web") {
  webFirestore = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    }),
  });
}

export { auth as webAuth, webFirestore };
