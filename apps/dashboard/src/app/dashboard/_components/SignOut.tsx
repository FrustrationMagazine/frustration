import React from "react";
import { Button } from "@/ui/components/button";
import { signOutDashboard } from "../_actions/signOut";
import { RiLogoutBoxLine } from "react-icons/ri";

const SignOut = () => {
  return (
    <form action={signOutDashboard}>
      <Button variant='secondary' type='submit' className='flex items-center gap-2'>
        <RiLogoutBoxLine />
        <span>Se déconnecter</span>
      </Button>
    </form>
  );
};

export default SignOut;
