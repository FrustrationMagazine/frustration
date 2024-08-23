// 🗿 Models
import { type LastUpdateType } from "./_models";

export const getDateInformations: (date: Date) => LastUpdateType = (date) => {
  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const [day, time] = typeof formattedDate === "string" ? formattedDate.split(/\s(?=à)/) : [];

  const SECONDS_IN_DAY = 1000 * 3600 * 24;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const elapsedDays = String(Math.floor((now.getTime() - date.getTime()) / SECONDS_IN_DAY));

  return { day, time, elapsedDays };
};
