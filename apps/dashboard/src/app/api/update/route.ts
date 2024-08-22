import { updateTransactions, updateStripeBalance } from "../../dashboard/update/_actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  await updateTransactions({ updateMethod: "smart" });
  await updateStripeBalance();
  return new Response(`Updated dashboard from region : ${process.env.VERCEL_REGION}`);
}
