import { UserRole } from "./auth";

export interface UserProfile {
  image: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface RoleChangeResponse {
  success: boolean;
  message: string;
  newRoles?: UserRole[];
}
