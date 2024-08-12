import React from "react";

// 🗿 Models
import { DEFAULT_LAST_UPDATE_DATE } from "../_models";

// 🔧 Utils
import { getDateInformations } from "../_utils";

const LastUpdate: React.FC<{ lastUpdate: Date | null }> = ({ lastUpdate }) => {
  const { day, time, elapsedDays } = lastUpdate
    ? getDateInformations(lastUpdate)
    : DEFAULT_LAST_UPDATE_DATE;

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

  const LastDate = day ? <span className='text-xs capitalize'>{day}</span> : null;
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
