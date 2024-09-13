// ./app/(drawer)/settings.web.tsx
import { useContext, useState } from "react";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser as deleteFirebaseUser,
  User,
  GoogleAuthProvider,
} from "firebase/auth";
// @ts-ignore
import { signInWithPopup } from "firebase/auth";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";

import { webAuth } from "../../firebase/firebaseConfig";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { AuthContext } from "../../contexts/AuthContext";
import { StatusType } from "../../types/types";
import "../../styles/css/settings.css";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import FormReauthenticationWeb from "../../components/forms/FormReauthenticationWeb";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";

const Settings = () => {
  const authRedirect = useAuthRedirect();
  const { setUser } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");
  const [showReauthenticationForm, setShowReauthenticationForm] =
    useState(false);

  if (authRedirect) {
    return authRedirect;
  }

  const handleDeleteAccount = async () => {
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
          await deleteAccount(currentUser);
        } catch (error: any) {
          console.error("Reauthentication failed:", error.message);
          alert("Reauthentication failed. Please try again.");
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

  const reauthenticateWithEmailPassword = async (
    email: string,
    password: string
  ) => {
    setStatus("loading");

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && email && password) {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(currentUser, credential);
        await deleteAccount(currentUser);
      }
    } catch (error: any) {
      console.error("Reauthentication failed:", error);
    } finally {
      setStatus("idle");
      setShowReauthenticationForm(false);
    }
  };

  const deleteAccount = async (currentUser: User) => {
    setStatus("loading");

    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);

      await deleteFirebaseUser(currentUser);
      setUser(null);
      console.log(
        "Account Deleted. Your account has been deleted successfully."
      );
    } catch (error: any) {
      console.log("Authentication", error.message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <>
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <div className="settings-wrapper">
          <div className="contents-container">
            <p style={{ color: themeTextColor }}>Settings Screen (web)</p>
            <p
              className="settings-link textMedium"
              onClick={handleDeleteAccount}
              style={{ color: themeTextColor }}
            >
              Delete Account
            </p>
            {showReauthenticationForm ? (
              <FormReauthenticationWeb
                visible={showReauthenticationForm}
                onReauthenticate={reauthenticateWithEmailPassword}
                onCancel={() => setShowReauthenticationForm(false)}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
