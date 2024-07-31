import { z } from "zod";

export const GetLastSubscribersFormSchema = z.object({
  begin: z.date(),
  end: z.date(),
});
