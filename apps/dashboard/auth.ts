import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import authConfig from './auth.config';

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
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
