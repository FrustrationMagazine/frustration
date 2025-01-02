// 🔑 Auth
import { signedIn } from "@dashboard/auth";
import { redirect } from "next/navigation";

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function DashboardRoot({ children }: Props) {
  const isSignedIn = await signedIn();
  if (isSignedIn) redirect("dashboard/income");

  return children;
}

export default DashboardRoot;
