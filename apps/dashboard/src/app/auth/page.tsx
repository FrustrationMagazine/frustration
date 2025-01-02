import { signedIn } from "@dashboard/auth";
import { redirect } from "next/navigation";

async function Root({ children }: { readonly children: React.ReactNode }) {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");
  if (isSignedIn) redirect("/dashboard/income");

  return children;
}

export default Root;
