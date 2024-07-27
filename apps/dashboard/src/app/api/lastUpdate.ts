import type { NextApiRequest, NextApiResponse } from "next";
import { fetchLastDashboardUpdatedDate } from "@dashboard/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [lastUpdate, formattedLastUpdate] = await fetchLastDashboardUpdatedDate();
    res.status(200).json({ lastUpdate, formattedLastUpdate });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch last update date" });
  }
}
