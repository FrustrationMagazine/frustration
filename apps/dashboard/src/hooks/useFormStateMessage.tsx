import { useEffect } from "react";
import { useFormState } from "react-dom";
import { FormSubmissionStatus } from "@/utils/form";

export function useFormStateMessage(
  action: (prevState: FormSubmissionStatus, data: FormData) => Promise<FormSubmissionStatus>,
  shouldReloadAfterSuccess: boolean = false,
): [FormSubmissionStatus, (payload: FormData) => void] {
  const initialState: FormSubmissionStatus = {
    successMessage: "",
    errorMessage: "",
  };

  const [formState, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (formState?.successMessage && shouldReloadAfterSuccess) {
      setTimeout(() => window.location.reload(), 2000);
    }
  }, [formState?.successMessage, shouldReloadAfterSuccess]);

  return [formState, formAction];
}
