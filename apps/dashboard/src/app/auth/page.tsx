import { signedIn } from "@auth";
import { redirect } from "next/navigation";

async function AuthRoot() {
  const signed = await signedIn();
  if (!signed) redirect("/auth/signin");
  if (signed) redirect("/dashboard/income");

  return null;
}

export default AuthRoot;
