import React from 'react';
import { signOutDashboard } from '@/actions';
import { RiLogoutBoxLine } from 'react-icons/ri';

const SignOut = () => {
  return (
    <form action={signOutDashboard}>
      <button
        type='submit'
        className='flex items-center gap-2 rounded-md bg-frustration-yellow px-4 py-2 font-bold text-black'
      >
        <RiLogoutBoxLine />
        <span>Se déconnecter</span>
      </button>
    </form>
  );
};

export default SignOut;
