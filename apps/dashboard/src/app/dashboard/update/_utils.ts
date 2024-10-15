// 🗿 Models
import { type LastUpdateType, DEFAULT_LAST_UPDATE_DATE } from "./_models";

export const getDateSegments: (lastDate: Date | null) => LastUpdateType = (
  lastDate,
) => {
  // ❌ Early return
  if (!lastDate) return DEFAULT_LAST_UPDATE_DATE;

  const formattedDate = lastDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const [day, time] =
    typeof formattedDate === "string" ? formattedDate.split(/\s(?=à)/) : [];

  const SECONDS_IN_DAY = 1000 * 3600 * 24;
  const now = new Date();
  const lastDateCopy = new Date(lastDate);
  now.setHours(0, 0, 0, 0);
  lastDateCopy.setHours(0, 0, 0, 0);

  const elapsedDays = String(
    Math.floor((now.getTime() - lastDateCopy.getTime()) / SECONDS_IN_DAY),
  );

  return { day, time, elapsedDays };
};
