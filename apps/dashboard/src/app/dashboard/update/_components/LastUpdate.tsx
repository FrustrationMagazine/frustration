"use client";

import React from "react";
import { getLastUpdateDate } from "../_actions/getLastUpdateDate";
import type { LastUpdateDate } from "../_models/lastUpdateDate";
import type { UpdateDashboardResponse } from "../_models/updateDashboard";
import { DEFAULT_LAST_UPDATE_DATE } from "../_models/lastUpdateDate";

const LastUpdate = ({ formState }: { formState: UpdateDashboardResponse }) => {
  const [dates, setDates] = React.useState<LastUpdateDate>(DEFAULT_LAST_UPDATE_DATE);

  React.useEffect(() => {
    const retrieveLastUpdate = async () => {
      const { date, time, elapsedDays } = await getLastUpdateDate();

      setDates({ date, time, elapsedDays });
    };
    retrieveLastUpdate();
  }, [formState.successMessage]);

  const { date, time, elapsedDays } = dates;

  const today = elapsedDays && +elapsedDays === 0;
  const yesterday = elapsedDays && +elapsedDays === 1;
  const dayBeforeYesterday = elapsedDays && +elapsedDays === 2;
  const longTimeAgo = elapsedDays && +elapsedDays > 2;

  const ElapsedDays = elapsedDays ? (
    <>
      {today ? <span>Aujourd&rsquo;hui</span> : null}
      {yesterday ? <span>Hier</span> : null}
      {dayBeforeYesterday ? <span>Avant-hier</span> : null}
      {longTimeAgo ? <span> Il y a {elapsedDays} jours</span> : null}
    </>
  ) : null;

  const Icon = <span className='text-2xl'>🕰️</span>;
  const LastUpdate = <span className='text-lg font-bold'>Dernière mise à jour</span>;

  const LastDate = date ? <span className='text-xs capitalize'>{date}</span> : null;
  const LastTime = time ? <span className='text-xs'> {time}</span> : null;

  return (
    <p className='text-center'>
      {Icon}
      <br />
      {LastUpdate}
      <br />
      {ElapsedDays}
      <br />
      {LastDate}
      {LastTime}
    </p>
  );
};

export default LastUpdate;
