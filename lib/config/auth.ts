import { RoleConfigService } from "../auth/services/roleConfig";

interface Auth0ConfigType {
  roles: {
    available: readonly ["Admin", "User"];
    default: "User";
    ids: Record<string, string>;
  };
  scopes: {
    default: string;
  };
}

let configInstance: Auth0ConfigType | null = null;

export const AUTH0_CONFIG = {
  roles: {
    available: ["Admin", "User"] as const,
    default: "User" as const,
    ids: {} as Record<string, string>,
  },
  scopes: {
    default: "openid email profile",
  },
} as const;

export async function getAuth0Config(): Promise<Auth0ConfigType> {
  if (!configInstance) {
    const config = await RoleConfigService.getInstance().getRoleConfig();
    Object.assign(AUTH0_CONFIG.roles.ids, config.roles.ids);
    configInstance = AUTH0_CONFIG;
  }
  return configInstance;
}

export async function getRoleId(role: "Admin" | "User"): Promise<string> {
  const config = await getAuth0Config();
  const roleId = config.roles.ids[role];
  if (!roleId) {
    throw new Error(`Role ID not found for role: ${role}`);
  }
  return roleId;
}
