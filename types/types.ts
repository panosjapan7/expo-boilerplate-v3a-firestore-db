// ./types/types.ts
import { Timestamp, FieldValue } from "firebase/firestore";

export type ButtonType = {
  color?: string;
  size?: number;
  style?: object;
};

export type DrawerMenuType = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
};

export type IconType = {
  color?: string;
  size?: number;
  style?: object;
};

export type ImageType = {
  tintColor?: string;
  width?: number;
  height?: number;
  style?: object;
};

export type StatusType = "error" | "idle" | "loading" | "success" | "warning";

export type ThemeType = "light" | "dark";

export type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export type AuthProviderType = "password" | "google.com";
export type UserDetailsType = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  authProviders: AuthProviderType[];
  createdAt: FieldValue | Timestamp;
  lastLogin: FieldValue | Timestamp;
  role: string[];
  magicEmailUsed?: boolean;
};
