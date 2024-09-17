// ./app/(drawer)/settings.tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  handleDeleteAccount,
  reauthenticateWithEmailPassword,
} from "../../hooks/accountActionsMobile";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { StatusType } from "../../types/types";
import FormReauthenticationMobile from "../../components/forms/FormReauthenticationMobile";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";
import Spacer from "../../components/utils/Spacer";
import UserRolesMobile from "../../components/settings/UserRolesMobile";
import UserDisplayNameMobile from "../../components/settings/UserDisplayNameMobile";

const Settings = () => {
  const authRedirect = useAuthRedirect();
  const { globalStyles } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");
  const [showReauthenticationModal, setShowReauthenticationModal] =
    useState(false);

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <>
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <View style={globalStyles.container}>
          <UserDisplayNameMobile setStatus={setStatus} />
          <Spacer marginBottom={20} />
          <UserRolesMobile setStatus={setStatus} />
          <Spacer marginBottom={20} />
          <Pressable
            onPress={() => handleDeleteAccount(setShowReauthenticationModal)}
          >
            <Text style={globalStyles.textMedium}>Delete Account</Text>
          </Pressable>
        </View>
      )}

      <FormReauthenticationMobile
        visible={showReauthenticationModal}
        reauthenticateWithEmailPassword={reauthenticateWithEmailPassword}
        onCancel={() => {
          setShowReauthenticationModal(false);
        }}
        setStatus={setStatus}
        setShowReauthenticationModal={setShowReauthenticationModal}
      />
    </>
  );
};

export default Settings;
