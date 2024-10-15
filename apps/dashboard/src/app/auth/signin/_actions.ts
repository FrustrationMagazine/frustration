"use server";

// 🔧 Libs
import { signIn, getAuthorizedEmails } from "@dashboard/auth";

// 🖼️ Models
import {
  SignInFormSchema,
  INVALID_EMAIL,
  UNAUTHORIZED_EMAIL,
  NO_AUTHORIZED_EMAIL,
  generateValidEmailMessage,
} from "./_models";

import { type FormSubmissionStatus } from "@/utils/form";

/* ---------------------- */
/*    SEND MAGIC LINK     */
/* ---------------------- */

export async function sendMagicLinkAction(
  prevState: FormSubmissionStatus,
  data: FormData,
): Promise<FormSubmissionStatus> {
  const isProduction = process.env.NODE_ENV === "production";

  // 🔎 PARSING
  const formData = Object.fromEntries(data);
  const parsed = SignInFormSchema.safeParse(formData);

  // ❌ INVALID EMAIL
  if (!parsed.success) return INVALID_EMAIL;

  // ❌ AUTHORIZED EMAILS NOT FOUND
  const authorizedEmails = await getAuthorizedEmails();
  if (authorizedEmails.length === 0) return NO_AUTHORIZED_EMAIL;

  if (!isProduction) {
    return {
      successMessage: null,
      errorMessage: "Magic link can only be sent in production environment.",
    };
  }

  // ❌ UNAUTHORIZED EMAIL
  const isAuthorized = authorizedEmails.some(
    ({ email }) => email === parsed.data.email,
  );
  if (!isAuthorized) return UNAUTHORIZED_EMAIL;

  // 🔁 SIGN IN
  try {
    await signIn("resend", data);
  } catch (errorMessage) {
    // ❌ REJECTED
    return {
      successMessage: null,
      errorMessage: String(errorMessage),
    };
  } finally {
    // ✅ SIGNED IN
    const { email } = parsed.data;
    return generateValidEmailMessage(email);
  }
}
