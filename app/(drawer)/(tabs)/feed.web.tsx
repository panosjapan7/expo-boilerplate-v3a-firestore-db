// ./app/(drawer)/(tabs)/feed.web.tsx
import { useContext } from "react";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { AuthContext } from "../../../contexts/AuthContext";
import "../../../styles/css/feed.css";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";

const Feed = () => {
  const authRedirect = useAuthRedirect();
  const { userDetails, loading } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="feed-wrapper">
      <div className="contents-container">
        <p style={{ color: themeTextColor }}>Feed Screen (web)</p>
        <p>displayName: {userDetails?.displayName}</p>
        <p>email: {userDetails?.email}</p>
        <p>role: {userDetails?.role}</p>
      </div>
    </div>
  );
};

export default Feed;
