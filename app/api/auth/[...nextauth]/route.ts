import NextAuth from "next-auth/next";
import Auth0Provider from "next-auth/providers/auth0";
import { UserRolesService } from "@/lib/auth/services/userRoles";
import { AUTH0_CONFIG } from "@/lib/config/auth";

const userRolesService = new UserRolesService();

const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
      authorization: {
        params: {
          scope: AUTH0_CONFIG.scopes.default,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user?.roles) {
        token.roles = session.user.roles;
      }

      if (user) {
        try {
          const userId = user.id || token.sub;
          if (!userId) {
            throw new Error("User ID not found");
          }

          const userRoles = await userRolesService.ensureUserHasRole(userId);
          token.userId = userId;
          token.roles = userRolesService.mapRolesToUserRoles(userRoles);
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId,
          roles: token.roles || [],
        },
      };
    },
  },
  events: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const userRoles = await userRolesService.ensureUserHasRole(user.id);
          user.roles = userRolesService.mapRolesToUserRoles(userRoles);
        } catch (error) {
          console.error("Error updating roles on sign in:", error);
        }
      }
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
