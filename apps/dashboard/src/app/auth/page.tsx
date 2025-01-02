import { signedIn } from "@dashboard/auth";
import { redirect } from "next/navigation";

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function AuthRoot({ children }: Props) {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");
  if (isSignedIn) redirect("/dashboard/income");

  return children;
}

export default AuthRoot;
