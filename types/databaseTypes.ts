// ./types/databaseTypes.ts
import { Timestamp, FieldValue } from "firebase/firestore";

export type AuthProviderType = "password" | "google.com";
export type UserRole = "Admin" | "Member" | "Viewer";
export type PermissionType = "read" | "create" | "update" | "delete" | "manage";

export type UserDetailsType = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  authProviders: AuthProviderType[];
  createdAt: FieldValue | Timestamp;
  lastLogin: FieldValue | Timestamp;
  role: UserRole[];
  permissions?: PermissionType[]; // Permissions the role of the user has
  magicEmailUsed?: boolean;
  tenantIds?: string[]; // Optional for multi-tenancy
  primaryTenantId?: string; // Optional for multi-tenancy
};
