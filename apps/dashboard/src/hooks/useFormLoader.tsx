import React from "react";
import { FormSubmissionStatus } from "@dashboard/libs/form";

type UseFormLoaderReturnType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const useFormLoader = (formState: FormSubmissionStatus): UseFormLoaderReturnType => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (formState?.successMessage || formState?.errorMessage) setLoading(false);
  }, [formState]);

  return [loading, setLoading];
};
