// ./app/(drawer)/(tabs)/hidden.web.tsx
import useAuthRedirect from "../../../hooks/useAuthRedirect";
import "../../../styles/css/hidden.css";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";

const Hidden = () => {
  const authRedirect = useAuthRedirect();
  const { themeTextColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="hidden-wrapper">
      <div className="contents-container">
        <p style={{ color: themeTextColor }}>Hidden Screen (web)</p>
      </div>
    </div>
  );
};

export default Hidden;
