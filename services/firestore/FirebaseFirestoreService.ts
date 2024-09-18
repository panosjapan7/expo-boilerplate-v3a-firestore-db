// ./services/firestore/FirebaseFirestoreService.ts
import { Alert, Platform } from "react-native";
import {
  deleteUser as deleteWebUser,
  EmailAuthProvider,
  User as FirebaseUserWeb,
  getAuth,
} from "firebase/auth";
import auth from "@react-native-firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import {
  FirebaseAuthTypes,
  reauthenticateWithCredential as reauthenticateWithCredentialWeb,
} from "@react-native-firebase/auth";

import { webFirestore } from "../../firebase/firebaseConfig";
import { AuthProviderType, UserDetailsType } from "../../types/databaseTypes";

type User = FirebaseUserWeb | FirebaseAuthTypes.User;

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
  deleteFirebaseUser,
  saveUserToFirestoreMobile,
  saveUserToFirestoreWeb,
  getUserDetailsFromFirestore,
};
