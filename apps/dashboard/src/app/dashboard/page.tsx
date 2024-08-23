import { auth } from "@dashboard/auth";
import { redirect } from "next/navigation";

export default async function () {
  const signedIn = !!(await auth())?.user;
  if (signedIn) redirect("dashboard/income");
  return null;
}
