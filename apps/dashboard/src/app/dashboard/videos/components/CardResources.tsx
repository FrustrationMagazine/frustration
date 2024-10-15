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

import ResourcePreview from "./ResourcePreview";

// 🖼️ Assets
import { bebasNeue } from "../../../../fonts";
import { AiOutlineVideoCameraAdd, AiFillDelete } from "react-icons/ai";

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

// 🌍 i18n
import { typesTranslations } from "../_models";

const isProduction = process.env.NODE_ENV === "production";

export default function CardResources({
  type,
  title,
  texts,
}: {
  type: YoutubeResourceType;
  title: string;
  texts: Record<string, any>;
}): React.ReactNode {
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const [suggestions, setSuggestions] = React.useState<any>([]);
  const [loadingSuggestions, setLoadingSuggestions] =
    React.useState<boolean>(false);

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

  // 🧱 Components
  const CardTitle = (
    <h3 className={`text-5xl ${bebasNeue.className}`}>{title}</h3>
  );
  const CardSubtitle = <p className="text-zinc-800">{texts?.subtitle}</p>;
  const AddButton = (
    <Button
      className="mx-auto flex items-center gap-2 rounded-md"
      disabled={false /*loadingRecords */}
      variant="inverted"
    >
      <AiOutlineVideoCameraAdd size={17} />
      <span> Ajouter </span>
    </Button>
  );
  const SearchInput = (
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

  // 🎨 Styles
  const whiteCard =
    "max-h-full space-y-5 self-start overflow-auto rounded-md bg-white p-6 text-center shadow-md";

  return (
    <div key={type} className={whiteCard}>
      <div>
        {CardTitle}
        {CardSubtitle}
      </div>
      <Dialog>
        <DialogTrigger asChild>{AddButton}</DialogTrigger>
        <DialogContent className="max-w-[1000px]">
          <DialogHeader className="space-y-0">
            <DialogTitle>{texts?.dialogTitle}</DialogTitle>
            <DialogDescription>{texts?.dialogDescription}</DialogDescription>
          </DialogHeader>
          {SearchInput}
          {loadingSuggestions ? (
            <SuperBallsLoader className="mx-auto my-12" />
          ) : (
            suggestions.map((suggestion: any) => (
              <ResourcePreview
                id={getYoutubeResourceId(suggestion)}
                key={getYoutubeResourceId(suggestion)}
                title={suggestion.snippet.title}
                description={suggestion.snippet.description}
                type={type}
                thumbnailUrl={suggestion.snippet.thumbnails.default.url}
                texts={texts}
                Icon={AiOutlineVideoCameraAdd}
                iconAction={handleAddMedia}
                actionType="add"
              />
            ))
          )}
        </DialogContent>
      </Dialog>
      {loadingMedias ? (
        <SuperBallsLoader className="mx-auto my-12" />
      ) : medias.length === 0 ? (
        <p>🤷‍♂️ Aucune {typesTranslations.get(type)} </p>
      ) : (
        <ul className="space-y-1">
          {medias.map((media: any) => (
            <ResourcePreview
              id={media.id}
              key={media.id}
              type={type}
              thumbnailUrl={media.thumbnail}
              title={media.title}
              description={media.description}
              texts={texts}
              Icon={AiFillDelete}
              iconAction={handleDeleteMedia}
              actionType="remove"
            />
          ))}
        </ul>
      )}
    </div>
  );
}
