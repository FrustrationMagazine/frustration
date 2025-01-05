"use client";

import React from "react";

// 🖼️ Assets
import { TfiReload } from "react-icons/tfi";

// 🧱 Components
import TooltipUpdate from "./TooltipUpdate";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@dashboard/components/Form";
import { Button } from "@dashboard/components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";

// 🗒️ Form
import { updateDashboard } from "../_actions";
import { FormUpdateSchema } from "../_models";
import { toFormData } from "@/utils/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 🪝 Hooks
import { useForm } from "react-hook-form";
import { useFormToast } from "@dashboard/hooks/useFormToast";
import { useFormLoader } from "@dashboard/hooks/useFormLoader";
import { useFormAction } from "@dashboard/hooks/useFormAction";

const FormUpdate = () => {
  const [formState, formAction] = useFormAction(updateDashboard, true);
  const [loading, setLoading] = useFormLoader(formState);
  useFormToast(formState);

  type FormUpdateType = z.infer<typeof FormUpdateSchema>;
  const form = useForm<FormUpdateType>({
    resolver: zodResolver(FormUpdateSchema),
    defaultValues: {
      method: "smart",
    },
  });

  const submit = (data: FormUpdateType) => {
    const formData = toFormData(data);
    formAction(formData);
    setLoading(true);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center gap-5"
        onSubmit={form.handleSubmit(submit)}
      >
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <FormItem className="space-y-0">
                <input type="hidden" name={field.name} value={field.value} />
                <Select
                  disabled={loading}
                  required
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="top">
                    <SelectItem value="smart">
                      Mise à jour intelligente (plus rapide)
                    </SelectItem>
                    <SelectItem value="all">Mise à jour brute</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              <TooltipUpdate />
            </div>
          )}
        />
        <Button
          disabled={loading}
          className="font-bold"
          variant="default"
          type="submit"
        >
          {loading ? (
            <TfiReload className="mr-2 animate-spin direction-reverse" />
          ) : null}
          <span>Mettre à jour le dashboard</span>
        </Button>
      </form>
    </Form>
  );
};

export default FormUpdate;
