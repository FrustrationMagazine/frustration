'use server';

import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export const signOutDashboard = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.log('error:', error);
  } finally {
    redirect('/auth/signin');
  }
};
