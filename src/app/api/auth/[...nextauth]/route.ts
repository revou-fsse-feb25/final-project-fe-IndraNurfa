import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        const data = await res.json();
        if (!res.ok || !data?.data) return null;

        return {
          id: String(data.data.id) || data.data.full_name,
          name: data.data.full_name,
          email: data.data.email,
          role: data.data.role,
          accessToken: data.data.access_token,
          refreshToken: data.data.refresh_token,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (match refresh token lifetime)
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      // First login
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
          user: {
            id: user.id || user.email || "",
            name: user.name || undefined,
            email: user.email || undefined,
            role: user.role,
          },
        };
      }

      // Handle session update (when user edits profile)
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          ...session.user,
        };
        return token;
      }

      // Still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Expired → refresh
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.refreshToken}`,
            },
          },
        );

        const data = await res.json();
        if (!res.ok) throw data;

        return {
          ...token,
          accessToken: data.data,
          refreshToken: data.data.refresh_token ?? token.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15m
        };
      } catch (err) {
        console.error("Error refreshing access token", err);
        return { ...token, error: "RefreshAccessTokenError" as const };
      }
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
