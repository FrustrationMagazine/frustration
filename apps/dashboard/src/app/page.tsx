import React from "react";
import Sidenav from "./dashboard/Sidenav";
import { auth } from "@dashboard/auth";

// Here I check the authentication state to determine wether to display the sidebar

async function Root({ children }: { readonly children: React.ReactNode }) {
  const isSignedIn = !!(await auth())?.user;
  return (
    <>
      {isSignedIn ? <Sidenav /> : null}
      {children}
    </>
  );
}

export default Root;
