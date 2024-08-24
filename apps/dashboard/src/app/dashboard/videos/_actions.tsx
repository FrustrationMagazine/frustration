"use server";

// 🐝 API
import { searchYoutube, searchYoutubeVideo, searchYoutubePlaylist } from "@/data-access/youtube";

// 💽 Database
import { prisma, Prisma } from "@/data-access/prisma";

const YOUTUBE_VIDEO_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const YOUTUBE_PLAYLIST_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]list=)|youtu\.be\/)([a-zA-Z0-9_-]{34})/;

/* --------------------- */
/* Fetch Youtube Results */
/* --------------------- */

export async function fetchYoutubeResults(params: Record<string, any>): Promise<any> {
  const isYoutubeVideo = YOUTUBE_VIDEO_URL_REGEX.test(params.q);
  const isYoutubePlaylist = YOUTUBE_PLAYLIST_URL_REGEX.test(params.q);

  if (isYoutubeVideo) {
    const [, videoId] = params.q.match(YOUTUBE_VIDEO_URL_REGEX);
    const video = (await searchYoutubeVideo({ id: videoId }))?.[0];
    if (params.type === "video") {
      return [video];
    }
    if (params.type === "channel") {
      const results = await searchYoutube({ channelId: videoId });
      return results ?? [];
    }
  }

  if (isYoutubePlaylist && params.type === "playlist") {
    const [, playlistId] = params.q.match(YOUTUBE_PLAYLIST_URL_REGEX);
    console.log("playlistId", playlistId);
    const results = await searchYoutubePlaylist({ id: playlistId });
    return results ?? [];
  }
  const results = await searchYoutube(params);
  console.log(results);
  return results ?? [];
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
    console.log("status", status);
    return status;
  }
}
