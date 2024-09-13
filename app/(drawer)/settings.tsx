// ./app/(drawer)/settings.tsx
import { useContext, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";

import useAuthRedirect from "../../hooks/useAuthRedirect";
import { AuthContext } from "../../contexts/AuthContext";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { StatusType } from "../../types/types";
import FormReauthenticationMobile from "../../components/forms/FormReauthenticationMobile";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";
import Spacer from "../../components/utils/Spacer";

const Settings = () => {
  const authRedirect = useAuthRedirect();
  const { setUser } = useContext(AuthContext);
  const { globalStyles } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");
  const [showReauthenticationModal, setShowReauthenticationModal] =
    useState(false);

  if (authRedirect) {
    return authRedirect;
  }

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const currentUser = auth().currentUser;

            if (currentUser) {
              const isEmailPasswordProvider = currentUser.providerData.some(
                (provider) => provider.providerId === "password"
              );

              const isGoogleProvider = currentUser.providerData.some(
                (provider) => provider.providerId === "google.com"
              );

              if (isEmailPasswordProvider) {
                setShowReauthenticationModal(true);
              } else if (isGoogleProvider) {
                // Handle Google Sign-In reauthentication
                try {
                  await GoogleSignin.hasPlayServices();
                  const userInfo = await GoogleSignin.signIn();
                  const idToken = userInfo.data?.idToken;

                  if (!idToken) {
                    throw new Error("No idToken found");
                  }

                  const googleCredential =
                    auth.GoogleAuthProvider.credential(idToken);
                  await currentUser.reauthenticateWithCredential(
                    googleCredential
                  );
                  deleteUser(currentUser);
                } catch (error: any) {
                  Alert.alert("Reauthentication failed", "Please try again.");
                  console.error("Reauthentication failed:", error);
                }
              } else {
                Alert.alert(
                  "Unsupported provider",
                  "Account deletion is not supported for this provider."
                );
              }
            }
          },
        },
      ]
    );
  };

  const reauthenticateWithEmailPassword = async (
    email: string,
    password: string
  ) => {
    setStatus("loading");

    try {
      const currentUser = auth().currentUser;
      if (currentUser && email && password) {
        const credential = auth.EmailAuthProvider.credential(email, password);
        await currentUser.reauthenticateWithCredential(credential);
        deleteUser(currentUser);
      }
    } catch (error: any) {
      Alert.alert("Reauthentication failed", "Please try again.");
      console.error("Reauthentication failed:", error);
    } finally {
      setStatus("idle");
      setShowReauthenticationModal(false);
    }
  };

  const deleteUser = async (currentUser: FirebaseAuthTypes.User) => {
    setStatus("loading");

    try {
      await firestore().collection("users").doc(currentUser.uid).delete();
      await currentUser.delete();
      setUser(null);
      Alert.alert(
        "Account Deleted",
        "Your account has been deleted successfully."
      );
    } catch (error: any) {
      Alert.alert("Authentication Failed", `Error: ${error}`);
      console.log("Error", error.message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <>
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <View style={globalStyles.container}>
          <Text style={globalStyles.textBlack}>Settings Screen</Text>
          <Spacer marginBottom={20} />
          <Pressable onPress={handleDeleteAccount}>
            <Text style={globalStyles.textMedium}>Delete Account</Text>
          </Pressable>
        </View>
      )}

      <FormReauthenticationMobile
        visible={showReauthenticationModal}
        onReauthenticate={reauthenticateWithEmailPassword}
        onCancel={() => {
          setShowReauthenticationModal(false);
        }}
      />
    </>
  );
};

export default Settings;
