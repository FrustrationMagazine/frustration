"use client";

import { useState, useEffect } from "react";

// Assets
import { bebasNeue } from "@dashboard/fonts";
import { BiMailSend } from "react-icons/bi";

// Components
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { useToast } from "@/ui/components/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";

// Form
import { useForm } from "react-hook-form";
import { sendMagicLinkAction } from "./_actions";
import { useFormState } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "./_models";

/* Header */
/**********/
const AUTHENTIFICATION = (
  <header
    className={`bg-black px-5 py-2 text-frustration-yellow ${bebasNeue.className} text-center text-3xl uppercase`}
  >
    Authentification
  </header>
);

const EmailInput = ({ field }: { field: any }) => (
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <Input placeholder='' {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

/* *****************************/
/*           Sign In           */
/*******************************/

export default function SignIn() {
  const [formState, formAction] = useFormState(sendMagicLinkAction, {
    successMessage: "",
    errorMessage: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formState?.successMessage || formState?.errorMessage) setLoading(false);
  }, [formState]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  /* Display toaster with server error or success message */
  /* ---------------------------------------------------- */
  useEffect(
    function displayToaster() {
      if (formState?.successMessage) {
        setTimeout(() => {
          toast({
            title: "✅ Succès",
            description: formState?.successMessage,
          });
        }, 0);
      }

      if (formState?.errorMessage) {
        setTimeout(() => {
          toast({
            title: "Une erreur s'est produite",
            description: formState?.errorMessage,
            variant: "destructive",
          });
        }, 0);
      }
    },
    [formState, toast],
  );

  /******************/
  /*     RENDER     */
  /******************/

  return (
    <div className={`m-auto w-[90%] max-w-[500px] shadow-lg`}>
      {AUTHENTIFICATION}
      <Form {...form}>
        <form
          className='group flex flex-col gap-[20px] bg-white p-5'
          onSubmit={form.handleSubmit((data) => {
            const formData = new FormData();
            const fields = Object.keys(data) as (keyof z.infer<typeof SignInFormSchema>)[];
            fields.forEach((field) => formData.append(field, data[field]));
            formAction(formData);
            setLoading(true);
          })}
        >
          <FormField control={form.control} name='email' render={EmailInput} />
          <Button disabled={loading} className='mx-auto w-fit' type='submit'>
            <BiMailSend size={17} className='mr-2' />
            Recevoir un lien de connexion
          </Button>
        </form>
      </Form>
    </div>
  );
}
