// ./hooks/saveUserToFirestore.ts
import { User } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { webFirestore } from "../firebase/firebaseConfig";
import { UserDetailsType, AuthProviderType } from "../types/database";

export const saveUserToFirestoreMobile = async (
  user: FirebaseAuthTypes.User,
  magicEmailUsed = false
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
  magicEmailUsed = false
) => {
  try {
    const userDocRef = webFirestore.collection("users").doc(user.uid);
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
        authProviders: user.providerData.map(
          (provider) => provider.providerId as AuthProviderType
        ),
        createdAt: serverTimestamp(), // Use Firestore server timestamp
        lastLogin: serverTimestamp(),
        role: ["Member"], // Default role
        magicEmailUsed: magicEmailUsed,
      };
      await userDocRef.set(userDetails);
    } else {
      const existingData = doc.data() as UserDetailsType;

      // If user document exists, check for new auth providers
      const uniqueNewProviders = newAuthProviders.filter(
        (provider) => !existingData.authProviders.includes(provider)
      );

      if (uniqueNewProviders.length > 0) {
        // If there are new providers, update the authProviders array
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

      // Always update lastLogin with server timestamp when the user logs in
      await userDocRef.update({
        lastLogin: serverTimestamp(),
      });
    }
  } catch (error: any) {
    console.error("Error saving user to Firestore: ", error);
    throw new Error(error.message);
  }
};
