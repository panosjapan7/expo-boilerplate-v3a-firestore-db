// ./hooks/updateFirestore.ts

import { Platform } from "react-native";
import { webFirestore } from "../firebase/firebaseConfig";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

type UpdateAction = "add" | "delete" | "update";
type UpdateFirestoreType = {
  uid: string;
  field: string;
  value: string | string[];
  action?: UpdateAction;
};

export const updateFirestore = async ({
  uid,
  field,
  value,
  action,
}: UpdateFirestoreType): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (!webFirestore) {
        throw new Error("Firestore is not initialized for web.");
      }

      const userDocRef = doc(webFirestore, "users", uid);

      if (action === "add") {
        await updateDoc(userDocRef, {
          [field]: arrayUnion(value),
        });
      } else if (action === "delete") {
        await updateDoc(userDocRef, {
          [field]: arrayRemove(value),
        });
      } else {
        await updateDoc(userDocRef, {
          [field]: value,
        });
      }
    } else {
      const userDocRef = firestore().collection("users").doc(uid);

      if (action === "add") {
        await userDocRef.update({
          [field]: firestore.FieldValue.arrayUnion(value),
        });
      } else if (action === "delete") {
        await userDocRef.update({
          [field]: firestore.FieldValue.arrayRemove(value),
        });
      } else {
        await userDocRef.update({
          [field]: value,
        });
      }
    }
    console.log("Firestore document updated successfully!");
  } catch (error: any) {
    console.error("Error updating Firestore document:", error.message);
    throw error;
  }
};
