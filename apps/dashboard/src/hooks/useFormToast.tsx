import React from "react";
import { useToast } from "@/ui/components/use-toast";
import type { FormSubmissionStatus } from "@dashboard/models/form";

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
