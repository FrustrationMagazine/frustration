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

export type YoutubeResourceType = "channel" | "playlist" | "video" | "playlistItem";

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

/* Fetch youtube suggestions   */
/* --------------------------- */

export async function fetchSuggestions(params: Record<string, any>): Promise<any> {
  // 🥘 Prepare
  const isVideoUrl = YOUTUBE_VIDEO_URL_REGEX.test(params.q);
  const isPlaylistUrl = YOUTUBE_PLAYLIST_URL_REGEX.test(params.q);
  let suggestions = [];

  // 🔁 🐝 Fetch video if a video URL was passed
  if (isVideoUrl) {
    const [, videoId] = params.q.match(YOUTUBE_VIDEO_URL_REGEX);
    var video = (await fetchYoutube({ params: { id: videoId }, type: "video" }))?.[0];
  }

  // 🔁 🐝 Fetch playlist if a playlist URL was passed
  if (isPlaylistUrl) {
    const [, playlistId] = params.q.match(YOUTUBE_PLAYLIST_URL_REGEX);
    var playlist = (await fetchYoutube({ params: { id: playlistId }, type: "playlist" }))?.[0];
  }

  // 🔁 🐝 Fetch by type
  switch (params.type) {
    case "channel":
      // Get channel with search param or thanks to a video id if video URL that belongs to that channel was passed
      suggestions = await fetchYoutube({
        params: isVideoUrl ? { id: video.snippet.channelId } : params
      });
      break;
    case "playlist":
      // Get playlist with search param or thanks to its id in URL if playlist URL was passed
      suggestions = isPlaylistUrl ? [playlist] : await fetchYoutube({ params });
      break;
    case "video":
      // Get video with search param or thanks to its id in URL if video URL was passed
      suggestions = isVideoUrl ? [video] : await fetchYoutube({ params });
      break;
  }

  return suggestions;
}

/* -------------------------------------- */
/* Fetch youtube resources by id and type */
/* -------------------------------------- */

export async function fetchByIdsAndType(ids: string[], type: YoutubeResourceType): Promise<any> {
  // 🥘 Prepare
  // Necessay to concatenate ids for the fetch
  const concatenatedIds = ids.join(",");
  let resources = [];

  // 🔁 📺 Fetch
  resources = await fetchYoutube({ params: { id: concatenatedIds }, type });

  // 🎉 Return
  return resources;
}

/* -------- */
/* 🔧 Utils */
/* -------- */

/* getYoutubeResourceId */
/* -------------------- */

export const getYoutubeResourceId = (resource: any): string => {
  // ❌ Early return if no resource`
  if (!resource) return "";

  // Case 1️⃣ | If id is directly accessible at root level of resource, return it
  if (typeof resource?.id === "string") return resource.id;

  // Case 2️⃣ | If id is nested in an object, return the "whateverId" value
  //
  // Example 👇
  // id: {
  //        "kind": "youtube#video",
  //        "videoId": "Mkx4iRqcbr4"
  //      }

  const [, [, id]] = Object.entries(resource.id);
  return String(id);
};
