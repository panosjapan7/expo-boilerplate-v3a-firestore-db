// ./app/(drawer)/(tabs)/profile.web.tsx
import useAuthRedirect from "../../../hooks/useAuthRedirect";
import "../../../styles/css/profile.css";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";

const Profile = () => {
  const authRedirect = useAuthRedirect();
  const { themeTextColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="profile-wrapper">
      <div className="contents-container">
        <p style={{ color: themeTextColor }}>Profile Screen (web)</p>
      </div>
    </div>
  );
};

export default Profile;
