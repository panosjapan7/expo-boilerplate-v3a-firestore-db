// ./hooks/getUserDetailsFromFirestore.ts
import { Platform } from "react-native";
import { collection, doc, getDoc } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

import { webFirestore } from "../firebase/firebaseConfig";
import { UserDetailsType } from "../types/databaseTypes";

export const getUserDetailsFromFirestore = async (
  uid: string
): Promise<UserDetailsType | null> => {
  try {
    if (Platform.OS === "web") {
      if (!webFirestore) {
        throw new Error("Firestore is not initialized for web.");
      }

      // For web platform using modular Firebase
      const userDocRef = doc(collection(webFirestore, "users"), uid);
      const docSnap = await getDoc(userDocRef);
      return docSnap.exists() ? (docSnap.data() as UserDetailsType) : null;
    } else {
      // For mobile platform using react-native-firebase
      const docSnap = await firestore().collection("users").doc(uid).get();
      return docSnap.exists ? (docSnap.data() as UserDetailsType) : null;
    }
  } catch (error: any) {
    console.error("Error fetching user details: ", error.message);
    return null;
  }
};
