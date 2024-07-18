"use client";

import { Form, FormControl, FormField, FormItem } from "@/ui/components/form";
import { Button } from "@/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/components/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateFormSchema } from "../_models/updateDashboard";
import { useRef, useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateDashboard } from "../_actions/updateDashboard";
import { TfiReload } from "react-icons/tfi";
import { useToast } from "@/ui/components/use-toast";
import { TbInfoSquare } from "react-icons/tb";

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

  const form = useForm<z.infer<typeof UpdateFormSchema>>({
    resolver: zodResolver(UpdateFormSchema),
    defaultValues: {
      method: "smart",
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
        className='flex flex-col items-center gap-5'
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => {
          formRef.current?.submit();
          setLoading(true);
        })}
      >
        <FormField
          control={form.control}
          name='method'
          render={({ field }) => (
            <div className='flex items-center gap-3'>
              <FormItem className='space-y-0'>
                <input type='hidden' name={field.name} value={field.value} />
                <Select
                  disabled={loading}
                  required
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-[300px]'>
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side='top'>
                    <SelectItem value='smart'>Mise à jour intelligente (plus rapide)</SelectItem>
                    <SelectItem value='all'>Mise à jour brute</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <TbInfoSquare className='text-primary' />
                  </TooltipTrigger>
                  <TooltipContent className='w-[350px]'>
                    <div className='space-y-3'>
                      <p>
                        La <b>mise à jour intelligente</b> se base sur la{" "}
                        <b>date de la dernière transaction enregistrée en base</b> et récupère
                        toutes les transactions effectuées depuis.{" "}
                      </p>
                      <p>
                        Elle met également à jour le statut des{" "}
                        <b>transactions déjà enregistrées datant de moins d&apos;un mois</b> (une
                        transaction Stripe typiquement peut avoir un statut &apos;pending&apos; qui
                        évolue vers &apos;available&apos; une fois son montant disponible pour
                        transfert vers un compte).
                      </p>
                      <p>
                        La <b>mise à jour brute</b> réécrit intégralement la table des transactions
                        partant de la date la plus éloignée possible.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        />
        <Button disabled={loading} className='font-bold' variant='default' type='submit'>
          {loading ? <TfiReload className='mr-2 animate-spin direction-reverse' /> : null}
          <span>Mettre à jour le dashboard</span>
        </Button>
      </form>
    </Form>
  );
}
