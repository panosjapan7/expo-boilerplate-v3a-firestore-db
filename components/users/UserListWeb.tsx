// ./components/users/UserListMobile.tsx
import { useEffect, useState } from "react";
import { FirebaseFirestoreService } from "../../services/firestore/FirebaseFirestoreService";
import { UserDetailsType } from "../../types/databaseTypes";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";

type UserListWebType = {
  role: string;
  userDetails: UserDetailsType;
};

const UserListWeb = ({ role, userDetails }: UserListWebType) => {
  const [users, setUsers] = useState<Partial<UserDetailsType>[]>([]);
  const { themeTextColor } = useGlobalStyles();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userDetails?.role.includes("Admin")) {
        console.error("Access denied. Only admin users can fetch users.");
        return;
      }

      try {
        const users = await FirebaseFirestoreService.getUsersByRole(role);
        setUsers(users);
      } catch (error: any) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, [role, userDetails]);

  return (
    <div>
      <p style={{ color: themeTextColor }}>Users with role: {role}</p>
      {users.length > 0 ? (
        users.map((user, index) => (
          <p key={index} style={{ color: themeTextColor }}>
            {index + 1}. {user.email}
          </p>
        ))
      ) : (
        <p style={{ color: themeTextColor }}>
          No users found with role "{role}"
        </p>
      )}
    </div>
  );
};

export default UserListWeb;
