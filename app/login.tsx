// ./app/login.tsx
import useAuthRedirect from "../hooks/useAuthRedirect";
import FormLoginMobile from "../components/forms/FormLoginMobile";

const Login = () => {
  const authRedirect = useAuthRedirect();

  if (authRedirect) {
    return authRedirect;
  }

  return <FormLoginMobile />;
};

export default Login;
