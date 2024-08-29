// ./contexts/AuthContext.tsx
import { createContext, ReactNode, useEffect, useState } from "react";
import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { onAuthStateChanged, User as FirebaseUserWeb } from "firebase/auth";

import { webAuth } from "../firebase/firebaseConfig";

type User = FirebaseUserWeb | FirebaseAuthTypes.User | null;

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

type AuthProviderType = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    if (Platform.OS === "web") {
      unsubscribe = onAuthStateChanged(webAuth, async (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }

        setLoading(false);
      });
    } else {
      unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }

        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
