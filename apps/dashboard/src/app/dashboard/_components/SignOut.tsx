"use client";

import React from "react";
import { Button } from "@/ui/components/button";
import { signOutDashboard } from "../_actions/signOut";
import { RiLogoutBoxLine } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/components/alert-dialog";

const SignOut = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='secondary' className='flex items-center gap-2'>
          <RiLogoutBoxLine />
          <span>Se déconnecter</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voulez-vous vraiment vous déconnecter ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <form action={signOutDashboard}>
            <AlertDialogAction asChild>
              <Button type='submit'>Se déconnecter</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOut;
