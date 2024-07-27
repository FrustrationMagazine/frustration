"use server";

import { fetchLastDashboardUpdatedDate } from "@dashboard/stripe";
import type { LastUpdateDate } from "../_models/lastUpdateDate";
import { DEFAULT_LAST_UPDATE_DATE } from "../_models/lastUpdateDate";


export async function getLastUpdateDate (): Promise<LastUpdateDate> {

  const [lastUpdate, formattedLastUpdate] = await fetchLastDashboardUpdatedDate();

  if (!lastUpdate) return DEFAULT_LAST_UPDATE_DATE;

  const [date, time] =
    typeof formattedLastUpdate === "string" ? formattedLastUpdate.split(/\s(?=à)/) : [];

  const SECONDS_IN_DAY = 1000 * 3600 * 24;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  lastUpdate.setHours(0, 0, 0, 0);

  const elapsedDays =
    lastUpdate instanceof Date
      ? String(Math.floor((new Date().getTime() - lastUpdate.getTime()) / SECONDS_IN_DAY))
      : "-";

  return { date, time, elapsedDays };
}
