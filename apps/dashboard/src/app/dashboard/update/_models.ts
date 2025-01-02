import { z } from "zod";

/* ------------- */
/*  Last update  */
/* ------------- */

export type LastUpdateType = {
  day: string | null;
  time: string | null;
  elapsedDays: string | null;
};
export const DEFAULT_LAST_UPDATE_DATE: LastUpdateType = {
  day: null,
  time: null,
  elapsedDays: null,
};

/* ------------- */
/*     Update    */
/* ------------- */

export const FormUpdateSchema = z.object({
  method: z.string({
    required_error: "Choisissez une méthode de mise à jour.",
  }),
});

export type UpdateDashboardResponse = {
  success: string | null;
  error: string | null;
};

export const SUCCESS: UpdateDashboardResponse = {
  success: "Le dashboard a bien été mis à jour !",
  error: null,
};

export const ERROR: UpdateDashboardResponse = {
  success: null,
  error: "Il y a eu un problème durant la mise à jour du dashboard 😕",
};

export const ERROR_GET_LAST_RECORD: UpdateDashboardResponse = {
  success: null,
  error: "Impossible d'obtenir le dernier paiement enregistré",
};

export const ERROR_GET_BALANCE: UpdateDashboardResponse = {
  success: null,
  error: "Le solde courant de Stripe n'a pas pu être récupéré 😕",
};

export const ERROR_UPSERT_PAYMENTS: UpdateDashboardResponse = {
  success: null,
  error: "Impossible de mettre à jour les paiements",
};

export const ERROR_UPDATE_BALANCE: UpdateDashboardResponse = {
  success: null,
  error: "Le solde courant de Stripe n'a pas pu être à mis à jour 😕",
};

export const ERROR_UNKNOWN: UpdateDashboardResponse = {
  success: null,
  error: "Il y a eu un problème inconnu durant la mise à jour du dashboard 😕",
};
