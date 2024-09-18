// ./app/(drawer)/settings.web.tsx
import { useContext, useEffect, useState } from "react";

import useAuthRedirect from "../../hooks/useAuthRedirect";
import { AuthContext } from "../../contexts/AuthContext";
import { StatusType } from "../../types/types";
import "../../styles/css/settings.css";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { handleDeleteAccount } from "../../hooks/accountActionsWeb";
import FormReauthenticationWeb from "../../components/forms/FormReauthenticationWeb";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";
import { FirebaseFirestoreService } from "../../services/firestore/FirebaseFirestoreService";
import UserRolesWeb from "../../components/settings/UserRolesWeb";
import UserDisplayNameWeb from "../../components/settings/UserDisplayNameWeb";

const Settings = () => {
  const authRedirect = useAuthRedirect();
  const { user, setUserDetails } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");
  const [showReauthenticationForm, setShowReauthenticationForm] =
    useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const details =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);
        setUserDetails(details);
      }
    };

    fetchUserDetails();
  }, [user, setUserDetails]);

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <>
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <div className="settings-wrapper">
          <div className="contents-container">
            <p style={{ color: themeTextColor }}>Settings Screen (web)</p>
            <UserDisplayNameWeb setStatus={setStatus} />
            <UserRolesWeb setStatus={setStatus} />
            <p
              className="settings-link textMedium"
              onClick={() => handleDeleteAccount(setShowReauthenticationForm)}
              style={{ color: themeTextColor }}
            >
              Delete Account
            </p>
            {showReauthenticationForm ? (
              <FormReauthenticationWeb
                visible={showReauthenticationForm}
                setStatus={setStatus}
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
