// ./hooks/accountActionsWeb.ts
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
// @ts-ignore
import { signInWithPopup } from "firebase/auth";

import { webAuth } from "../firebase/firebaseConfig";
import { deleteFirebaseUser } from "./deleteFirebaseUser";

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
        await deleteFirebaseUser(currentUser);
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
      await deleteFirebaseUser(currentUser);
    }
  } catch (error: any) {
    console.error("Reauthentication failed:", error);
  }
};
