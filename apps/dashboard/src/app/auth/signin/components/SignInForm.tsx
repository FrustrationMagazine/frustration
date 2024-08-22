"use client";

// 🔩 Base
import React from "react";

// 🖼️ Assets
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
import { sendMagicLinkAction } from "../_actions";
import { SignInFormSchema } from "../_models";
import { convertDataToFormData } from "@dashboard/libs/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 🪝 Hooks
import { useForm } from "react-hook-form";
import { useFormToast } from "@dashboard/hooks/useFormToast";
import { useFormLoader } from "@dashboard/hooks/useFormLoader";
import { useFormStateMessage } from "@dashboard/hooks/useFormStateMessage";

export default function () {
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

  const EmailField = (
    <FormField
      control={form.control}
      name='email'
      render={({ field }) => (
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
    <Form {...form}>
      <form
        className='group flex flex-col gap-[20px] bg-white p-5'
        onSubmit={form.handleSubmit(submit)}
      >
        {EmailField}
        {MagicLinkButton}
      </form>
    </Form>
  );
}
