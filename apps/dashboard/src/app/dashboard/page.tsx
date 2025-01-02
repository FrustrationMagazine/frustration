// 🔑 Auth
import { signedIn } from "../auth/auth";
import { redirect } from "next/navigation";

async function Dashboard({ children }: { readonly children: React.ReactNode }) {
  const isSignedIn = await signedIn();
  if (isSignedIn) redirect("dashboard/income");

  return children;
}

export default Dashboard;
