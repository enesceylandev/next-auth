import { AUTH0_CONFIG } from "@/lib/config/auth";
import { ManagementTokenService } from "./managementToken";
import { UserRole } from "@/lib/types/auth";

interface Role {
  id: string;
  name: string;
  description?: string;
}

export class UserRolesService {
  private async getManagementToken(): Promise<string> {
    return await ManagementTokenService.getInstance().getToken();
  }

  public async getUserRoles(userId: string): Promise<Role[]> {
    try {
      const token = await this.getManagementToken();

      const response = await fetch(
        `${process.env.AUTH0_ISSUER}/api/v2/users/${userId}/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user roles:", {
          status: response.status,
          error: errorData,
        });
        throw new Error("Failed to fetch user roles");
      }

      return await response.json();
    } catch (error) {
      console.error("getUserRoles error:", error);
      throw error;
    }
  }

  public async changeUserRole(
    userId: string,
    newRoleId: string
  ): Promise<Role[]> {
    try {
      const token = await this.getManagementToken();
      const currentRoles = await this.getUserRoles(userId);

      // Removing current role
      if (currentRoles.length > 0) {
        const removeResponse = await fetch(
          `${process.env.AUTH0_ISSUER}/api/v2/users/${userId}/roles`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              roles: currentRoles.map(role => role.id),
            }),
          }
        );

        if (!removeResponse.ok) {
          const errorData = await removeResponse.json();
          console.error("Error removing roles:", {
            status: removeResponse.status,
            error: errorData,
          });
          throw new Error("Failed to remove existing roles");
        }
      }

      // Adding new role
      const addResponse = await fetch(
        `${process.env.AUTH0_ISSUER}/api/v2/users/${userId}/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roles: [newRoleId],
          }),
        }
      );

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        console.error("Error adding new role:", {
          status: addResponse.status,
          error: errorData,
        });
        throw new Error("Failed to assign new role");
      }

      return await this.getUserRoles(userId);
    } catch (error) {
      console.error("changeUserRole error:", error);
      throw error;
    }
  }

  public mapRolesToUserRoles(roles: Role[]): UserRole[] {
    return roles.map(role => {
      if (role.name === "Admin") return "Admin" as UserRole;
      return "User" as UserRole;
    });
  }

  public async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId);
      return userRoles.some(userRole => userRole.name === role);
    } catch (error) {
      console.error("hasRole error:", error);
      return false;
    }
  }

  public async ensureUserHasRole(userId: string): Promise<Role[]> {
    try {
      const currentRoles = await this.getUserRoles(userId);

      if (currentRoles.length === 0) {
        await this.changeUserRole(userId, AUTH0_CONFIG.roles.default);
        return await this.getUserRoles(userId);
      }

      return currentRoles;
    } catch (error) {
      console.error("Error in ensureUserHasRole:", error);
      return [];
    }
  }
}
