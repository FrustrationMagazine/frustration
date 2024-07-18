"use client";

import clsx from "clsx";
import { sendMagicLinkAction } from "./_actions/sendMagicLink";
import { SignInFormSchema } from "./_schemas/signIn";
import { bebasNeue } from "@dashboard/utils/fonts";
import { BiMailSend } from "react-icons/bi";
import { useFormState } from "react-dom";
import { useRef, useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export default function SignIn() {
  const [formState, formAction] = useFormState(sendMagicLinkAction, {
    successMessage: "",
    errorMessage: "",
  });

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

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
          ref={formRef}
          className='group flex flex-col gap-[20px] bg-white p-5'
          action={formAction}
          onSubmit={form.handleSubmit(() => formRef.current?.submit())}
        >
          <FormField control={form.control} name='email' render={EmailInput} />
          <Button className='mx-auto w-fit' type='submit'>
            <BiMailSend size={17} className='mr-2' />
            Recevoir un lien de connexion
          </Button>
        </form>
      </Form>
    </div>
  );
}
