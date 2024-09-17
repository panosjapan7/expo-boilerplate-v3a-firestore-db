// ./components/forms/FormReauthenticationWeb.tsx
import { useEffect, useState } from "react";

import { reauthenticateWithEmailPassword } from "../../hooks/accountActionsWeb";
import {
  useDebouncedValidation,
  validateEmail,
  validatePassword,
} from "../../hooks/validations";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { Colors } from "../../styles/colors";
import "../../styles/css/form.css";
import { StatusType } from "../../types/types";
import InputFormWeb from "../inputs/InputFormWeb";
import ButtonSubmitFormWeb from "../buttons/ButtonSubmitFormWeb";

type FormReauthenticationWebType = {
  visible: boolean;
  setStatus: (status: StatusType) => void;
  onCancel: () => void;
};

const FormReauthenticationWeb = ({
  setStatus,
  onCancel,
}: FormReauthenticationWebType) => {
  const { themeHeaderTextColor, themeTextColor } = useGlobalStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleReauthentication = async () => {
    setStatus("loading");
    try {
      await reauthenticateWithEmailPassword(email, password);
    } catch (error: any) {
      console.log("Error: ", error);
    } finally {
      setStatus("idle");
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
        Reauthenticate to Delete Account (web)
      </p>
      <InputFormWeb
        label="Email"
        value={email}
        setValue={setEmail}
        type="email"
        errorMessage={emailErrorMessage}
      />
      <InputFormWeb
        label="Password"
        value={password}
        setValue={setPassword}
        type="password"
        errorMessage={passwordErrorMessage}
        hidePassword={hidePassword}
        setHidePassword={setHidePassword}
      />
      <ButtonSubmitFormWeb
        onClick={handleReauthentication}
        isDisabled={isButtonDisabled}
        caption="Delete Account"
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
  );
};

export default FormReauthenticationWeb;
