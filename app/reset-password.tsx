// ./app/reset-password.tsx
import { Platform, StatusBar } from "react-native";

import useAuthRedirect from "../hooks/useAuthRedirect";
import { useThemeContext } from "../contexts/ThemeContext";
import FormResetPasswordMobile from "../components/forms/FormResetPasswordMobile";

const ResetPassword = () => {
  const authRedirect = useAuthRedirect();
  const { theme } = useThemeContext();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <>
      <StatusBar
        barStyle={
          Platform.OS === "ios"
            ? "light-content"
            : theme === "light"
            ? "dark-content"
            : "light-content"
        }
        key={theme}
      />
      <FormResetPasswordMobile />
    </>
  );
};

export default ResetPassword;
