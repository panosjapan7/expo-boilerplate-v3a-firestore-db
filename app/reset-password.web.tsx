// ./client/app/reset-password.web.tsx
import useAuthRedirect from "../hooks/useAuthRedirect";
import { useGlobalStyles } from "../styles/stylesheets/globalStyles";
import "../styles/css/reset-password.css";
import FormResetPasswordWeb from "../components/forms/FormResetPasswordWeb";

const ResetPassword = () => {
  const authRedirect = useAuthRedirect();
  const { themeBackgroundColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div
      className="resetPassword-wrapper"
      style={{ backgroundColor: themeBackgroundColor }}
    >
      <div className="contents-container">
        <FormResetPasswordWeb />
      </div>
    </div>
  );
};

export default ResetPassword;
