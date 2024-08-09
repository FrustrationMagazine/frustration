import { useFormState } from "react-dom";
import { FormSubmissionStatus } from "@dashboard/models/form";

export function useFormStateMessage(
  action: (prevState: FormSubmissionStatus, data: FormData) => Promise<FormSubmissionStatus>,
): [FormSubmissionStatus, (payload: FormData) => void] {
  const initialState: FormSubmissionStatus = {
    successMessage: "",
    errorMessage: "",
  };

  const [formState, formAction] = useFormState(action, initialState);
  return [formState, formAction];
}
