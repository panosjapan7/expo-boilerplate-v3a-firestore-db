// ./components/forms/FormReauthenticationMobile.tsx
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  useDebouncedValidation,
  validateEmail,
  validatePassword,
} from "../../hooks/validations";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { StatusType } from "../../types/types";
import LoadingIndicator from "../indicators/LoadingIndicator";
import InputEmailMobile from "../inputs/InputEmailMobile";
import InputLabelMobile from "../inputs/InputLabelMobile";
import InputPasswordMobile from "../inputs/InputPasswordMobile";
import ButtonSubmitFormMobile from "../buttons/ButtonSubmitFormMobile";
import Spacer from "../utils/Spacer";

type FormReauthenticationMobileType = {
  visible: boolean;
  reauthenticateWithEmailPassword: (
    email: string,
    password: string
  ) => Promise<void>;
  setStatus: (status: StatusType) => void;
  onCancel: () => void;
  setShowReauthenticationModal: (showReauthenticationModal: boolean) => void;
};

const FormReauthenticationMobile = ({
  visible,
  reauthenticateWithEmailPassword,
  onCancel,
  setShowReauthenticationModal,
}: FormReauthenticationMobileType) => {
  const { globalStyles } = useGlobalStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState<StatusType>("idle");
  const passwordInputRef = useRef<TextInput>(null);

  const handleReauthentication = async () => {
    setStatus("loading");
    try {
      await reauthenticateWithEmailPassword(email, password);
    } catch (error: any) {
      console.log("Error: ", error);
    } finally {
      setStatus("idle");
      setShowReauthenticationModal(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    onCancel();
  };

  useDebouncedValidation(
    email,
    validateEmail,
    setEmailErrorMessage,
    "is invalid"
  );

  useDebouncedValidation(
    password,
    validatePassword,
    setPasswordErrorMessage,
    "must be at least 6 characters"
  );

  useEffect(() => {
    setIsButtonDisabled(!(validateEmail(email) && validatePassword(password)));
  }, [email, password]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {status === "loading" ? (
          <LoadingIndicator />
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={globalStyles.container}>
              <Text style={globalStyles.textBold}>
                Reauthenticate to Delete Account
              </Text>
              <Spacer marginVertical={10} />
              <InputLabelMobile
                caption="Email "
                errorMessage={emailErrorMessage}
              />
              <InputEmailMobile
                value={email}
                setValue={setEmail}
                returnKeyType="next"
                goToRef={passwordInputRef}
              />
              <InputLabelMobile
                caption="Password "
                errorMessage={passwordErrorMessage}
              />
              <InputPasswordMobile
                value={password}
                setValue={setPassword}
                ref={passwordInputRef}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
                returnKeyType="done"
              />
              <Spacer marginVertical={10} />
              <ButtonSubmitFormMobile
                onPress={handleReauthentication}
                buttonText="Confirm Delete"
                isDisabled={isButtonDisabled}
              />
              <Spacer marginVertical={6} />

              <Pressable
                onPress={handleCancel}
                style={globalStyles.buttonWithBorder}
              >
                <Text style={globalStyles.textMedium}>Cancel</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FormReauthenticationMobile;
