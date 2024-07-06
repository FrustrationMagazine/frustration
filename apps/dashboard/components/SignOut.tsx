import React from "react";
import { signOut } from "@/auth";
import { RiLogoutBoxLine } from "react-icons/ri";

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server";
        signOut();
      }}
    >
      <button
        type="submit"
        className="text-black bg-frustration-yellow px-4 py-2 font-bold rounded-md flex items-center gap-2"
      >
        <RiLogoutBoxLine />
        <span>Se déconnecter</span>
      </button>
    </form>
  );
};

export default SignOut;
