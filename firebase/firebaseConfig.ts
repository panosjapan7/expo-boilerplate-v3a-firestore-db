// ./firebase/firebaseConfig.ts
import { Platform } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const webFirestore = firebase.firestore();

if (Platform.OS === "web") {
  webFirestore.enablePersistence({ synchronizeTabs: true }).catch((error) => {
    if (error.code === "failed-precondition") {
      console.error(
        "Multiple tabs open, persistence can only be enabled in one tab."
      );
    } else if (error.code === "unimplemented") {
      console.error(
        "The current browser does not support all features required for persistence"
      );
    }
  });
}

export { auth as webAuth, webFirestore };
