import React from "react";
import { fetchLastDashboardUpdatedDate } from "@dashboard/stripe";

const LastUpdate = async () => {
  const [lastUpdate, formattedLastUpdate] = await fetchLastDashboardUpdatedDate();

  if (!lastUpdate) return null;

  const [lastUpdateFormattedDate, lastUpdateFormattedTime] =
    typeof formattedLastUpdate === "string" ? formattedLastUpdate.split(/\s(?=à)/) : [];

  const SECONDS_IN_DAY = 1000 * 3600 * 24;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  lastUpdate.setHours(0, 0, 0, 0);

  const elapsedDays =
    lastUpdate instanceof Date
      ? Math.floor((new Date().getTime() - lastUpdate.getTime()) / SECONDS_IN_DAY)
      : null;

  return (
    <p className='text-center'>
      <span className='text-2xl'>🕰️</span> <br />
      <span className='text-lg font-bold'>Dernière mise à jour</span> <br />
      {elapsedDays ? (
        <span>
          Il y a {elapsedDays} jour{elapsedDays > 1 && "s"}
        </span>
      ) : (
        <span>Aujourd&rsquo;hui</span>
      )}{" "}
      <br />
      <span className='text-xs capitalize'>{lastUpdateFormattedDate}</span>{" "}
      <span className='text-xs'>{lastUpdateFormattedTime}</span>
    </p>
  );
};

export default LastUpdate;
