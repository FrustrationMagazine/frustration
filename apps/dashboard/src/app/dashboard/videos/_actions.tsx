"use server";

import { searchYoutube, searchYoutubeVideo, searchYoutubePlaylist } from "@/data-access/youtube";

const YOUTUBE_VIDEO_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const YOUTUBE_PLAYLIST_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]list=)|youtu\.be\/)([a-zA-Z0-9_-]{34})/;

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
  return results ?? [];
}
