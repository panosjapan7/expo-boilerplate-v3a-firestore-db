// ./app/(drawer)/(tabs)/feed.tsx
import { useContext, useEffect } from "react";
import { Text, View } from "react-native";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { AuthContext } from "../../../contexts/AuthContext";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { FirebaseFirestoreService } from "../../../services/firestore/FirebaseFirestoreService";

const Feed = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { globalStyles } = useGlobalStyles();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const details =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);
        setUserDetails(details);
      }
    };

    fetchUserDetails();
  }, [user, setUserDetails]);

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.textBlack}>Feed Screen</Text>
      <Text style={globalStyles.textMedium}>
        displayName: {userDetails?.displayName}
      </Text>
      <Text style={globalStyles.textMedium}>email: {userDetails?.email}</Text>
      <Text style={globalStyles.textMedium}>
        role: {userDetails?.role?.join(", ")}
      </Text>
    </View>
  );
};

export default Feed;
