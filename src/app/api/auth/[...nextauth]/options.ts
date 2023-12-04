import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@frustration/libs/prisma";
import EmailProvider from "next-auth/providers/email";

export const options: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  adapter: PrismaAdapter(prisma),
  theme: {
    colorScheme: "light"
  }
};
