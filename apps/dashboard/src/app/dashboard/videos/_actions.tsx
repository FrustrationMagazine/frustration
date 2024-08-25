"use server";

// 🔧 Libs
import {
  fetchYoutube,
  YoutubeResourceType,
  YOUTUBE_VIDEO_URL_REGEX,
  YOUTUBE_PLAYLIST_URL_REGEX,
} from "@/data-access/youtube";

// 💽 Database
import { prisma, createRecord, deleteRecord } from "@/data-access/prisma";

/* --------------------------- */
/* 🐝 API Youtube transactions */
/* --------------------------- */

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
        params: isVideoUrl ? { id: video.snippet.channelId } : params,
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

/* ------------------------ */
/* 📀 Database transactions */
/* ------------------------ */

/* Read video (by type)  */
/* --------------------- */
export async function readVideosByType(type: YoutubeResourceType = "video"): Promise<any> {
  // 🔁 📀 Fetch
  try {
    const videos = await prisma.video.findMany({
      select: {
        id: true,
      },
      where: {
        type: {
          equals: type,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return videos;
  } catch (e) {
    // ❌ Error
    console.error("Error while fetching from database by type", e);
    return [];
  }
}

/* Add video */
/* --------- */

export async function createVideoRecord({
  type,
  id,
}: {
  type: YoutubeResourceType;
  id: string;
}): Promise<any> {
  // 🔁 📀 Add
  const status = createRecord({
    table: "video",
    data: {
      type,
      id,
      source: "youtube",
    },
    success: `La ${type} a été ajoutée !`,
  });

  // 🎉 Return
  return status;
}

/* Remove video */
/* ------------ */

export async function deleteVideoRecord({
  id,
  type,
}: {
  id: string;
  type: YoutubeResourceType;
}): Promise<any> {
  // 🔁 📀 Remove
  const status = deleteRecord({
    table: "video",
    id,
    success: `La ${type} a été supprimée !`,
  });

  // 🎉 Return
  return status;
}
