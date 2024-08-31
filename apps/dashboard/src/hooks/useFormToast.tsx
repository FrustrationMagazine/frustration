import React from "react";
import { useToast } from "@/ui/components/useToast";
import type { FormSubmissionStatus } from "@dashboard/libs/form";

export const useFormToast = (formState: FormSubmissionStatus) => {
  const { toast } = useToast();

  React.useEffect(
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
};
