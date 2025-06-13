import { UserRole } from "@/lib/types/auth";
import { AUTH_CONFIG } from "@/lib/config/role";
import { RoleChangeResponse } from "@/lib/types/user";

export class RoleService {
  static async changeUserRole(
    userId: string,
    newRole: UserRole
  ): Promise<RoleChangeResponse> {
    try {
      const response = await fetch("/api/user/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
          roleId: AUTH_CONFIG.roles.ids[newRole],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change role");
      }

      return {
        success: true,
        message: `Successfully changed role to ${newRole}`,
        newRoles: data.newRoles,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to change role",
      };
    }
  }
}
