// ./hooks/saveUserToFirestore.ts
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { webFirestore } from "../firebase/firebaseConfig";
import { UserDetailsType, AuthProviderType } from "../types/databaseTypes";

export const saveUserToFirestoreMobile = async (
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

export const saveUserToFirestoreWeb = async (
  user: User,
  magicEmailUsed = false,
  tenantIds: string[] = [],
  primaryTenantId?: string
) => {
  try {
    // Ensure `webFirestore` is defined before using it
    if (!webFirestore) {
      throw new Error("Firestore is not initialized for web.");
    }

    const userDocRef = doc(collection(webFirestore, "users"), user.uid);
    const docSnap = await getDoc(userDocRef);

    const newAuthProviders = user.providerData.map(
      (provider) => provider.providerId as AuthProviderType
    );

    if (!docSnap.exists()) {
      const userDetails: UserDetailsType = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        authProviders: newAuthProviders,
        createdAt: serverTimestamp(), // Use Firestore server timestamp
        lastLogin: serverTimestamp(),
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

      await setDoc(userDocRef, userDetails);
    } else {
      const existingData = docSnap.data() as UserDetailsType;

      // If user document exists, check for new auth providers
      const uniqueNewProviders = newAuthProviders.filter(
        (provider) => !existingData.authProviders.includes(provider)
      );

      if (uniqueNewProviders.length > 0) {
        // If there are new providers, update the authProviders array
        const updatedAuthProviders = Array.from(
          new Set([...existingData.authProviders, ...uniqueNewProviders])
        );

        await updateDoc(userDocRef, {
          authProviders: updatedAuthProviders,
        });
      }

      // Only update magicEmailUsed if it was previously false and this login used magic email
      if (!existingData.magicEmailUsed && magicEmailUsed) {
        await updateDoc(userDocRef, {
          magicEmailUsed: true,
        });
      }

      // Optionally, update tenant information if provided
      if (tenantIds.length > 0 && tenantIds !== existingData.tenantIds) {
        await updateDoc(userDocRef, {
          tenantIds: tenantIds,
        });
      }

      if (primaryTenantId && primaryTenantId !== existingData.primaryTenantId) {
        await updateDoc(userDocRef, {
          primaryTenantId: primaryTenantId,
        });
      }

      // Update displayName if it has changed
      if (user.displayName && user.displayName !== existingData.displayName) {
        await updateDoc(userDocRef, {
          displayName: user.displayName,
        });
      }

      // Always update lastLogin with server timestamp when the user logs in
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
      });
    }
  } catch (error: any) {
    console.error("Error saving user to Firestore: ", error);
    throw new Error(error.message);
  }
};
