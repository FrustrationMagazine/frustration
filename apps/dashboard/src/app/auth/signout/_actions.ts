"use server";
import { redirect } from "next/navigation";
import { signedIn, signOut } from "../auth";

export const signOutAction = async () => {
  const isSignedIn = await signedIn();
  if (isSignedIn) await signOut({ redirectTo: "/auth/signin", redirect: true });
  if (!isSignedIn) redirect("/auth/signin");
};
