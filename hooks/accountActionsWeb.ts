// ./hooks/accountActionsWeb.ts
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  updatePassword,
} from "firebase/auth";
// @ts-ignore
import { signInWithPopup } from "firebase/auth";

import { webAuth } from "../firebase/firebaseConfig";
import { FirebaseFirestoreService } from "../services/firestore/FirebaseFirestoreService";

export const handleDeleteAccount = async (
  setShowReauthenticationForm: (showReauthenticationForm: boolean) => void
) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    const isEmailPasswordProvider = currentUser.providerData.some(
      (provider) => provider.providerId === "password"
    );

    const isGoogleProvider = currentUser.providerData.some(
      (provider) => provider.providerId === "google.com"
    );

    if (isEmailPasswordProvider) {
      setShowReauthenticationForm(true);
    } else if (isGoogleProvider) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(webAuth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (!credential) {
          throw new Error(
            "Failed to obtain Google credential for reauthentication."
          );
        }

        await reauthenticateWithCredential(currentUser, credential);

        // Delete the user after reauthentication
        await FirebaseFirestoreService.deleteFirebaseUser(currentUser);
      } catch (error: any) {
        console.error("Reauthentication failed:", error.message);
        alert("Reauthentication failed. Please try again.");
      } finally {
        setShowReauthenticationForm(false);
      }
    } else {
      console.log(
        "Unsupported provider. Account deletion is not supported for this provider."
      );
      alert(
        "Unsupported provider. Account deletion is not supported for this provider."
      );
    }
  }
};

export const reauthenticateWithEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser && email && password) {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await FirebaseFirestoreService.deleteFirebaseUser(currentUser);
    }
  } catch (error: any) {
    console.error("Reauthentication failed:", error);
  }
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string,
  setErrorMessage: (message: string) => void,
  setSuccessMessage: (message: string) => void
) => {
  setErrorMessage("");
  setSuccessMessage("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser && currentUser?.email) {
    try {
      // First, re-authenticate the user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      // Then, update the password
      await updatePassword(currentUser, newPassword);
      console.log("Password updated successfully");
      setSuccessMessage("Password updated successfully");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        console.error("Current password is incorrect");
        console.log("Before setting message");
        setErrorMessage("Current password is incorrect");
        console.log("After setting message");
      } else {
        console.error("Error updating password: ", error.message);
        console.log("Before setting message");
        setErrorMessage(`Error updating password: ${error.message}`);
        console.log("After setting message");
      }
    }
  } else {
    console.error("No user is currently signed in or user email is missing");
    setErrorMessage("No user is currently signed in or user email is missing");
    throw new Error("No user is currently signed in or user email is missing");
  }
};
