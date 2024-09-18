// ./hooks/accountActionsMobile.ts
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { FirebaseFirestoreService } from "../services/firestore/FirebaseFirestoreService";

export const handleDeleteAccount = async (
  setShowReauthenticationModal: (setShowReauthenticationModal: boolean) => void
) => {
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
                await FirebaseFirestoreService.deleteFirebaseUser(currentUser);
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

export const reauthenticateWithEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser && email && password) {
      const credential = auth.EmailAuthProvider.credential(email, password);
      await currentUser.reauthenticateWithCredential(credential);
      FirebaseFirestoreService.deleteFirebaseUser(currentUser);
    }
  } catch (error: any) {
    Alert.alert("Reauthentication failed", "Please try again.");
    console.error("Reauthentication failed:", error);
  }
};
