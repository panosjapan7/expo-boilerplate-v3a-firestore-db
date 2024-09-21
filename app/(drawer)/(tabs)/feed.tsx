// ./app/(drawer)/(tabs)/feed.tsx
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { AuthContext } from "../../../contexts/AuthContext";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { FirebaseFirestoreService } from "../../../services/firestore/FirebaseFirestoreService";
import { StatusType } from "../../../types/types";
import UserListMobile from "../../../components/users/UserListMobile";
import LoadingIndicator from "../../../components/indicators/LoadingIndicator";
import Spacer from "../../../components/utils/Spacer";

const Feed = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { globalStyles } = useGlobalStyles();
  const [status, setStatus] = useState<StatusType>("idle");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        setStatus("loading");
        const details =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);
        setUserDetails(details);
        setStatus("idle");
      }
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
        <View style={globalStyles.container}>
          <Text style={globalStyles.textBlack}>Feed Screen</Text>
          <Text style={globalStyles.textMedium}>
            displayName: {userDetails?.displayName}
          </Text>
          <Text style={globalStyles.textMedium}>
            email: {userDetails?.email}
          </Text>
          <Text style={globalStyles.textMedium}>
            role: {userDetails?.role?.join(", ")}
          </Text>
          <Spacer marginBottom={10} />
          {userDetails?.role.includes("Admin") ? (
            <UserListMobile role={"Member"} userDetails={userDetails} />
          ) : null}
        </View>
      )}
    </>
  );
};

export default Feed;
