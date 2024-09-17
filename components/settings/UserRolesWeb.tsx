// ./components/settings/UserRolesWeb.tsx
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserDetailsFromFirestore } from "../../hooks/getUserDetailsFromFirestore";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { updateFirestore } from "../../hooks/updateFirestore";

const UserRolesWeb = ({
  setStatus,
}: {
  setStatus: (status: "idle" | "loading" | "error") => void;
}) => {
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();
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
    <div>
      <p style={{ color: themeTextColor }}>Roles:</p>
      {userDetails?.role && userDetails.role.length > 0 ? (
        <ul>
          {userDetails.role.map((role, index) => (
            <li key={index} style={{ color: themeTextColor }}>
              {role}{" "}
              <button
                onClick={() => handleRoleUpdate(role, "delete")}
                style={{ color: "red", cursor: "pointer" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: themeTextColor }}>No roles assigned.</p>
      )}
      <>
        <input
          id="displayName"
          type="text"
          placeholder="Add a role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
        <button
          onClick={() => handleRoleUpdate(selectedRole, "add")}
          style={{ color: "red", cursor: "pointer" }}
        >
          Add role
        </button>
      </>
    </div>
  );
};

export default UserRolesWeb;
