import { Auth0Role, UserRole } from "@/lib/types/auth";
import { ManagementTokenService } from "./managementToken";
import { AUTH0_CONFIG } from "@/lib/config/auth";

export class UserRolesService {
  async getUserRoles(userId: string): Promise<Auth0Role[]> {
    try {
      const token = await ManagementTokenService.getInstance().getToken();
      const encodedUserId = encodeURIComponent(userId);

      const response = await fetch(
        `${process.env.AUTH0_ISSUER}/api/v2/users/${encodedUserId}/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get user roles");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting user roles:", error);
      return [];
    }
  }

  async ensureUserHasRole(userId: string): Promise<Auth0Role[]> {
    try {
      const userRoles = await this.getUserRoles(userId);

      if (userRoles && userRoles.length > 0) {
        return userRoles;
      }

      return await this.changeUserRole(userId, AUTH0_CONFIG.roles.default);
    } catch (error) {
      console.error("Error in ensureUserHasRole:", error);
      throw error;
    }
  }

  async changeUserRole(
    userId: string,
    newRole: UserRole
  ): Promise<Auth0Role[]> {
    try {
      const token = await ManagementTokenService.getInstance().getToken();
      const encodedUserId = encodeURIComponent(userId);

      // Mevcut rolleri al
      const currentRoles = await this.getUserRoles(userId);

      // Mevcut rolleri kaldır
      if (currentRoles.length > 0) {
        const removeResponse = await fetch(
          `${process.env.AUTH0_ISSUER}/api/v2/users/${encodedUserId}/roles`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roles: currentRoles.map(role => role.id),
            }),
          }
        );

        if (!removeResponse.ok) {
          throw new Error("Failed to remove current roles");
        }
      }

      // Yeni rolü ata
      const addResponse = await fetch(
        `${process.env.AUTH0_ISSUER}/api/v2/users/${encodedUserId}/roles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roles: [AUTH0_CONFIG.roles.ids[newRole]],
          }),
        }
      );

      if (!addResponse.ok) {
        throw new Error("Failed to assign new role");
      }

      // Güncel rolleri al ve dön
      return await this.getUserRoles(userId);
    } catch (error) {
      console.error("Error changing role:", error);
      throw error;
    }
  }

  mapRolesToUserRoles(roles: Auth0Role[]): UserRole[] {
    return roles.map(role => {
      if (!this.isValidUserRole(role.name)) {
        console.warn(`Invalid role name: ${role.name}`);
        return AUTH0_CONFIG.roles.default;
      }
      return role.name;
    });
  }

  private isValidUserRole(role: string): role is UserRole {
    return AUTH0_CONFIG.roles.available.includes(role as UserRole);
  }
}
