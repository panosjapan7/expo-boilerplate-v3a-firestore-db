// ./components/forms/FormUpdatePasswordMobile.tsx
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
  validatePassword,
} from "../../hooks/validations";
import { StatusType } from "../../types/types";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import Spacer from "../utils/Spacer";
import InputLabelMobile from "../inputs/InputLabelMobile";
import InputPasswordMobile from "../inputs/InputPasswordMobile";
import LoadingIndicator from "../indicators/LoadingIndicator";
import ButtonSubmitFormMobile from "../buttons/ButtonSubmitFormMobile";
import { updateUserPassword } from "../../hooks/accountActionsMobile";

type FormUpdatePasswordMobileType = {
  visible: boolean;
  setStatus: (status: StatusType) => void;
  onCancel: () => void;
  setShowUpdatePasswordModal: (showUpdatePasswordModal: boolean) => void;
};

const FormUpdatePasswordMobile = ({
  visible,
  onCancel,
  setShowUpdatePasswordModal,
}: FormUpdatePasswordMobileType) => {
  const { globalStyles } = useGlobalStyles();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState<StatusType>("idle");
  const newPasswordInputRef = useRef<TextInput>(null);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    setStatus("loading");
    try {
      await updateUserPassword(currentPassword, newPassword, setMessage);
      //   setShowUpdatePasswordModal(false);
    } catch (error: any) {
      console.log("Error: ", error);
    } finally {
      setStatus("idle");
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    onCancel();
  };

  useDebouncedValidation(
    newPassword,
    validatePassword,
    setNewPasswordErrorMessage,
    "must be at least 6 characters"
  );

  useEffect(() => {
    setIsButtonDisabled(!validatePassword(newPassword));
  }, [newPassword]);

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
              <Text style={globalStyles.textBold}>Update Password</Text>
              <Spacer marginVertical={10} />
              <Text>{message}</Text>
              <Spacer marginVertical={10} />
              <InputLabelMobile caption="Current Password" />
              <InputPasswordMobile
                value={currentPassword}
                setValue={setCurrentPassword}
                hidePassword={hideCurrentPassword}
                setHidePassword={setHideCurrentPassword}
                returnKeyType="next"
              />
              <Spacer marginVertical={10} />
              <InputLabelMobile
                caption="New Password "
                errorMessage={newPasswordErrorMessage}
              />
              <InputPasswordMobile
                value={newPassword}
                setValue={setNewPassword}
                ref={newPasswordInputRef}
                hidePassword={hideNewPassword}
                setHidePassword={setHideNewPassword}
                returnKeyType="done"
              />
              <Spacer marginVertical={10} />
              <ButtonSubmitFormMobile
                onPress={handleUpdatePassword}
                buttonText="Update Password"
                isDisabled={isButtonDisabled}
              />
              <Spacer marginVertical={6} />

              <Pressable
                onPress={handleCancel}
                style={globalStyles.buttonWithBorder}
              >
                <Text style={globalStyles.textMedium}>Close</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FormUpdatePasswordMobile;
