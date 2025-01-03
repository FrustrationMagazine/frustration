"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { Button } from "@/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/dialog";
import { Input } from "@/ui/components/input";
import SuperBallsLoader from "@/ui/loaders/loader-super-balls";

import VideoPreview from "./VideoPreview";

// 🔧 Libs
import {
  YoutubeResourceType,
  getYoutubeResourceId,
} from "@/data-access/youtube";

// 🌍 i18n
import { typesTranslations } from "../_models";

// 🪝 Hooks
import useVideos from "../hooks/useVideos";

type Props = {
  readonly type: YoutubeResourceType;
  readonly title: string;
  readonly texts: Record<string, any>;
};

export default function VideosCard({
  type,
  title,
  texts,
}: Props): React.ReactNode {
  const {
    searchTerm,
    setSearchTerm,

    suggestions,
    loadingSuggestions,

    medias,
    loadingMedias,

    handleSearch,
    handleAddMedia,
    handleDeleteMedia,
  } = useVideos({ type });

  /* Title */
  /* ===== */
  const Title = <h3 className="font-bebas text-4xl">{title}</h3>;

  /* Subtitle */
  /* ======== */
  const Subtitle = <p className="text-zinc-800">{texts?.subtitle}</p>;

  /* Add */
  /* === */
  const Add = (
    <Button
      className="mx-auto flex items-center gap-2 rounded-md"
      disabled={false /*loadingRecords */}
      variant="inverted"
    >
      <span> Ajouter </span>
    </Button>
  );

  /* Search */
  /* ====== */
  const Search = (
    <form
      className="flex w-full items-center space-x-2"
      onSubmit={handleSearch}
    >
      <Input
        type="text"
        placeholder={texts?.placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="submit">Rechercher</Button>
    </form>
  );

  /* Dialog */
  /* ====== */
  const AddDialog = (
    <Dialog>
      <DialogTrigger asChild>{Add}</DialogTrigger>
      <DialogContent className="max-w-[1000px]">
        <DialogHeader className="space-y-0">
          <DialogTitle>{texts?.dialogTitle}</DialogTitle>
          <DialogDescription>{texts?.dialogDescription}</DialogDescription>
        </DialogHeader>
        {Search}
        {loadingSuggestions ? (
          <SuperBallsLoader className="mx-auto my-12" />
        ) : (
          suggestions.map((suggestion: any) => (
            <VideoPreview
              id={getYoutubeResourceId(suggestion)}
              key={getYoutubeResourceId(suggestion)}
              title={suggestion.snippet.title}
              description={suggestion.snippet.description}
              type={type}
              thumbnail={suggestion.snippet.thumbnails.default.url}
              texts={texts}
              iconAction={handleAddMedia}
              iconType="add"
            />
          ))
        )}
      </DialogContent>
    </Dialog>
  );

  /* Loader */
  /* ====== */
  const LoaderVideosList = <SuperBallsLoader className="mx-auto my-12" />;

  /* No videos */
  /* ========= */
  const NoVideos = <p>🤷‍♂️ Aucune {typesTranslations.get(type)} </p>;

  /* Videos list */
  /* =========== */
  const VideosList =
    medias.length === 0 ? (
      NoVideos
    ) : (
      <ul className="space-y-1">
        {medias.map((media: any) => (
          <VideoPreview
            {...media}
            type={type}
            texts={texts}
            iconType="remove"
            iconAction={handleDeleteMedia}
          />
        ))}
      </ul>
    );

  /* =========== */
  /*    🚀 UI    */
  /* =========== */
  return (
    <div
      key={type}
      className="max-h-full space-y-5 self-start overflow-auto rounded-md bg-white p-6 text-center shadow-md"
    >
      <div>
        {Title}
        {Subtitle}
      </div>
      {AddDialog}
      {loadingMedias ? LoaderVideosList : VideosList}
    </div>
  );
}
