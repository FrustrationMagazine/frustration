'use server';

import { signIn, signOut, getAuthorizedEmails } from '@/auth';
import { PrismaClient } from '@prisma/client';

import { SignInFormSchema } from '../_schemas/signIn';

export type FormState = {
  successMessage: string | null;
  errorMessage: string | null;
};

const INVALID_EMAIL = {
  successMessage: null,
  errorMessage: 'Adresse e-mail invalide.',
};

const UNAUTHORIZED_EMAIL = {
  successMessage: null,
  errorMessage: "Cet e-mail n'est pas autorisé à se connecter.",
};

const VALID_AND_AUTHORIZED_EMAIL = (email: string) => ({
  successMessage: `Vous allez recevoir un message à ${email} contenant un lien de connexion.`,
  errorMessage: null,
});

export async function sendMagicLinkAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = SignInFormSchema.safeParse(formData);

  if (!parsed.success) return INVALID_EMAIL;

  const authorizedEmails = await getAuthorizedEmails();
  const isAuthorized = authorizedEmails.some(
    ({ email }) => email === parsed.data.email
  );

  if (!isAuthorized) return UNAUTHORIZED_EMAIL;

  try {
    await signIn('resend', data);
  } catch (errorMessage) {
    return {
      successMessage: null,
      errorMessage: String(errorMessage),
    };
  } finally {
    return VALID_AND_AUTHORIZED_EMAIL(parsed.data.email);
  }
}
