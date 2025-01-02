import { z } from "zod";

export const schema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
});

// 💬 Form status
export type Status = {
  success: string | null;
  error: string | null;
};
