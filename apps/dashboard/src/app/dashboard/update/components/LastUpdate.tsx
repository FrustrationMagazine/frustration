"use client";

import React from "react";

// 🔧 Utils
import { getDateSegments } from "../_utils";

// 🐝 Fetch
import { getLastUpdate } from "../_actions";

const LastUpdate: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dateISOString = await getLastUpdate();
        if (dateISOString) setLastUpdate(new Date(dateISOString));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const { day, time, elapsedDays } = getDateSegments(lastUpdate);

  return (
    <p className="text-center">
      <span className="text-2xl">🕰️</span>
      <br />
      <span className="text-lg font-bold">Dernière mise à jour</span>
      <br />
      {loading ? (
        <span className="text-sm">Chargement...</span>
      ) : (
        <>
          {elapsedDays ? (
            <>
              {+elapsedDays === 0 ? <span>Aujourd&rsquo;hui</span> : null}
              {+elapsedDays === 1 ? <span>Hier</span> : null}
              {+elapsedDays === 2 ? <span>Avant-hier</span> : null}
              {+elapsedDays > 2 ? (
                <span> Il y a {elapsedDays} jours</span>
              ) : null}
            </>
          ) : (
            <span>Pas de dernière mise à jour</span>
          )}
          <br />
          {day && <span className="text-xs capitalize">{day}</span>}{" "}
          {time && <span className="text-xs">{time}</span>}
        </>
      )}
    </p>
  );
};

export default LastUpdate;
