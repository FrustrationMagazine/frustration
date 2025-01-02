// 🔑 Auth
import { signedIn } from "@dashboard/auth";
import { redirect } from "next/navigation";

async function DashboardRoot() {
  const isSignedIn = await signedIn();
  if (isSignedIn) redirect("dashboard/income");

  return null;
}

export default DashboardRoot;
