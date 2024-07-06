'use client';

import clsx from 'clsx';
import { sendMagicLink } from '@/actions';
import { bebasNeue } from '@/fonts';
import { BiMailSend } from 'react-icons/bi';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

const SendMagicLinkButton = ({ email }: { email: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-2 bg-black px-3 py-2 text-white',
        { 'opacity-30': pending || !email }
      )}
      type='submit'
      disabled={pending || !email}
    >
      <BiMailSend size={22} />
      <span>Recevoir le lien de connexion</span>
    </button>
  );
};

export default function SignIn() {
  const [status, dispatch] = useFormState(sendMagicLink, null);
  const [email, setEmail] = React.useState('');

  const ErrorMessage = status?.errorMessage ? (
    <p className='bg-red-200 px-3 py-2 text-sm text-red-900'>
      Vous n'êtes pas autorisé à vous connecter avec cet e-mail
    </p>
  ) : null;

  const SuccessMessage = status?.successMessage ? (
    <p className='bg-green-200 px-3 py-2 text-sm text-green-900'>
      {status.successMessage}
    </p>
  ) : null;

  return (
    <div className='m-auto w-[400px] shadow-lg'>
      <header
        className={`bg-black px-5 py-3 text-frustration-yellow ${bebasNeue.className} text-center text-3xl uppercase`}
      >
        S'identifier
      </header>
      <form className='flex flex-col gap-[20px] bg-white p-5' action={dispatch}>
        {ErrorMessage}
        {SuccessMessage}
        <input
          type='email'
          name='email'
          placeholder='Email'
          title='Entrez un email valide'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className='rounded-md border border-black px-3 py-2'
        />
        <SendMagicLinkButton email={email} />
      </form>
    </div>
  );
}
