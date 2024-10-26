import type { APIRoute } from "astro";
import { addSubscriber } from "@/data-access/mail";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  console.log("🛜 /api/add-newsletter-subscriber \n");

  return new Response();
};
