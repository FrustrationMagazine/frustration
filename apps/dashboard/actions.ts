'use server';

import { signIn, signOut } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const sendMagicLink = async (
  _currentState: unknown,
  formData: FormData
) => {
  const authorizedEmails = await prisma.user.findMany({
    select: {
      email: true,
    },
  });

  const isAuthorizedEmail = authorizedEmails.some(
    ({ email }) => email === formData.get('email')
  );
  if (isAuthorizedEmail) {
    try {
      await signIn('resend', formData);
    } catch (errorMessage) {
      return { errorMessage };
    } finally {
      return {
        successMessage:
          'Un lien de connexion a été envoyé à votre adresse email',
      };
    }
  } else {
    return { errorMessage: 'Email non autorisé' };
  }
};

export const signOutDashboard = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.log('error:', error);
  } finally {
    redirect('/');
  }
};
