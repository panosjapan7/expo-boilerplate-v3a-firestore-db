// ./components/layouts/DrawerLayoutMobile.tsx
import { useContext } from "react";
import { View } from "react-native";
import { router, useNavigation, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { AuthContext } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { Colors } from "../../styles/colors";
import IconFeed from "../icons/IconFeed";
import IconLogout from "../icons/IconLogout";
import IconSettings from "../icons/IconSettings";
import ButtonTheme from "../buttons/ButtonTheme";

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();
  const pathname = usePathname();
  const { theme } = useThemeContext();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase Auth
      await auth().signOut();

      // Sign out from Google Sign-In
      await GoogleSignin.signOut();

      // Clear the user context
      setUser(null);

      // Use navigation to reset the stack
      navigation.reset({
        index: 0,
        routes: [{ name: "index" as never }], // Adjust the route name if necessary
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={"Feed"}
        onPress={() => router.push("/(drawer)/(tabs)/feed")}
        icon={() => (
          <IconFeed
            color={themeTextColor}
            size={18}
            style={{ marginLeft: 20 }}
          />
        )}
        labelStyle={{ marginLeft: -15, color: themeTextColor }}
        style={{
          backgroundColor:
            pathname === "/feed"
              ? theme === "light"
                ? Colors.gray050
                : Colors.gray400
              : theme === "light"
              ? Colors.white
              : Colors.gray600,
        }}
      />
      <DrawerItem
        label={"Settings"}
        onPress={() => router.push("/(drawer)/settings")}
        icon={() => (
          <IconSettings
            color={themeTextColor}
            size={18}
            style={{ marginLeft: 20 }}
          />
        )}
        labelStyle={{ marginLeft: -15, color: themeTextColor }}
        style={{
          backgroundColor:
            pathname === "/settings"
              ? theme === "light"
                ? Colors.gray050
                : Colors.gray400
              : theme === "light"
              ? Colors.white
              : Colors.gray600,
        }}
      />
      <DrawerItem
        label={"Log out"}
        onPress={handleLogout}
        icon={() => (
          <IconLogout
            color={themeTextColor}
            size={18}
            style={{ marginLeft: 20 }}
          />
        )}
        labelStyle={{ marginLeft: -15, color: themeTextColor }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerLayout = () => {
  const { themeBackgroundColor, themeHeaderTextColor, themeTextColor } =
    useGlobalStyles();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerRight: () => (
          <View style={{ marginHorizontal: 16 }}>
            <ButtonTheme color={themeHeaderTextColor} size={22} />
          </View>
        ),
        headerTintColor: themeHeaderTextColor,
        drawerStyle: { backgroundColor: themeBackgroundColor },
      }}
    >
      <Drawer.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          drawerLabel: "Settings",
          headerShown: true,
          headerStyle: { backgroundColor: themeBackgroundColor },
          headerTitleStyle: { color: themeHeaderTextColor },
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
