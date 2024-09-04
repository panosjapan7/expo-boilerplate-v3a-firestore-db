// ./app/login.tsx
import { useContext, useEffect, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import useAuthRedirect from "../hooks/useAuthRedirect";
import { AuthContext } from "../contexts/AuthContext";
import { StatusType } from "../types/types";
import FormLoginMobile from "../components/forms/FormLoginMobile";
import LoadingIndicator from "../components/indicators/LoadingIndicator";

const Login = () => {
  const authRedirect = useAuthRedirect();
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState<null | Error>(null);
  const [status, setStatus] = useState<StatusType>("idle");

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
    });
  }, []);

  const signInWithGoogle = async () => {
    setStatus("loading");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("No idToken found");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const user = userCredential.user;
      setUser(user);
      Alert.alert("Success!", "User logged in successfully");
      console.log("User logged in successfully");
    } catch (error: any) {
      setError(error.message);
      console.log("Error: ", error.message);
    } finally {
      setStatus("idle");
    }
  };

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <>
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <>
          <Pressable onPress={signInWithGoogle}>
            <Text>Sign in with Google</Text>
          </Pressable>
          <FormLoginMobile />
        </>
      )}
    </>
  );
};

export default Login;
