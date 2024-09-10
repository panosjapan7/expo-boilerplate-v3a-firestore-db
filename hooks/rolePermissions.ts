// ./hooks/rolePermissions.ts
import { PermissionType, UserRole } from "../types/database";

// Define role-to-permission mappings
export const rolePermissions: Record<UserRole, PermissionType[]> = {
  Admin: ["read", "create", "update", "delete", "manage"],
  Member: ["read", "create", "update", "delete"],
  Viewer: ["read"],
};

export const hasPermission = (
  role: UserRole,
  permission: PermissionType
): boolean => {
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(permission) : false;
};
