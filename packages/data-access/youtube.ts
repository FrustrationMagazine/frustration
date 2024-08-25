/* --------- */
/* 🔧 Utils  */
/* --------- */

export function createYoutubeUrlFromIdAndType(type: string, id: string) {
  switch (type) {
    case "channel":
      return `https://www.youtube.com/channel/${id}`;
    case "playlist":
      return `https://www.youtube.com/playlist?list=${id}`;
    case "video":
      return `https://www.youtube.com/watch?v=${id}`;
  }
}

/* --------- */
/* 🗿 Models */
/* --------- */

export type YoutubeResourceType = "channel" | "playlist" | "video";

export const YOUTUBE_VIDEO_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
export const YOUTUBE_PLAYLIST_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]list=)|youtu\.be\/)([a-zA-Z0-9_-]{34})/;

/* ------------ */
/* 🐝 API Calls */
/* ------------ */

/* Fetch youtube */
/* ------------- */
export async function fetchYoutube({ params, type }: { params: Record<string, any>; type?: YoutubeResourceType }): Promise<any> {
  // ❌ #1 Early return if no API key detected
  if (!process.env.API_KEY_GOOGLE) {
    console.warn("No API key for Google found.");
    return [];
  }

  // 🥘 Prepare
  const endpoint = type ? `${process.env.API_ENDPOINT_YOUTUBE}/${type}s` : `${process.env.API_ENDPOINT_YOUTUBE}/search`;
  const url = new URL(endpoint);
  url.searchParams.append("key", process.env.API_KEY_GOOGLE);
  url.searchParams.append("part", "snippet");

  // Add each param from params object that was passed to URL
  for (let param in params) url.searchParams.append(param, params[param]);

  // 🔁 Fetch
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    // 🎉 Return
    return items;
  } catch (error) {
    // 🚨 Error
    console.error(`Error occured while fetching youtube ${type}s:`, error);
    throw error;
  }
}
