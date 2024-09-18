// ./components/settings/UserDisplayNameMobile.tsx
import { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { updateFirestore } from "../../hooks/updateFirestore";
import Spacer from "../utils/Spacer";
import { FirebaseFirestoreService } from "../../services/firestore/FirebaseFirestoreService";

const UserDisplayNameMobile = ({
  setStatus,
}: {
  setStatus: (status: "idle" | "loading" | "error") => void;
}) => {
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { globalStyles, themeTextColor } = useGlobalStyles();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleDisplayNameUpdate = async (newValue: string) => {
    if (user?.uid) {
      try {
        setStatus("loading");
        await updateFirestore({
          uid: user.uid,
          field: "displayName",
          value: newValue,
          action: "update",
        });
        const updatedDetails =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);
        setUserDetails(updatedDetails);
        setNewDisplayName("");
      } catch (error: any) {
        console.error("Failed to update display name:", error.message);
      } finally {
        setIsEditing(false);
        setStatus("idle");
      }
    } else {
      console.error("User UID is undefined or role is not selected.");
      setIsEditing(false);
    }
  };

  return (
    <View style={[globalStyles.border, { padding: 20, width: "80%" }]}>
      {isEditing ? (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput
            placeholder={userDetails?.displayName ?? ""}
            value={newDisplayName}
            onChangeText={setNewDisplayName}
          />
          <Pressable onPress={() => handleDisplayNameUpdate(newDisplayName)}>
            <Text style={{ color: "red" }}>Update</Text>
          </Pressable>
          <Pressable onPress={() => setIsEditing(false)}>
            <Text style={{ color: "blue" }}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text style={globalStyles.textBold}>Name</Text>
          <Spacer marginBottom={6} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ color: themeTextColor }}>
              {userDetails?.displayName}
            </Text>
            <Pressable onPress={() => setIsEditing(true)}>
              <Text style={{ color: "red" }}>Edit</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default UserDisplayNameMobile;
