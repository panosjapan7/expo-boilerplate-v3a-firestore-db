// ./app/(drawer)/settings.web.tsx
import { useContext, useState } from "react";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser as deleteFirebaseUser,
  User,
} from "firebase/auth";

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
              onClick={() => setShowReauthenticationForm(true)}
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
