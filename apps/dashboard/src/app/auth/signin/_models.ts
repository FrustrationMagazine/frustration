import { z } from "zod";

// SCHEMA
export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
});

// FORM STATUS

export type FormSubmissionStatus = {
  successMessage: string | null;
  errorMessage: string | null;
};

export const INVALID_EMAIL = {
  successMessage: null,
  errorMessage: "Adresse e-mail invalide.",
};

export const UNAUTHORIZED_EMAIL = {
  successMessage: null,
  errorMessage: "Cet e-mail n'est pas autorisé à se connecter.",
};

export const NO_AUTHORIZED_EMAIL = {
  successMessage: null,
  errorMessage: "Impossible de retrouver les adresses e-mail autorisées.",
};

export const generateValidEmailMessage = (email: string) => ({
  successMessage: `Vous allez recevoir un message à ${email} contenant un lien de connexion.`,
  errorMessage: null,
});
