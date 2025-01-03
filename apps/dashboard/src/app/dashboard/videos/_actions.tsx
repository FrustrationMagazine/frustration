"use server";

// 🔧 Libs
import {
  fetchYoutube,
  getYoutubeResourceId,
  YoutubeResourceType,
  YOUTUBE_VIDEO_URL_REGEX,
  YOUTUBE_PLAYLIST_URL_REGEX,
} from "@/data-access/youtube";

// 💽 Database
import { prisma, createRecord, deleteRecord } from "@/data-access/prisma";

// 🌍 i18n
import { typesTranslations } from "./_models";

/* --------------------------- */
/* Fetch youtube suggestions   */
/* --------------------------- */

export async function fetchSuggestions(
  params: Record<string, any>,
): Promise<any> {
  // 🥘 Prepare
  const isVideoUrl = YOUTUBE_VIDEO_URL_REGEX.test(params.q);
  const isPlaylistUrl = YOUTUBE_PLAYLIST_URL_REGEX.test(params.q);
  let suggestions = [];
  let video;
  let playlist;

  // 🔁 🐝 Fetch video if a video URL was passed
  if (isVideoUrl) {
    const [, videoId] = params.q.match(YOUTUBE_VIDEO_URL_REGEX);
    const { items } = await fetchYoutube({
      params: { id: videoId },
      type: "video",
    });

    video = items?.[0];
  }

  // 🔁 🐝 Fetch playlist if a playlist URL was passed
  if (isPlaylistUrl) {
    const [, playlistId] = params.q.match(YOUTUBE_PLAYLIST_URL_REGEX);
    const { items } = await fetchYoutube({
      params: { id: playlistId },
      type: "playlist",
    });

    playlist = items?.[0];
  }

  let token = null;

  // 🔁 🐝 Fetch by type
  switch (params.type) {
    case "channel": {
      // Get channel with search param or thanks to a video id if video URL that belongs to that channel was passed
      const { items, nextPageToken = null } = await fetchYoutube({
        params: isVideoUrl ? { id: video.snippet.channelId } : params,
      });
      suggestions = items;
      token = nextPageToken;
      break;
    }
    case "playlist": {
      // Get playlist with search param or thanks to its id in URL if playlist URL was passed
      const { items, nextPageToken = null } = isPlaylistUrl
        ? { items: [playlist] }
        : await fetchYoutube({ params });
      suggestions = items;
      token = nextPageToken;
      break;
    }
    case "video": {
      // Get video with search param or thanks to its id in URL if video URL was passed
      const { items, nextPageToken = null } = isVideoUrl
        ? { items: [video] }
        : await fetchYoutube({ params });
      suggestions = items;
      token = nextPageToken;

      break;
    }
  }

  return { suggestions, token };
}

/* -------------------------------------- */
/* Fetch youtube resources by id and type */
/* -------------------------------------- */

export async function fetchYoutubeByIdsAndType(
  ids: string[],
  type: YoutubeResourceType,
): Promise<any> {
  // 🥘 Prepare
  // Necessay to concatenate ids for the fetch
  const concatenatedIds = ids.join(",");
  let resources = [];

  // 🔁 📺 Fetch
  const { items } = await fetchYoutube({
    params: { id: concatenatedIds },
    type,
  });
  resources = items;

  // 🎉 Return
  return resources;
}

