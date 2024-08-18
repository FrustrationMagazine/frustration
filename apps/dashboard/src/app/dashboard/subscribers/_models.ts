import { z } from "zod";

export const GetLastSubscribersFormSchema = z.object({
  begin: z.date(),
  end: z.date(),
});

export interface Header {
  name: string;
  key: string;
  display: boolean;
}

export const HEADERS: Header[] = [
  {
    name: "Id",
    key: "id",
    display: false,
  },
  {
    name: "Crée",
    key: "created",
    display: true,
  },
  {
    name: "Nom",
    key: "name",
    display: true,
  },
  {
    name: "Email",
    key: "email",
    display: true,
  },
  {
    name: "Montant",
    key: "amount",
    display: true,
  },
  {
    name: "Adresse",
    key: "adresse",
    display: true,
  },
  {
    name: "Code postal",
    key: "code_postal",
    display: true,
  },
  {
    name: "Ville",
    key: "ville",
    display: true,
  },
];
