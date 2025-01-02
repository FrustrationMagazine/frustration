import { signedIn } from "@dashboard/auth";
import { redirect } from "next/navigation";

async function Root() {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");
  if (isSignedIn) redirect("/dashboard/income");

  return null;
}

export default Root;
