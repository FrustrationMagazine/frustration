import React from "react";
import { useToast } from "./useToast";

type Status = {
  success: string | null;
  error: string | null;
};

export const useFormToast = (state: Status) => {
  const { toast } = useToast();

  React.useEffect(
    function displayToaster() {
      if (state?.success) {
        setTimeout(() => {
          toast({
            title: "✅ Succès",
            description: state?.success,
          });
        }, 0);
      }

      if (state?.error) {
        setTimeout(() => {
          toast({
            title: "Une erreur s'est produite",
            description: state?.error,
            variant: "destructive",
          });
        }, 0);
      }
    },
    [state, toast],
  );
};
