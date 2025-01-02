"use client";

import { signOutAction } from "./_actions";
import { useEffect } from "react";

function SignOut() {
  useEffect(() => {
    signOutAction();
  }, []);

  return (
    <button className="m-auto bg-black p-2 px-4 text-3xl font-bold text-frustration-yellow">
      En cours de déconnexion...
    </button>
  );
}

export default SignOut;
