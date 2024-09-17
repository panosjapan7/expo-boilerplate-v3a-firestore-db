// ./contexts/AuthContext.tsx
import { createContext, ReactNode, useEffect, useState } from "react";
import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { onAuthStateChanged, User as FirebaseUserWeb } from "firebase/auth";

import { webAuth } from "../firebase/firebaseConfig";
import { getUserDetailsFromFirestore } from "../hooks/getUserDetailsFromFirestore";
import { UserDetailsType } from "../types/databaseTypes";

type User = FirebaseUserWeb | FirebaseAuthTypes.User | null;

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  userDetails: UserDetailsType | null;
  setUserDetails: (userDetails: UserDetailsType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

type AuthProviderType = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  userDetails: null,
  setUserDetails: () => {},
  loading: true,
  setLoading: () => {},
});

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [user, setUser] = useState<null | User>(null);
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchAuthUserAndUserDetails = async (authUser: User | null) => {
      setLoading(true);

      if (authUser) {
        try {
          const details = await getUserDetailsFromFirestore(authUser.uid);
          setUserDetails(details);
          setUser(authUser);
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserDetails(null);
      }
      setLoading(false);
    };

    if (Platform.OS === "web") {
      unsubscribe = onAuthStateChanged(webAuth, async (user) => {
        await fetchAuthUserAndUserDetails(user);
      });
    } else {
      unsubscribe = auth().onAuthStateChanged(async (user) => {
        await fetchAuthUserAndUserDetails(user);
      });
    }

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userDetails,
        setUserDetails,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
