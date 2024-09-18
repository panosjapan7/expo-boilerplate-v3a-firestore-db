// ./services/auth/FirebaseAuthService.ts
import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  signInWithEmailAndPassword as webSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as webCreateUserWithEmailAndPassword,
  signOut as webSignOut,
  User as FirebaseUserWeb,
} from "firebase/auth";
import { webAuth } from "../../firebase/firebaseConfig";

type User = FirebaseUserWeb | FirebaseAuthTypes.User;

interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
}

const login = async (email: string, password: string) => {
  if (Platform.OS === "web") {
    const userCredential = await webSignInWithEmailAndPassword(
      webAuth,
      email,
      password
    );
    return userCredential.user;
  } else {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  }
};

const register = async (email: string, password: string): Promise<User> => {
  if (Platform.OS === "web") {
    const userCredential = await webCreateUserWithEmailAndPassword(
      webAuth,
      email,
      password
    );
    return userCredential.user;
  } else {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  }
};

const logout = async (): Promise<void> => {
  if (Platform.OS === "web") {
    await webSignOut(webAuth);
  } else {
    await auth().signOut();
  }
};

export const FirebaseAuthService: AuthService = {
  login,
  register,
  logout,
};
