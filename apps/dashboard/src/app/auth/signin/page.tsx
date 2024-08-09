"use client";

import { useState, useEffect } from "react";

// 🖼️ Assets
import { bebasNeue } from "@dashboard/fonts";
import { BiMailSend } from "react-icons/bi";

// 🧱 Components
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";

// 🗒️ Form
import { useForm } from "react-hook-form";
import { convertDataToFormData } from "@dashboard/libs/form";
import { sendMagicLinkAction } from "./_actions";
import { useFormState } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "./_models";

// 🪝 Hooks
import { useFormToast } from "@dashboard/hooks/useFormToast";
import { useFormLoader } from "@dashboard/hooks/useFormLoader";
import { useFormStateMessage } from "@dashboard/hooks/useFormStateMessage";

export default function SignIn() {
  /* -------------- */
  /*      FORM      */
  /* -------------- */

  const [formState, formAction] = useFormStateMessage(sendMagicLinkAction);

  type SignInFormType = z.infer<typeof SignInFormSchema>;

  const [loading, setLoading] = useFormLoader(formState);
  useFormToast(formState);

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const submit = (data: SignInFormType) => {
    const formData = convertDataToFormData(data);
    formAction(formData);
    setLoading(true);
  };

  /* -------------- */
  /* SUB COMPONENTS */
  /* -------------- */

  const Header = (
    <header
      className={`bg-black px-5 py-2 text-frustration-yellow ${bebasNeue.className} text-center text-3xl uppercase`}
    >
      Authentification
    </header>
  );

  const EmailField = (
    <FormField
      control={form.control}
      name='email'
      render={(field) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder='' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const MagicLinkButton = (
    <Button disabled={loading} className='mx-auto w-fit' type='submit'>
      <BiMailSend size={17} className='mr-2' />
      Recevoir un lien de connexion
    </Button>
  );

  /* ---------- */
  /*     UI     */
  /* -----------*/

  return (
    <div className={`m-auto w-[90%] max-w-[500px] shadow-lg`}>
      {Header}
      <Form {...form}>
        <form
          className='group flex flex-col gap-[20px] bg-white p-5'
          onSubmit={form.handleSubmit(submit)}
        >
          {EmailField}
          {MagicLinkButton}
        </form>
      </Form>
    </div>
  );
}
