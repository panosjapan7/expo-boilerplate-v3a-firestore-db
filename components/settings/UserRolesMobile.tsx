// ./components/settings/UserRolesMobile.tsx
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserDetailsFromFirestore } from "../../hooks/getUserDetailsFromFirestore";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { updateFirestore } from "../../hooks/updateFirestore";
import { Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Spacer from "../utils/Spacer";

const UserRolesMobile = ({
  setStatus,
}: {
  setStatus: (status: "idle" | "loading" | "error") => void;
}) => {
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { globalStyles, themeTextColor } = useGlobalStyles();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleUpdate = async (
    role: string,
    action: "add" | "delete" | "update"
  ) => {
    if (user?.uid) {
      try {
        setStatus("loading");
        await updateFirestore({
          uid: user.uid,
          field: "role",
          value: role,
          action: action,
        });
        const updatedDetails = await getUserDetailsFromFirestore(user.uid);
        setUserDetails(updatedDetails);
        setSelectedRole("");
      } catch (error: any) {
        console.error("Failed to update role:", error.message);
      } finally {
        setStatus("idle");
      }
    } else {
      console.error("User UID is undefined or role is not selected.");
    }
  };

  return (
    <View style={[globalStyles.border, { padding: 20, width: "80%" }]}>
      <Text style={globalStyles.textBold}>User Roles</Text>
      <Spacer marginBottom={6} />
      {userDetails?.role && userDetails.role.length > 0 ? (
        <View>
          {userDetails.role.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ color: themeTextColor }}>
                {index + 1}. {item}
              </Text>
              <Pressable onPress={() => handleRoleUpdate(item, "delete")}>
                <Text style={{ color: "red" }}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ color: themeTextColor }}>No roles assigned.</Text>
      )}
      <Spacer marginBottom={16} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TextInput
          placeholder="Add a role"
          value={selectedRole}
          onChangeText={setSelectedRole}
          placeholderTextColor={themeTextColor}
          style={[
            globalStyles.border,
            { width: 160, padding: 10, color: themeTextColor },
          ]}
        />
        <Pressable onPress={() => handleRoleUpdate(selectedRole, "add")}>
          <Text style={{ color: themeTextColor }}>Add role</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserRolesMobile;
