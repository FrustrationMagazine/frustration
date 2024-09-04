import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { addSubscriber } from "@/data-access/mail";

export const server = {
  addSubscriber: defineAction({
    input: z.object({
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    handler: addSubscriber,
  }),
};
