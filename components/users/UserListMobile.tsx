// ./components/users/UserListMobile.tsx
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { FirebaseFirestoreService } from "../../services/firestore/FirebaseFirestoreService";
import { UserDetailsType } from "../../types/databaseTypes";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";

type UserListMobileType = {
  role: string;
  userDetails: UserDetailsType;
};

const UserListMobile = ({ role, userDetails }: UserListMobileType) => {
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
    <View>
      <Text style={{ color: themeTextColor }}>Users with role: {role}</Text>
      {users.length > 0 ? (
        users.map((user, index) => (
          <Text key={index} style={{ color: themeTextColor }}>
            {index + 1}. {user.email}
          </Text>
        ))
      ) : (
        <Text style={{ color: themeTextColor }}>
          No users found with role "{role}"
        </Text>
      )}
    </View>
  );
};

export default UserListMobile;
