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
        onSubmit={form.handleSubmit((data) => {
          const formData = new FormData();
          const fields = Object.keys(data) as (keyof z.infer<typeof UpdateFormSchema>)[];
          fields.forEach((field) => formData.append(field, data[field]));
          formAction(formData);
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
                        <b>la dernière transaction enregistrée</b> et ajoute toutes les transactions
                        effectuées depuis.{" "}
                      </p>
                      <p>
                        Elle met également à jour les{" "}
                        <b>transactions déjà enregistrées mais datant de moins d&apos;un mois</b>{" "}
                        car leur statut a pu évoluer entre temps (par exemple, une transaction
                        Stripe peut voir son statut passer de &apos;pending&apos; à
                        &apos;available&apos; une fois son montant disponible pour tout transfert
                        vers un compte).
                      </p>
                      <p>
                        La <b>mise à jour brute</b> réécrit intégralement la table des transactions
                        en partant de la date la plus éloignée possible.
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
