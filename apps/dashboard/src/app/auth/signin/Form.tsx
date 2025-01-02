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
import { sendLink as serverAction } from "./_actions";
import { schema, type Status } from "./_models";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 🪝 Hooks
import { useForm } from "react-hook-form";
import { useToast } from "@dashboard/hooks/useToast";

const initial: Status = {
  success: "",
  error: "",
};

export default function () {
  // 🔼 State
  const [state, sendLink, pending] = React.useActionState(
    serverAction,
    initial,
  );

  // 🍞 Toast
  const { toast } = useToast();
  // ✅
  React.useEffect(() => {
    toast({ title: "✅ Succès", description: state.success });
  }, [state.success]);
  // ❌
  React.useEffect(() => {
    toast({
      title: "Erreur",
      description: state.error,
      variant: "destructive",
    });
  }, [state.error]);

  // 📝 Form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  /* 📨 */
  /* -- */
  const Email = (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="frustration.magazine@gmail.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  /* 🆕 */
  /* -- */
  const Send = (
    <Button disabled={pending} className="mx-auto w-fit" type="submit">
      <BiMailSend size={17} className="mr-2" />
      Recevoir un lien de connexion
    </Button>
  );

  /* ---------- */
  /*     UI     */
  /* -----------*/

  return (
    <Form {...form}>
      <form
        className="group flex flex-col gap-[20px] bg-white p-5"
        action={sendLink}
      >
        {Email}
        {Send}
      </form>
    </Form>
  );
}
