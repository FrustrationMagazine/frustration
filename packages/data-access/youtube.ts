function warnApiKeyIsMissing(): void {
  console.warn("No API key for Google found.");
}

export function createVideoYoutubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export async function searchYoutube(params: Record<string, any>): Promise<any> {
  if (!process.env.API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${process.env.API_ENDPOINT_YOUTUBE}/search`);
  url.searchParams.append("key", process.env.API_KEY_GOOGLE);
  url.searchParams.append("maxResults", "3");
  url.searchParams.append("part", "snippet");

  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  console.log("url", url);
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching youtube resource:", error);
    throw error;
  }
}

export async function listYoutubeResources(params: Record<string, any>, type: "channel" | "playlist" | "video"): Promise<any> {
  if (!process.env.API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${process.env.API_ENDPOINT_YOUTUBE}/${type}s`);
  url.searchParams.append("key", process.env.API_KEY_GOOGLE);
  url.searchParams.append("part", "snippet");

  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error(`Error occured while fetching youtube ${type}s:`, error);
    throw error;
  }
}

export async function listYoutubeChannel(params: Record<string, any>): Promise<any> {
  if (!process.env.API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${process.env.API_ENDPOINT_YOUTUBE}/videos`);
  url.searchParams.append("key", process.env.API_KEY_GOOGLE);
  url.searchParams.append("part", "snippet");

  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching youtube channels:", error);
    throw error;
  }
}

export async function listYoutubeVideo(params: Record<string, any>): Promise<any> {
  if (!process.env.API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${process.env.API_ENDPOINT_YOUTUBE}/videos`);
  url.searchParams.append("key", process.env.API_KEY_GOOGLE);
  url.searchParams.append("part", "snippet");

  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching youtube video:", error);
    throw error;
  }
}

export async function listYoutubePlaylist(params: Record<string, any>): Promise<any> {
  if (!process.env.API_KEY_GOOGLE) {
    warnApiKeyIsMissing();
    return [];
  }
  const url = new URL(`${process.env.API_ENDPOINT_YOUTUBE}/playlists`);
  url.searchParams.append("key", process.env.API_KEY_GOOGLE);
  url.searchParams.append("part", "snippet");

  Object.entries(params).forEach(([param, value]) => url.searchParams.append(param, value));
  try {
    const response = await fetch(url.href);
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching youtube playlist:", error);
    throw error;
  }
}
