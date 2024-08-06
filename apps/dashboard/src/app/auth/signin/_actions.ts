"use server";

// 🧰 Functions
import { signIn, getAuthorizedEmails } from "@dashboard/auth";

// 🖼️ Models
import {
  SignInFormSchema,
  FormSubmissionStatus,
  INVALID_EMAIL,
  UNAUTHORIZED_EMAIL,
  NO_AUTHORIZED_EMAIL,
  generateValidEmailMessage,
} from "./_models";

export async function sendMagicLinkAction(
  prevState: FormSubmissionStatus,
  data: FormData,
): Promise<FormSubmissionStatus> {
  // 🔎 PARSING
  const formData = Object.fromEntries(data);
  const parsed = SignInFormSchema.safeParse(formData);

  // ❌ INVALID EMAIL
  if (!parsed.success) return INVALID_EMAIL;

  // ❌ AUTHORIZED EMAILS NOT FOUND
  const authorizedEmails = await getAuthorizedEmails();
  if (authorizedEmails.length === 0) return NO_AUTHORIZED_EMAIL;

  // ❌ UNAUTHORIZED EMAIL
  const isAuthorized = authorizedEmails.some(({ email }) => email === parsed.data.email);
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