async function upsertYoutubeVideo(youtubeVideo: any, mediaId: string) {
  await prisma.media_video.upsert({
    where: {
      id: youtubeVideo.id,
    },
    update: {
      title: youtubeVideo.snippet.title,
      description: youtubeVideo.snippet.description,
      thumbnail: youtubeVideo.snippet.thumbnails.default.url,
      thumbnailMaxResolution: youtubeVideo.snippet.thumbnails.maxres.url,
      channelId: youtubeVideo.snippet.channelId,
      channelTitle: youtubeVideo.snippet.channelTitle,
      playlistId: youtubeVideo.snippet.playlistId,
      playlistTitle: youtubeVideo.snippet.playlistTitle,
    },
    create: {
      id: youtubeVideo.id,
      title: youtubeVideo.snippet.title,
      description: youtubeVideo.snippet.description,
      thumbnail: youtubeVideo.snippet.thumbnails.default.url,
      thumbnailMaxResolution: youtubeVideo.snippet.thumbnails.maxres.url,
      channelId: youtubeVideo.snippet.channelId,
      channelTitle: youtubeVideo.snippet.channelTitle,
      playlistId: youtubeVideo.snippet.playlistId,
      playlistTitle: youtubeVideo.snippet.playlistTitle,
      publishedAt: youtubeVideo.snippet.publishedAt,
      mediaId,
    },
  });
}

async function upsertYoutubePlaylist(youtubePlaylist: any, mediaId: string) {
  await prisma.media_playlist.upsert({
    where: {
      id: youtubePlaylist.id,
    },
    update: {
      title: youtubePlaylist.snippet.title,
      description: youtubePlaylist.snippet.description,
      channelId: youtubePlaylist.snippet.channelId,
      channelTitle: youtubePlaylist.snippet.channelTitle,
      thumbnail: youtubePlaylist.snippet.thumbnails.default.url,
    },
    create: {
      id: youtubePlaylist.id,
      title: youtubePlaylist.snippet.title,
      description: youtubePlaylist.snippet.description,
      channelId: youtubePlaylist.snippet.channelId,
      channelTitle: youtubePlaylist.snippet.channelTitle,
      thumbnail: youtubePlaylist.snippet.thumbnails.default.url,
      publishedAt: youtubePlaylist.snippet.publishedAt,
      mediaId,
    },
  });
}

async function upsertYoutubeChannel(youtubeChannel: any, mediaId: string) {
  await prisma.media_channel.upsert({
    where: {
      id: youtubeChannel.id,
    },
    update: {
      title: youtubeChannel.snippet.title,
      description: youtubeChannel.snippet.description,
      thumbnail: youtubeChannel.snippet.thumbnails.default.url,
    },
    create: {
      id: youtubeChannel.id,
      title: youtubeChannel.snippet.title,
      mediaId,
      description: youtubeChannel.snippet.description,
      thumbnail: youtubeChannel.snippet.thumbnails.default.url,
      publishedAt: youtubeChannel.snippet.publishedAt,
    },
  });
}

/* ------------------------ */
/* 📀 Database transactions */
/* ------------------------ */

/* Read video (by type)  */
/* --------------------- */
export async function readMediaByType(
  type: YoutubeResourceType = "video",
): Promise<any> {
  // 🔁 📀 Fetch
  let table = `media_${type}` as any;

  try {
    const medias = await (prisma[table] as any).findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });
    return medias;
  } catch (e) {
    // ❌ Error
    console.error("Error while fetching from database by type", e);
    return [];
  }
}

/* Add video */
/* --------- */

export async function createMediaRecord({
  type,
  id,
}: {
  type: YoutubeResourceType;
  id: string;
}): Promise<any> {
  // 🔁 📀 Add
  const status = await createRecord({
    table: "media",
    data: {
      type,
      id,
      source: "youtube",
    },
    success: `La ${typesTranslations.get(type)} a été ajoutée !`,
  });

  // 🎉 Return
  return status;
}

/* Remove video */
/* ------------ */

export async function deleteMediaRecord({
  id,
  type,
}: {
  id: string;
  type: YoutubeResourceType;
}): Promise<any> {
  // 🔁 📀 Remove
  const status = deleteRecord({
    table: "media",
    id,
    success: `La ${type} a été supprimée !`,
  });

  // 🎉 Return
  return status;
}

/* Fetch and update media records */
/* ------------------------------ */

