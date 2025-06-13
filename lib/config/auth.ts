import { RoleConfigService } from "../auth/services/roleConfig";

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

export async function initializeAuth0Config() {
  const config = await RoleConfigService.getInstance().getRoleConfig();
  Object.assign(AUTH0_CONFIG.roles.ids, config.roles.ids);
}
