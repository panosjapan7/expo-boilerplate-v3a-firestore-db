// ./hooks/deleteFirebaseUser.ts
import { Alert, Platform } from "react-native";
import { deleteUser as deleteWebUser, User as WebUser } from "firebase/auth";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

import { webFirestore } from "../firebase/firebaseConfig";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const deleteFirebaseUser = async (
  currentUser: WebUser | FirebaseAuthTypes.User
) => {
  try {
    if (Platform.OS === "web") {
      if (!webFirestore) {
        throw new Error("Firestore is not initialized for web.");
      }

      const db = getFirestore();
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);

      await deleteWebUser(currentUser as WebUser);
      console.log(
        "Account Deleted. Your account has been deleted successfully."
      );
    } else {
      await firestore().collection("users").doc(currentUser.uid).delete();
      await (currentUser as FirebaseAuthTypes.User).delete();
      Alert.alert(
        "Account Deleted",
        "Your account has been deleted successfully."
      );
      console.log(
        "Account Deleted. Your account has been deleted successfully."
      );
    }
  } catch (error: any) {
    Alert.alert("Authentication Failed", `Error: ${error.message}`);
    console.log("Authentication failed", error.message);
  }
};
