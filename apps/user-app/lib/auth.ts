import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@repo/db/client";
import type { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";
import Discord from "next-auth/providers/discord";

export const authOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  // pages: {
  //   signIn: "/auth",
  // },
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async jwt({ token }: any) {
      return token;
    },
    async session({ session, token }: any) {
      const user = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
        session.user.admin = user?.admin;
      }
      return session;
    },
  },
};
// hsingh's code from cms
interface RateLimiter {
  timestamps: Date[];
}
const userRateLimits = new Map<string, RateLimiter>();

export const rateLimit = (userId: string, rateLimitCount: number, rateLimitInterval: number): boolean => {
  const now = new Date();
  const userLimiter = userRateLimits.get(userId) ?? { timestamps: [] };

  userLimiter.timestamps = userLimiter.timestamps.filter(
    (timestamp) => now.getTime() - timestamp.getTime() < rateLimitInterval
  );

  if (userLimiter.timestamps.length >= rateLimitCount) {
    return false; // Rate limit exceeded
  }

  userLimiter.timestamps.push(now);
  userRateLimits.set(userId, userLimiter);
  return true;
};


// import { PrismaAdapter } from "@auth/prisma-adapter";

// import db from "@repo/db/client";
// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import type { Adapter } from "next-auth/adapters";
// export const {
//   handlers: { GET, POST },
//   auth,
// } = NextAuth({
//     adapter: PrismaAdapter(db) as Adapter,
 
//   providers: [GitHub ({ clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! })],
//   callbacks: {
//     async session({ session, user, token }) {
//       return session;
//     },
//   },
// });
