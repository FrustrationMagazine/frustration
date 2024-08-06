"use server";

import { redirect } from "next/navigation";

// 🔒 Authentication
import { signOut } from "@dashboard/auth";

export const signOutDashboard = async () => {
  // 🔁 SIGN OUT
  try {
    await signOut({ redirect: false });
  } catch (error) {
    // ❌ REJECTED
    console.log("error:", error);
  } finally {
    // ✅ SIGNED OUT  REDICRETION
    redirect("/auth/signin");
  }
};
