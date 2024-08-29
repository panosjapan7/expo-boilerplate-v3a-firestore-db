// ./client/app/login.web.tsx
import useAuthRedirect from "../hooks/useAuthRedirect";
import "../styles/css/login.css";
import { useGlobalStyles } from "../styles/stylesheets/globalStyles";
import FormLoginWeb from "../components/forms/FormLoginWeb";

const Login = () => {
  const authRedirect = useAuthRedirect();
  const { themeBackgroundColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div
      className="login-wrapper"
      style={{ backgroundColor: themeBackgroundColor }}
    >
      <div className="contents-container">
        <FormLoginWeb />
      </div>
    </div>
  );
};

export default Login;
