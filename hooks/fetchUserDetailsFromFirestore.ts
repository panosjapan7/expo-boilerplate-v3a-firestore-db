// ./hooks/fetchUserDetailsFromFirestore.ts
import { Platform } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { webFirestore } from "../firebase/firebaseConfig";
import { UserDetailsType } from "../types/database";

export const fetchUserDetailsFromFirestore = async (
  uid: string
): Promise<UserDetailsType | null> => {
  try {
    const firestoreInstance =
      Platform.OS === "web" ? webFirestore : firestore();
    const doc = await firestoreInstance.collection("users").doc(uid).get();
    return doc.exists ? (doc.data() as UserDetailsType) : null;
  } catch (error: any) {
    console.error("Error fetching user details: ", error.message);
    return null;
  }
};
