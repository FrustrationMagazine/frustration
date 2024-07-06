'use client';

import { sendMagicLink } from '@/actions';
import { bebasNeue } from '@/fonts';
import { BiMailSend } from 'react-icons/bi';
import { useFormState } from 'react-dom';
import React from 'react';

export default function SignIn() {
  const [errorMessage, dispatch] = useFormState(sendMagicLink, null);

  const ErrorMessage = errorMessage ? (
    <p className='bg-red-200 px-3 py-2 text-red-900'>
      Vous n'êtes pas autorisé à vous connecter avec cet e-mail
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
        <input
          type='email'
          name='email'
          placeholder='Email'
          title='Entrez un email valide'
          required
          className='rounded-md border border-black px-3 py-2'
        />
        <button
          className={`flex items-center justify-center gap-2 bg-black px-3 py-2 text-white`}
          type='submit'
        >
          <BiMailSend size={22} />
          <span>Recevoir le lien de connexion</span>
        </button>
      </form>
    </div>
  );
}
