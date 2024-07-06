'use client';

import clsx from 'clsx';
import { sendMagicLink } from '@/actions';
import { bebasNeue } from '@/fonts';
import { BiMailSend } from 'react-icons/bi';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

const SendMagicLinkButton = ({ email }: { email: string }) => {
  const { pending } = useFormStatus();
  const shouldDisableButton = pending || !email;
  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-2 bg-black px-3 py-2 text-white',
        { 'opacity-30': shouldDisableButton }
      )}
      type='submit'
      disabled={shouldDisableButton}
    >
      <BiMailSend size={22} />
      <span>Recevoir le lien de connexion</span>
    </button>
  );
};

/* BANNER */
/**********/
const Banner = ({
  message,
  color = 'red',
}: {
  message: string;
  color: string;
}) => (
  <p className={`bg-${color}-200 px-3 py-2 text-sm text-${color}-900`}>
    {message}
  </p>
);

/*********************************/
/*           SIGN IN             */
/*********************************/

export default function SignIn() {
  const [status, dispatch] = useFormState(sendMagicLink, null);
  const [email, setEmail] = React.useState('');

  /******************/
  /* SUB COMPONENTS */
  /******************/

  const Header = (
    <header
      className={`bg-black px-5 py-3 text-frustration-yellow ${bebasNeue.className} text-center text-3xl uppercase`}
    >
      S'identifier
    </header>
  );

  console.log('status', status);

  const ErrorMessage = status?.errorMessage ? (
    <Banner message={status.errorMessage as string} color='red' />
  ) : null;

  const SuccessMessage = status?.successMessage ? (
    <Banner message={status.successMessage as string} color='green' />
  ) : null;

  const MailInput = (
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
  );

  /**********/
  /* RENDER */
  /**********/

  const POPUP_WIDTH = '400px';

  return (
    <div className={`m-auto w-[${POPUP_WIDTH}] shadow-lg`}>
      {Header}
      <form className='flex flex-col gap-[20px] bg-white p-5' action={dispatch}>
        {ErrorMessage}
        {SuccessMessage}
        {MailInput}
        <SendMagicLinkButton email={email} />
      </form>
    </div>
  );
}
