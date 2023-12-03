import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@frustration/libs/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<any> {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: 1, name: "User", email: "user@example.com" };

        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  adapter: PrismaAdapter(prisma)
};
