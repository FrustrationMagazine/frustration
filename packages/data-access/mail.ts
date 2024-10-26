import { Resend, type ErrorResponse } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function addSubscriber({ email, firstName, lastName }: { email: string; firstName: string | undefined; lastName: string | undefined }) {
  // ❌ Early return if the api key is not set
  if (!process.env.RESEND_API_KEY) {
    console.warn("🔎 Missing api key to add subscriber");
    return { success: false, message: "Missing api key" };
  }

  // ❌ Early return if the audience id is not set
  if (!process.env.SUBSCRIBERS_AUDIENCE_ID) {
    console.warn("🔎 Missing audience id to add subscriber");
    return { success: false, message: "Missing audience id" };
  }
  console.log("email", email);
  try {
    const { error } = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: process.env.SUBSCRIBERS_AUDIENCE_ID
    });

    if (error) throw new Error(error.message);
    return { success: true, message: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred while creating a new subscriber contact";
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }
}
