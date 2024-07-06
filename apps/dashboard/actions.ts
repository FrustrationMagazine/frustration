"use server";

import { signIn } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendMagicLink = async (_currentState: unknown, formData: FormData) => {
  const authorizedEmails = await prisma.user.findMany({
    select: {
      email: true
    }
  });

  const isAuthorizedEmail = authorizedEmails.some(({ email }) => email === formData.get("email"));
  if (isAuthorizedEmail) {
    try {
      signIn("resend", formData);
    } catch (error) {
      return "Erreur inattendue";
    }
  } else {
    return "Email non autorisé";
  }
};
