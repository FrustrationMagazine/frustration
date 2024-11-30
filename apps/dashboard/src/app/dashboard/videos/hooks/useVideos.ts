"use client";

// 🔩 Base
import React from "react";

// 💥 Server actions
import {
  fetchSuggestions,
  createMediaRecord,
  deleteMediaRecord,
  readMediaByType,
  refreshMediasInDatabase,
} from "../_actions";

// 🔧 Libs
import {
  YoutubeResourceType,
  getYoutubeResourceId,
} from "@/data-access/youtube";

const isProduction = process.env.NODE_ENV === "production";

type Props = {
  type: YoutubeResourceType;
};

const useVideos = ({ type }: Props) => {
  /* Term */
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  /* Suggestions */
  const [suggestions, setSuggestions] = React.useState<any>([]);
  const [loadingSuggestions, setLoadingSuggestions] =
    React.useState<boolean>(false);

  /* Medias */
  const [medias, setMedias] = React.useState<any>([]);
  const [loadingMedias, setLoadingMedias] = React.useState(true);

  React.useEffect(() => {
    (async function () {
      const medias = await readMediaByType(type);
      setMedias(medias);
      setLoadingMedias(false);
    })();
  }, []);

  // 📀 Add media
  const handleAddMedia = async ({
    type,
    id,
  }: {
    type: YoutubeResourceType;
    id: string;
  }) => {
    const status = await createMediaRecord({ type, id });

    // ✅ Resource created !
    if (status.success) {
      // 1️⃣ Add saved suggestion to listed resources
      let suggestionToAdd = suggestions.find(
        (suggestion: any) => getYoutubeResourceId(suggestion) === id,
      );

      suggestionToAdd = {
        id: suggestionToAdd.id,
        type,
        thumbnail: suggestionToAdd.snippet.thumbnails.default.url,
        title: suggestionToAdd.snippet.title,
        description: suggestionToAdd.snippet.description,
      };

      setMedias((medias: any[]) => [suggestionToAdd, ...medias]);

      // During development mode we fetch directly new medias information instead of redeploying the app
      if (!isProduction) await refreshMediasInDatabase();

      // 2️⃣ Remove suggestion from current suggestions list
      setSuggestions(
        suggestions.filter(
          (suggestion: any) => getYoutubeResourceId(suggestion) !== id,
        ),
      );
    }
  };

  // 📀 Remove media
  const handleDeleteMedia = async ({ id }: { id: string }) => {
    const status = await deleteMediaRecord({ type, id });

    // ✅ Resource created !
    if (status.success) {
      // During development mode we fetch directly new medias information instead of redeploying the app
      if (!isProduction) await refreshMediasInDatabase();

      // 1️⃣ Remove deleted resource from listed resources
      setMedias(medias.filter((media: any) => media.id !== id));
    }
  };

  // 🐝 Fetch suggestions
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ⏳ Loading...
    setLoadingSuggestions(true);

    // 🐝 🔁 Fetch youtube suggestions by type
    const suggestions = await fetchSuggestions({
      q: searchTerm,
      relevanceLanguage: "fr",
      type,
    });

    // ⌛ End loading...
    setLoadingSuggestions(false);

    // 📦
    setSuggestions(suggestions);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    loadingSuggestions,
    medias,
    loadingMedias,
    handleAddMedia,
    handleDeleteMedia,
    handleSearch,
  };
};

export default useVideos;
