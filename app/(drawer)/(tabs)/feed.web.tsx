// ./app/(drawer)/(tabs)/feed.web.tsx
import { useContext, useEffect, useState } from "react";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { AuthContext } from "../../../contexts/AuthContext";
import "../../../styles/css/feed.css";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { FirebaseFirestoreService } from "../../../services/firestore/FirebaseFirestoreService";
import { StatusType } from "../../../types/types";
import UserListWeb from "../../../components/users/UserListWeb";
import LoadingIndicator from "../../../components/indicators/LoadingIndicator";
import UserMessagesWeb from "../../../components/users/UserMessagesWeb";

const Feed = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const details =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);

        setUserDetails(details);
      }
      setStatus("idle");
    };

    fetchUserDetails();
  }, [user, setUserDetails]);

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <>
      {status === "loading" ? (
        <LoadingIndicator />
      ) : (
        <div className="feed-wrapper">
          <div className="contents-container">
            <p style={{ color: themeTextColor }}>Feed Screen (web)</p>
            <p style={{ color: themeTextColor }}>
              displayName: {userDetails?.displayName}
            </p>
            <p style={{ color: themeTextColor }}>email: {userDetails?.email}</p>
            <p style={{ color: themeTextColor }}>
              role: {userDetails?.role?.join(", ")}
            </p>
            {userDetails?.role.includes("Admin") ? (
              <UserListWeb role="Member" userDetails={userDetails} />
            ) : null}
            {user ? <UserMessagesWeb userId={user.uid} /> : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
