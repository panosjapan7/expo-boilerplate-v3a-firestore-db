// ./app/(drawer)/settings.tsx
import { Text, View } from "react-native";

import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";

const Settings = () => {
  const authRedirect = useAuthRedirect();
  const { globalStyles } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.textBlack}>Settings Screen</Text>
    </View>
  );
};

export default Settings;
