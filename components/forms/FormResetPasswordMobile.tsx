// ./components/forms/FormResetPasswordMobile.tsx
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";

import { StatusType } from "../../types/types";
import { useDebouncedValidation, validateEmail } from "../../hooks/validations";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import InputEmailMobile from "../inputs/InputEmailMobile";
import InputLabelMobile from "../inputs/InputLabelMobile";
import ButtonSubmitFormMobile from "../buttons/ButtonSubmitFormMobile";
import LoadingIndicator from "../indicators/LoadingIndicator";

const FormResetPasswordMobile = () => {
  const { globalStyles, themeHeaderTextColor } = useGlobalStyles();
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState<StatusType>("idle");

  const handleResetPassword = async () => {
    setStatus("loading");
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("Success", `Reset Password email sent sent to ${email}`);
      console.log(`Reset Password email sent sent to ${email}`);
      setEmail("");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.log("Error", error.message);
    } finally {
      setStatus("idle");
    }
  };

  useDebouncedValidation(
    email,
    validateEmail,
    setEmailErrorMessage,
    "is invalid"
  );

  useEffect(() => {
    setIsButtonDisabled(!validateEmail(email));
  }, [email]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={globalStyles.container}>
            <InputLabelMobile
              caption="Email "
              errorMessage={emailErrorMessage}
            />

            <InputEmailMobile
              value={email}
              setValue={setEmail}
              returnKeyType="done"
            />

            <ButtonSubmitFormMobile
              onPress={handleResetPassword}
              isDisabled={isButtonDisabled}
              buttonText="Reset Password"
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};
export default FormResetPasswordMobile;
