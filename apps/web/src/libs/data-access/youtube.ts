import dotenv from "dotenv";
dotenv.config();
const API_KEY_GOOGLE = process.env.API_KEY_GOOGLE;

// Types and constants

const API_ENDPOINT = "https://www.googleapis.com/youtube/v3";

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type Thumbnails = {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard: Thumbnail;
  maxres: Thumbnail;
};

export type ResourceId = {
  kind: string;
  videoId: string;
};

export type PlaylistItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: ResourceId;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
};

// Functions

function warnApiKeyIsMissing(): void {
  console.warn("No API key for Google found.");
}

export function createVideoYoutubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export async function fetchYoutubeVideosFromChannel(params: Record<string, any>): Promise<any> {
  if (!API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${API_ENDPOINT}/search`);
  url.searchParams.append("key", API_KEY_GOOGLE);
  url.searchParams.append("type", "video");
  url.searchParams.append("order", "date");
  url.searchParams.append("part", "snippet");

  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

export async function fetchYoutubeVideosFromPlaylist(params: Record<string, any>): Promise<PlaylistItem[]> {
  if (!API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${API_ENDPOINT}/playlistItems`);
  url.searchParams.append("key", API_KEY_GOOGLE);
  url.searchParams.append("part", "snippet");
  url.searchParams.append("order", "date");
  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  try {
    const response = await fetch(url.href);
    const { items }: { items: PlaylistItem[] } = await response.json();
    return items;
  } catch (error) {
    console.error("Error while fetching videos:", error);
    throw error;
  }
}
