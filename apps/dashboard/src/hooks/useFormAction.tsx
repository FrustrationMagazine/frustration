import { useEffect, useActionState } from "react";

type Status = {
  success: string | null;
  error: string | null;
};

const initial: Status = {
  success: "",
  error: "",
};

export function useFormAction(
  action: (prevState: Status, data: FormData) => Promise<Status>,
  reload: boolean = false,
): [Status, (payload: FormData) => void, boolean] {
  // 🔼 State
  const [state, formAction, pending] = useActionState(action, initial);

  // 🔁 Reload after success
  useEffect(() => {
    if (state?.success && reload) {
      setTimeout(() => window.location.reload(), 2000);
    }
  }, [state?.success, reload]);

  return [state, formAction, pending];
}
