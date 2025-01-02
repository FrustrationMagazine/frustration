"use client";

import { signOutAction } from "./_actions";
import { useEffect } from "react";
import RedirectionMessage from "@dashboard/components/RedirectionMessage";

function SignOut() {
  useEffect(() => {
    signOutAction();
  }, []);

  return (
    <RedirectionMessage href="auth/signin">
      En cours de déconnexion...
    </RedirectionMessage>
  );
}

export default SignOut;
