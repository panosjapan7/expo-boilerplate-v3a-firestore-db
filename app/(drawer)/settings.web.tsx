// ./app/(drawer)/settings.web.tsx
import useAuthRedirect from "../../hooks/useAuthRedirect";
import "../../styles/css/settings.css";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";

const Settings = () => {
  const authRedirect = useAuthRedirect();
  const { themeTextColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="settings-wrapper">
      <div className="contents-container">
        <p style={{ color: themeTextColor }}>Settings Screen (web)</p>
      </div>
    </div>
  );
};

export default Settings;
