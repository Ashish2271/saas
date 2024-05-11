import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import db from "@repo/db/client";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async signIn({ user, account }: {
      user: {
        email: string;
        name: string;
      },
      account: {
        provider: string; // Change the type to string
      }
    }) {
      console.log("hi signin");
      if (!user || !user.email) {
        return false;
      }

      await db.user.upsert({
        select: {
          id: true
        },
        where: {
          email: user.email
        },
        create: {
          email: user.email,
          name: user.name,
          auth_type: account.provider.toLowerCase() === "github" ? "Github" : "Google" // Use lowercase strings here
        },
        update: {
          name: user.name,
          auth_type: account.provider.toLowerCase() === "github" ? "Github" : "Google" // Use lowercase strings here
        }
      });

      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "secret"
};
