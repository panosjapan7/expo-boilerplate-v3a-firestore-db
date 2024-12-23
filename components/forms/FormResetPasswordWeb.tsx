// ./components/forms/FormResetPasswordWeb.tsx
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";

import { webAuth } from "../../firebase/firebaseConfig";
import { StatusType } from "../../types/types";
import { useDebouncedValidation, validateEmail } from "../../hooks/validations";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { Colors } from "../../styles/colors";
import "../../styles/css/form.css";
import InputFormWeb from "../inputs/InputFormWeb";
import ButtonSubmitFormWeb from "../buttons/ButtonSubmitFormWeb";
import LoadingIndicator from "../indicators/LoadingIndicator";

const FormResetPasswordWeb = () => {
  const { themeHeaderTextColor, themeTextColor } = useGlobalStyles();
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [emailSentMessage, setEmailSentMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState<StatusType>("idle");

  const handleResetPassword = async () => {
    setStatus("loading");
    try {
      await sendPasswordResetEmail(webAuth, email);
      setEmailSentMessage(
        `We have sent you an email at ${email} with  instructions to reset your password.`
      );
      console.log(`Success! Reset Password email sent sent to ${email}`);
      setEmail("");
      router.replace("/login");
    } catch (error: any) {
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
    <>
      {status === "loading" ? (
        <LoadingIndicator />
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
            Reset Password Screen (web)
          </p>
          {emailSentMessage && (
            <p className="emailSentMessage">{emailSentMessage}</p>
          )}
          <InputFormWeb
            label="Email"
            value={email}
            type="email"
            setValue={setEmail}
            errorMessage={emailErrorMessage}
          />
          <ButtonSubmitFormWeb
            onClick={handleResetPassword}
            isDisabled={isButtonDisabled}
            caption="Reset Password"
          />

          <div className="bottomLinksContainer">
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
              style={{
                color: themeHeaderTextColor,
                textDecorationColor: themeHeaderTextColor,
              }}
            >
              Back to Login
            </a>
          </div>
        </div>
      )}
    </>
  );
};
export default FormResetPasswordWeb;
