import { Resend } from "resend";

export async function addSubscriber({ email, firstName, lastName }: { email: string; firstName: string | undefined; lastName: string | undefined }) {
  // ❌ Early return if the api key is not set
  if (!process.env.RESEND_API_KEY) {
    console.warn("🔎 Missing api key to add subscriber");
    return;
  }

  // ❌ Early return if the audience id is not set
  if (!process.env.SUBSCRIBERS_AUDIENCE_ID) {
    console.warn("🔎 Missing audience id to add subscriber");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: process.env.SUBSCRIBERS_AUDIENCE_ID
    });
    console.log("result", result);
  } catch (e) {
    console.error("error while creating a new subscriber contact", e);
  }
}
