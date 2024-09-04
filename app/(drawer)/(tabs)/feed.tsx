// ./app/(drawer)/(tabs)/feed.tsx
import { useContext } from "react";
import { Text, View } from "react-native";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { AuthContext } from "../../../contexts/AuthContext";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";

const Feed = () => {
  const authRedirect = useAuthRedirect();
  const { user } = useContext(AuthContext);
  const { globalStyles } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.textBlack}>Feed Screen</Text>
      <Text style={globalStyles.textMedium}>
        displayName: {user?.displayName}
      </Text>
      <Text style={globalStyles.textMedium}>email: {user?.email}</Text>
    </View>
  );
};

export default Feed;
