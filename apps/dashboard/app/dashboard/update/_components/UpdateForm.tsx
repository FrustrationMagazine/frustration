"use client";

import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/ui/components/form";
import { Button } from "@/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateDashboard } from "../_actions/updateDashboard";
import { TfiReload } from "react-icons/tfi";
import { useToast } from "@/ui/components/use-toast";

export default function UpdateForm() {
  const [formState, formAction] = useFormState(updateDashboard, {
    successMessage: null,
    errorMessage: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formState?.successMessage || formState?.errorMessage) setLoading(false);
  }, [formState]);

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const UpdateFormSchema = z.object({
    begin: z.number(),
    end: z.number(),
  });
  const form = useForm<z.infer<typeof UpdateFormSchema>>({
    resolver: zodResolver(UpdateFormSchema),
    defaultValues: {
      begin: 0,
      end: 0,
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

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => {
          formRef.current?.submit();
          setLoading(true);
        })}
      >
        <Button disabled={loading} className='font-bold' variant='default' type='submit'>
          {loading ? <TfiReload className='mr-2 animate-spin' /> : null}
          <span>Mettre à jour le dashboard</span>
        </Button>
      </form>
    </Form>
  );
}
