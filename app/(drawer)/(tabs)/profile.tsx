// ./app/(drawer)/(tabs)/profile.tsx
import { Text, View } from "react-native";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";

const Profile = () => {
  const authRedirect = useAuthRedirect();
  const { globalStyles } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.textBlack}>Profile Screen</Text>
    </View>
  );
};

export default Profile;