export async function insertOrUpdateMediaRecord({
  type,
  id,
}: {
  type: YoutubeResourceType;
  id: string;
}): Promise<any> {
  // 1. Video
  if (type === "video") {
    const { items } = await fetchYoutube({
      type,
      params: {
        id,
      },
    });
    items.forEach(
      async (youtubeVideo: any) => await upsertYoutubeVideo(youtubeVideo, id),
    );
  }
  // 2. Playlist
  if (type === "playlist") {
    // 🔁 📺 Fetch playlists
    const { items } = await fetchYoutube({
      type,
      params: {
        id,
      },
    });

    items.forEach(async (youtubePlaylist: any) => {
      // 🔁 📺 Upsert each playlist in media_playlist
      await upsertYoutubePlaylist(youtubePlaylist, id);

      // 🔁 📺 Fetch - We get videos of playlist as playlist items
      const { items: youtubePlaylistItems } = await fetchYoutube({
        params: { playlistId: id },
        type: "playlistItem",
      });

      if (youtubePlaylistItems) {
        const youtubeVideos = youtubePlaylistItems.map((video: any) => ({
          ...video,
          id: video.snippet.resourceId.videoId,
          snippet: {
            ...video.snippet,
            playlistTitle: youtubePlaylist.snippet.title,
          },
        }));
        youtubeVideos.forEach(
          async (youtubeVideo: any) =>
            await upsertYoutubeVideo(youtubeVideo, id),
        );
      }
    });
  }
  // 3. Channel
  if (type === "channel") {
    // 🔁 📺 Fetch channels
    const { items } = await fetchYoutube({
      type,
      params: {
        id,
      },
    });

    items.forEach(async (youtubeChannel: any) => {
      // 🔁 📺 Upsert each channel in media_channel
      await upsertYoutubeChannel(youtubeChannel, id);

      // 🔁 📺 Fetch each first X videos of each channel in media_video
      const MAX_VIDEOS_FROM_CHANNEL = 10;
      const { items: youtubeVideos } = await fetchYoutube({
        params: {
          type: "video",
          channelId: id,
          order: "date",
          maxResults: MAX_VIDEOS_FROM_CHANNEL,
        },
      });

      if (youtubeVideos) {
        // ❓ To get full description we need to re-fetch videos with their id
        const idsToFetch = youtubeVideos.map(getYoutubeResourceId);
        const concatenatedIds = idsToFetch.join(",");
        const { items: newYoutubeVideos } = await fetchYoutube({
          params: { id: concatenatedIds },
          type: "video",
        });

        // 🔁 📺 Upsert each first X videos of each channel in media_video
        newYoutubeVideos.forEach(
          async (youtubeVideo: any) =>
            await upsertYoutubeVideo(youtubeVideo, id),
        );
      }
    });
  }
}

/* Refresh medias in database */
/* -------------------------- */
export async function refreshMediasInDatabase() {
  console.info("🔄 Refreshing medias in database...");
  const medias = await prisma.media.findMany();
  await prisma.media_video.deleteMany();
  medias.forEach(
    async ({ type, id }) => await insertOrUpdateMediaRecord({ type, id }),
  );
}

/* ------------------------ */
/* 🪝 Deployment hooks      */
/* ------------------------ */

export async function redeploy() {
  let status: {
    success: string | null;
    error: string | null;
  } = {
    success: null,
    error: null,
  };

  // ✨ Refresh from existing medias in database
  await refreshMediasInDatabase();

  // ❌ Early return | Not redeploying in development
  if (process.env.NODE_ENV !== "production") {
    status.error =
      "Le redéploiement n'est pas possible en environnement de développement";
    return status;
  }

  // ❌ Early return | No deploy hook found
  if (!process.env.DEPLOY_HOOK) {
    status.error =
      "Aucun hook de déploiement trouvé parmi les variables d'environnement";
    return status;
  }

  try {
    const response = await fetch(process.env.DEPLOY_HOOK, { method: "POST" });
    if (response.ok) status.success = "🚀 Redéploiement du site...";
    if (!response.ok)
      status.error =
        "❌ Une erreur est survenue lors de la tentative de redéploiement";
  } catch (e) {
    status.error = `❌ Error while fetching with git hook`;
    console.error(e);
  }

  return status;
}
