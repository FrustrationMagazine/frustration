import { updateTransactions, updateStripeBalance } from "../../dashboard/update/_actions";

export async function GET() {
  await updateTransactions({ updateMethod: "smart" });
  await updateStripeBalance();
  return new Response(`Updated dashboard from region : ${process.env.VERCEL_REGION}`);
}
