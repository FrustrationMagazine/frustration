import { waitUntil } from "@vercel/functions";
import { updateTransactions, updateStripeBalance } from "../../dashboard/update/_actions";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request: Request) {
  waitUntil(updateTransactions({ updateMethod: "smart" }));
  waitUntil(updateStripeBalance());
  return new Response(`Updated dashboard from region : ${process.env.VERCEL_REGION}`);
}
