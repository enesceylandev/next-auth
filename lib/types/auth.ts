import { DefaultSession } from "next-auth";

export type UserRole = "Admin" | "User";

export interface Auth0Role {
  id: string;
  name: UserRole;
  description?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: UserRole[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles: UserRole[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    roles?: UserRole[];
  }
}
