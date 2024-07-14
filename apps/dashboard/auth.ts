import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "@/libs/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

export const getAuthorizedEmails = async () => {
  const authorizedEmails = await prisma.user.findMany({
    select: {
      email: true,
    },
  });
  return authorizedEmails;
};
