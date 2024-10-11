import { type APIRoute } from "astro";
import { addSubscriber } from "@/data-access/mail";

export const prerender = false;

export const POST: APIRoute = async ({ request }: { request: any }) => {
  console.log("🛜 /api/webhook \n");
  const event = await request.json();

  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoicePaymentSucceeded = event.data.object;
      if (invoicePaymentSucceeded.billing_reason === "subscription_create") {
        const { success, message } = await addSubscriber({
          email: invoicePaymentSucceeded.customer_email,
          firstName: invoicePaymentSucceeded.customer_name,
          lastName: "",
        });

        if (success) return new Response(null, { status: 200 });

        if (!success) {
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response();
};
