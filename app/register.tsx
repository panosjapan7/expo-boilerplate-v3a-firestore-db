// ./app/register.tsx
import useAuthRedirect from "../hooks/useAuthRedirect";
import FormRegisterMobile from "../components/forms/FormRegisterMobile";

const Register = () => {
  const authRedirect = useAuthRedirect();

  if (authRedirect) {
    return authRedirect;
  }

  return <FormRegisterMobile />;
};

export default Register;
