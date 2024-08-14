import { defineCollection, z } from "astro:content";

const authorsCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      first_name: z.string(),
      last_name: z.string().optional(),
      full_name: z.string(),
      role: z.string().optional(),
      picture: image(),
      punchline: z.string().optional(),
      themes: z.array(z.string()).optional(),
      public: z.boolean().optional().default(false),
    }),
});

const youtubePlaylistsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    playlistId: z.string(),
    url: z.string().url(),
  }),
});

const youtubeVideosCollections = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
  }),
});

const youtubeChannelsCollections = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
  }),
});

export const collections = {
  authors: authorsCollection,
  youtubePlaylists: youtubePlaylistsCollection,
  youtubeVideos: youtubeVideosCollections,
  youtubeChannels: youtubeChannelsCollections,
};
