"use server";

// 🐝 API
import {
  searchYoutube,
  listYoutubeResources,
  listYoutubeVideo,
  listYoutubePlaylist,
} from "@/data-access/youtube";

// 💽 Database
import { prisma, Prisma } from "@/data-access/prisma";

const YOUTUBE_VIDEO_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const YOUTUBE_PLAYLIST_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]list=)|youtu\.be\/)([a-zA-Z0-9_-]{34})/;

/* ------------------------- */
/* Fetch youtube suggestions */
/* ------------------------- */

export async function fetchYoutubeSuggestions(params: Record<string, any>): Promise<any> {
  const isYoutubeVideo = YOUTUBE_VIDEO_URL_REGEX.test(params.q);
  const isYoutubePlaylist = YOUTUBE_PLAYLIST_URL_REGEX.test(params.q);

  if (isYoutubeVideo) {
    const [, videoId] = params.q.match(YOUTUBE_VIDEO_URL_REGEX);
    const video = (await listYoutubeResources({ id: videoId, maxResults: 1 }, "video"))?.[0];
    if (params.type === "video") {
      return [video];
    }
    if (params.type === "channel") {
      const results = await searchYoutube({ channelId: videoId, maxResults: 1 });
      return results ?? [];
    }
  }

  if (isYoutubePlaylist && params.type === "playlist") {
    const [, playlistId] = params.q.match(YOUTUBE_PLAYLIST_URL_REGEX);
    const results = await listYoutubeResources({ id: playlistId, maxResults: 1 }, "playlist");
    return results ?? [];
  }
  const results = await searchYoutube(params);
  console.log(results);
  return results ?? [];
}

export async function fetchYoutubeResourcesByIds(
  ids: string[],
  type: "channel" | "playlist" | "video",
): Promise<any> {
  const results = await listYoutubeResources({ id: ids.join(",") }, type);
  return results ?? [];
}

/* ----------------------- */
/* Get all videos by type  */
/* ----------------------- */
export async function getYoutubeResourcesByType(
  type: "channel" | "playlist" | "video" = "video",
): Promise<any> {
  // 🔁 Fetch
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
    });
    console.log("videos retrouvées !", videos);
    return videos;
  } catch (e) {
    // ❌ Error
    console.error("Error while fetching recorded youtube resources by type", e);
    return [];
  }
}

/* --------------- */
/* Add to database */
/* --------------- */

export async function addYoutubeResource({
  type,
  id,
}: {
  type: "channel" | "playlist" | "video";
  id: string;
}): Promise<any> {
  // 🔁 Insert
  try {
    const result = await prisma.video.create({
      data: {
        type,
        id,
        source: "youtube",
      },
    });
    console.log("result", result);
    const status = {
      successMessage: `Successfully added ${type} to database`,
      errorMessage: null,
    };
    console.log("status", status);
    return status;
  } catch (e) {
    // ❌ Error

    const status = {
      successMessage: null,
      errorMessage:
        // Still facing this issue https://github.com/prisma/prisma/issues/17945
        e?.constructor.name === Prisma.PrismaClientKnownRequestError.name
          ? (e as any)?.message
          : "Une erreur inconnue s'est produite",
    };
    return status;
  }
}

/* -------------------- */
/* Remove from database */
/* -------------------- */

export async function removeYoutubeResource({
  id,
  type,
}: {
  id: string;
  type: "channel" | "playlist" | "video";
}): Promise<any> {
  // 🔁 Insert
  try {
    const result = await prisma.video.delete({
      where: {
        id,
      },
    });

    const status = {
      successMessage: `Successfully removed ${type} to database`,
      errorMessage: null,
    };
    console.log("status", status);
    return status;
  } catch (e) {
    // ❌ Error

    const status = {
      successMessage: null,
      errorMessage:
        // Still facing this issue https://github.com/prisma/prisma/issues/17945
        e?.constructor.name === Prisma.PrismaClientKnownRequestError.name
          ? (e as any)?.message
          : "Une erreur inconnue s'est produite",
    };
    return status;
  }
}
