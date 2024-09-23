// ./services/firestore/FirebaseFirestoreService.ts
import { Alert, Platform } from "react-native";
import {
  deleteUser as deleteWebUser,
  User as FirebaseUserWeb,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { webFirestore } from "../../firebase/firebaseConfig";
import { AuthProviderType, UserDetailsType } from "../../types/databaseTypes";

type MessageType = {
  content: string;
  createdAt: Timestamp;
  userId: string;
  senderName: string;
};

type User = FirebaseUserWeb | FirebaseAuthTypes.User;

const addMessageToUser = async (
  userId: string,
  message: Omit<MessageType, "createdAt">
) => {
  if (Platform.OS === "web") {
    if (!webFirestore) {
      throw new Error("Firestore is not initialized for web.");
    }

    const userDocRef = doc(webFirestore, "users", userId);
    const messagesCollectionRef = collection(userDocRef, "messages");
    await addDoc(messagesCollectionRef, {
      ...message,
      createdAt: serverTimestamp(),
    });
  } else {
    const userDocRef = firestore().collection("users").doc(userId);
    await userDocRef.collection("messages").add({
      ...message,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }
};

const getUserMessages = async (userId: string): Promise<MessageType[]> => {
  if (Platform.OS === "web") {
    if (!webFirestore) {
      throw new Error("Firestore is not initialized for web.");
    }
    const userDocRef = doc(webFirestore, "users", userId);
    const messagesCollectionRef = collection(userDocRef, "messages");
    const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as MessageType);
  } else {
    const userDocRef = firestore().collection("users").doc(userId);
    const querySnapshot = await userDocRef
      .collection("messages")
      .orderBy("createdAt", "asc")
      .get();

    return querySnapshot.docs.map((doc) => doc.data() as MessageType);
  }
};

const deleteFirebaseUser = async (
  currentUser: FirebaseUserWeb | FirebaseAuthTypes.User
) => {
  try {
    if (Platform.OS === "web") {
      if (!webFirestore) {
        throw new Error("Firestore is not initialized for web.");
      }

      const db = getFirestore();
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);

      await deleteWebUser(currentUser as FirebaseUserWeb);
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

const getUserDetailsFromFirestore = async (uid: string): Promise<any> => {
  if (Platform.OS === "web") {
    if (webFirestore) {
      const docRef = doc(webFirestore, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      throw new Error("Firestore is not initialized for web.");
    }
  } else {
    const docSnap = await firestore().collection("users").doc(uid).get();
    return docSnap.exists ? docSnap.data() : null;
  }
};

const getUsersByRole = async (role: string) => {
  if (Platform.OS === "web") {
    if (!webFirestore) {
      throw new Error("Firestore is not initialized for web.");
    }

    const usersRef = collection(webFirestore, "users");
    const q = query(usersRef, where("role", "array-contains", role));
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => doc.data());
    return users;
  } else {
    const userRef = firestore().collection("users");
    const querySnapshot = await userRef
      .where("role", "array-contains", role)
      .get();

    const users = querySnapshot.docs.map((doc) => doc.data());
    return users;
  }
};

const saveUserToFirestoreWeb = async (
  user: User,
  magicEmailUsed = false,
  tenantIds: string[] = [],
  primaryTenantId?: string
) => {
  try {
    // Ensure Firestore is initialized
    if (!webFirestore) throw new Error("Firestore is not initialized for web.");

    const userDocRef = doc(collection(webFirestore, "users"), user.uid);
    const docSnap = await getDoc(userDocRef);

    const newAuthProviders = user.providerData.map(
      (provider) => provider.providerId as AuthProviderType
    );

    const userDetails: Partial<UserDetailsType> = {
      authProviders: newAuthProviders,
      lastLogin: serverTimestamp(),
    };

    if (!docSnap.exists()) {
      // New user - set full details
      const initialUserDetails: UserDetailsType = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        authProviders: newAuthProviders,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: ["Member"], // Default role
        magicEmailUsed,
      };
      await setDoc(userDocRef, initialUserDetails);
    } else {
      // Existing user - update only necessary fields
      const existingData = docSnap.data() as UserDetailsType;

      // Update auth providers if new ones are added
      const updatedAuthProviders = Array.from(
        new Set([...existingData.authProviders, ...newAuthProviders])
      );
      if (updatedAuthProviders.length !== existingData.authProviders.length) {
        userDetails.authProviders = updatedAuthProviders;
      }

      // Update magicEmailUsed only if it was false before
      if (magicEmailUsed && !existingData.magicEmailUsed) {
        userDetails.magicEmailUsed = true;
      }

      // Update tenant info if provided and different
      if (tenantIds.length > 0 && tenantIds !== existingData.tenantIds) {
        userDetails.tenantIds = tenantIds;
      }
      if (primaryTenantId && primaryTenantId !== existingData.primaryTenantId) {
        userDetails.primaryTenantId = primaryTenantId;
      }

      // Update displayName if changed
      if (user.displayName && user.displayName !== existingData.displayName) {
        userDetails.displayName = user.displayName;
      }

      // Apply updates only if there are any
      await updateDoc(userDocRef, userDetails);
    }
  } catch (error: any) {
    console.error("Error saving user to Firestore: ", error);
    throw new Error(error.message);
  }
};

const saveUserToFirestoreMobile = async (
  user: FirebaseAuthTypes.User,
  magicEmailUsed = false,
  tenantIds: string[] = [],
  primaryTenantId?: string
) => {
  try {
    const userDocRef = firestore().collection("users").doc(user.uid);
    const doc = await userDocRef.get();

    const newAuthProviders = user.providerData.map(
      (provider) => provider.providerId as AuthProviderType
    );

    if (!doc.exists) {
      const userDetails: UserDetailsType = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        authProviders: newAuthProviders,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLogin: firestore.FieldValue.serverTimestamp(),
        role: ["Member"], // Default role
        magicEmailUsed: magicEmailUsed,
      };

      // Add tenant-related fields only if they are provided
      if (tenantIds.length > 0) {
        userDetails.tenantIds = tenantIds;
      }
      if (primaryTenantId) {
        userDetails.primaryTenantId = primaryTenantId;
      }

      await userDocRef.set(userDetails);
    } else {
      const existingData = doc.data() as UserDetailsType;

      const uniqueNewProviders = newAuthProviders.filter(
        (provider) => !existingData.authProviders.includes(provider)
      );

      if (uniqueNewProviders.length > 0) {
        const updatedAuthProviders = Array.from(
          new Set([...existingData.authProviders, ...uniqueNewProviders])
        );

        await userDocRef.update({
          authProviders: updatedAuthProviders,
        });
      }

      // Only update magicEmailUsed if it was previously false and this login used magic email
      if (!existingData.magicEmailUsed && magicEmailUsed) {
        await userDocRef.update({
          magicEmailUsed: true,
        });
      }

      // Optionally, update tenant information if provided
      if (tenantIds.length > 0 && tenantIds !== existingData.tenantIds) {
        await userDocRef.update({
          tenantIds: tenantIds,
        });
      }

      if (primaryTenantId && primaryTenantId !== existingData.primaryTenantId) {
        await userDocRef.update({
          primaryTenantId: primaryTenantId,
        });
      }

      // Always update the lastLogin timestamp
      await userDocRef.update({
        lastLogin: firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error: any) {
    console.error("Error saving user to Firestore: ", error);
    throw new Error(error.message);
  }
};

export const FirebaseFirestoreService = {
  addMessageToUser,
  getUserMessages,
  deleteFirebaseUser,
  getUsersByRole,
  saveUserToFirestoreMobile,
  saveUserToFirestoreWeb,
  getUserDetailsFromFirestore,
};
