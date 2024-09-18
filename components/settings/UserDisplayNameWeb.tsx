// ./components/settings/UserDisplayNameWeb.tsx
import { useContext, useState } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { updateFirestore } from "../../hooks/updateFirestore";
import { FirebaseFirestoreService } from "../../services/firestore/FirebaseFirestoreService";

const UserDisplayNameWeb = ({
  setStatus,
}: {
  setStatus: (status: "idle" | "loading" | "error") => void;
}) => {
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (newValue: {
    [key: string]: string | string[];
  }) => {
    if (user?.uid) {
      try {
        setStatus("loading");
        await updateFirestore({
          uid: user.uid,
          field: Object.keys(newValue)[0],
          value: Object.values(newValue)[0],
        });
        const updatedDetails =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);
        setUserDetails(updatedDetails);
      } catch (error) {
        console.error("Failed to update Firestore field:", error);
      } finally {
        setStatus("idle");
      }
    } else {
      console.error("User UID is undefined.");
    }
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            id="displayName"
            type="text"
            placeholder={userDetails?.displayName ?? ""}
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          <button onClick={() => handleUpdate({ displayName: newDisplayName })}>
            Update
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          style={{ color: themeTextColor, cursor: "pointer" }}
        >
          Name: {userDetails?.displayName}
        </p>
      )}
    </div>
  );
};

export default UserDisplayNameWeb;
