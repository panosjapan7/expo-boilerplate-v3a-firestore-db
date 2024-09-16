// ./app/(drawer)/(tabs)/feed.web.tsx
import { useContext, useEffect } from "react";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { AuthContext } from "../../../contexts/AuthContext";
import "../../../styles/css/feed.css";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { getUserDetailsFromFirestore } from "../../../hooks/getUserDetailsFromFirestore";

const Feed = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const details = await getUserDetailsFromFirestore(user.uid);
        setUserDetails(details);
      }
    };

    fetchUserDetails();
  }, [user, setUserDetails]);

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="feed-wrapper">
      <div className="contents-container">
        <p style={{ color: themeTextColor }}>Feed Screen (web)</p>
        <p>displayName: {userDetails?.displayName}</p>
        <p>email: {userDetails?.email}</p>
        <p>role: {userDetails?.role?.join(", ")}</p>
      </div>
    </div>
  );
};

export default Feed;
