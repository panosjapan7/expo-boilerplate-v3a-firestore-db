// ./components/forms/FormUpdatePasswordWeb.tsx
import { useEffect, useState } from "react";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { StatusType } from "../../types/types";
import { updateUserPassword } from "../../hooks/accountActionsWeb";
import {
  useDebouncedValidation,
  validatePassword,
} from "../../hooks/validations";
import { Colors } from "../../styles/colors";
import InputFormWeb from "../inputs/InputFormWeb";
import ButtonSubmitFormWeb from "../buttons/ButtonSubmitFormWeb";
import LoadingIndicator from "../indicators/LoadingIndicator";

type FormUpdatePasswordWebType = {
  visible: boolean;
  onCancel: () => void;
  setShowUpdatePasswordForm: (showUpdatePasswordForm: boolean) => void;
};

const FormUpdatePasswordWeb = ({
  onCancel,
  setShowUpdatePasswordForm,
}: FormUpdatePasswordWebType) => {
  const { themeHeaderTextColor, themeTextColor } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateUserPassword = async () => {
    setStatus("loading");
    try {
      await updateUserPassword(
        currentPassword,
        newPassword,
        setErrorMessage,
        setSuccessMessage
      );
      //   setShowUpdatePasswordForm(false);
    } catch (error) {
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
    <>
      {status === "loading" ? (
        <div>
          <LoadingIndicator />
        </div>
      ) : (
        <div
          className="form-container"
          style={{
            borderColor: Colors.gray300,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <p
            className="form-header"
            style={{
              color: themeTextColor,
            }}
          >
            Update Password (web)
          </p>
          {successMessage ? (
            <p style={{ color: "green", marginTop: 0 }}>{successMessage}</p>
          ) : null}
          {errorMessage ? (
            <p style={{ color: "red", marginTop: 0 }}>{errorMessage}</p>
          ) : null}

          <InputFormWeb
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            type="password"
            hidePassword={hideCurrentPassword}
            setHidePassword={setHideCurrentPassword}
          />
          <InputFormWeb
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            type="password"
            errorMessage={newPasswordErrorMessage}
            hidePassword={hideNewPassword}
            setHidePassword={setHideNewPassword}
          />
          <ButtonSubmitFormWeb
            onClick={handleUpdateUserPassword}
            isDisabled={isButtonDisabled}
            caption="Update Password"
          />

          <div className="bottomLinksContainer textBold">
            <p
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              style={{
                color: themeHeaderTextColor,
                textDecorationColor: themeHeaderTextColor,
              }}
            >
              Cancel
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FormUpdatePasswordWeb;
