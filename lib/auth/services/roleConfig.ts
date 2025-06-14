import { ManagementTokenService } from "./managementToken";

interface Role {
  id: string;
  name: string;
  description?: string;
}

export class RoleConfigService {
  private static instance: RoleConfigService;
  private roles: Map<string, string> = new Map();
  private lastFetch: number = 0;
  private CACHE_DURATION = 60 * 60 * 1000;

  private constructor() {}

  public static getInstance(): RoleConfigService {
    if (!this.instance) {
      this.instance = new RoleConfigService();
    }
    return this.instance;
  }

  private async fetchRoles(): Promise<Role[]> {
    const token = await ManagementTokenService.getInstance().getToken();

    const response = await fetch(`${process.env.AUTH0_ISSUER}/api/v2/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }
    return response.json();
  }

  public async getRoleIds(): Promise<Map<string, string>> {
    const now = Date.now();
    if (this.roles.size === 0 || now - this.lastFetch > this.CACHE_DURATION) {
      const roles = await this.fetchRoles();
      this.roles.clear();
      roles.forEach(role => {
        this.roles.set(role.name, role.id);
      });
      this.lastFetch = now;
    }
    return this.roles;
  }

  public async getRoleConfig() {
    const roleIds = await this.getRoleIds();
    return {
      roles: {
        available: ["Admin", "User"] as const,
        default: "User" as const,
        ids: Object.fromEntries(roleIds),
      },
      scopes: {
        default: "openid email profile",
      },
    } as const;
  }
}
