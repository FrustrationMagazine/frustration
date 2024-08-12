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
  successMessage: string | null;
  errorMessage: string | null;
};

export const SUCCESS: UpdateDashboardResponse = {
  successMessage: "Le dashboard a bien été mis à jour !",
  errorMessage: null,
};

export const ERROR: UpdateDashboardResponse = {
  successMessage: null,
  errorMessage: "Il y a eu un problème durant la mise à jour du dashboard 😕",
};

export const ERROR_GET_LAST_RECORD: UpdateDashboardResponse = {
  successMessage: null,
  errorMessage: "Impossible d'obtenir le dernier paiement enregistré",
};

export const ERROR_GET_BALANCE: UpdateDashboardResponse = {
  successMessage: null,
  errorMessage: "Le solde courant de Stripe n'a pas pu être récupéré 😕",
};

export const ERROR_UPSERT_PAYMENTS: UpdateDashboardResponse = {
  successMessage: null,
  errorMessage: "Impossible de mettre à jour les paiements",
};

export const ERROR_UPDATE_BALANCE: UpdateDashboardResponse = {
  successMessage: null,
  errorMessage: "Le solde courant de Stripe n'a pas pu être à mis à jour 😕",
};

export const ERROR_UNKNOWN: UpdateDashboardResponse = {
  successMessage: null,
  errorMessage: "Il y a eu un problème inconnu durant la mise à jour du dashboard 😕",
};
