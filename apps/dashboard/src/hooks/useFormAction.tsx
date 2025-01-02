import { useEffect, useActionState } from "react";

type Status = {
  successMessage: string | null;
  errorMessage: string | null;
};

const initial: Status = {
  successMessage: "",
  errorMessage: "",
};

export function useFormAction(
  action: (prevState: Status, data: FormData) => Promise<Status>,
  reload: boolean = false,
): [Status, (payload: FormData) => void, boolean] {
  // 🔼 State
  const [state, formAction, pending] = useActionState(action, initial);

  // 🔁 Reload after success
  useEffect(() => {
    if (state?.successMessage && reload) {
      setTimeout(() => window.location.reload(), 2000);
    }
  }, [state?.successMessage, reload]);

  return [state, formAction, pending];
}
