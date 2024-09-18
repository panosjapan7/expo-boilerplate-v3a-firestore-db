// ./services/auth/FirebaseAuthService.ts
import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  getAuth,
  signInWithEmailAndPassword as webSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as webCreateUserWithEmailAndPassword,
  signOut as webSignOut,
  onAuthStateChanged as webOnAuthStateChanged,
  User as FirebaseUserWeb,
} from "firebase/auth";
import { webAuth } from "../../firebase/firebaseConfig";

type User = FirebaseUserWeb | FirebaseAuthTypes.User;

interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}

const mapFirebaseUserToUser = (
  firebaseUser: FirebaseUserWeb | FirebaseAuthTypes.User
): User => firebaseUser;

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

const getCurrentUser = (): User | null => {
  const firebaseUser =
    Platform.OS === "web" ? webAuth.currentUser : auth().currentUser;
  return firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null;
};

export const FirebaseAuthService: AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
};
