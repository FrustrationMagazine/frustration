import { refreshMediasInDatabase } from "../../dashboard/videos/_actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  await refreshMediasInDatabase();
  return new Response(`🕰️ Refreshed videos from region`);
}
