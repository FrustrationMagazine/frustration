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
  createVideoRecord,
  deleteVideoRecord,
  readVideosByType,
  fetchByIdsAndType,
} from "../_actions";

// 🔧 Libs
import { YoutubeResourceType, getYoutubeResourceId } from "@/data-access/youtube";

// 🪝 Hooks
import { useToast } from "@/ui/components/use-toast";

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
  const [loadingSuggestions, setLoadingSuggestions] = React.useState<boolean>(false);

  const [records, setRecords] = React.useState<any>([]);
  const [loadingRecords, setLoadingRecords] = React.useState(true);

  const [requestStatus, setRequestStatus] = React.useState<{
    success: string | null;
    error: string | null;
  }>({ success: null, error: null });

  // 📀 Read videos resources
  React.useEffect(() => {
    (async function () {
      // ⏳ Loading...
      setLoadingRecords(true);
      try {
        // 🔁 📀 Read videos resources
        const resources = await readVideosByType(type);
        const resourcesIds = resources.map((resource: any) => resource.id) as string[];

        // 🔁 🐝 Get full resources video information
        let results = (await fetchByIdsAndType(resourcesIds, type)) ?? [];
        // Get the same display order as the resources stored in database
        results = resources.map((resource: any) =>
          results.find((result: any) => result.id === resource.id),
        );
        setRecords(results);
      } catch (e) {
        console.error("Error while loading resources", e);
        return;
      } finally {
        setLoadingRecords(false);
      }
    })();
  }, []);

  // 📀 Add video
  const handleAddRecord = async ({ type, id }: { type: YoutubeResourceType; id: string }) => {
    const status = await createVideoRecord({ type, id });
    setRequestStatus(status);

    // ✅ Resource created !
    if (status.success) {
      // 1️⃣ Add saved suggestion to listed resources
      let suggestionToAdd = suggestions.find(
        (suggestion: any) => getYoutubeResourceId(suggestion) === id,
      );
      suggestionToAdd = { snippet: { ...suggestionToAdd.snippet }, id };
      setRecords([suggestionToAdd, ...records]);

      // 2️⃣ Remove suggestion from current suggestions list
      setSuggestions(
        suggestions.filter((suggestion: any) => getYoutubeResourceId(suggestion) !== id),
      );
    }
  };

  // 📀 Remove video
  const handleDeleteRecord = async ({ type, id }: { type: YoutubeResourceType; id: string }) => {
    const status = await deleteVideoRecord({ type, id });
    setRequestStatus(status);

    // ✅ Resource deleted !
    if (status.success) {
      // Remove deleted resource from listed resources
      setRecords(records.filter((resource: any) => getYoutubeResourceId(resource) !== id));
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

  const { toast } = useToast();
  React.useEffect(
    function displayToaster() {
      if (requestStatus?.success) {
        toast({
          title: "✅ Succès",
          description: requestStatus?.success,
        });
      }

      if (requestStatus?.error) {
        toast({
          title: "Une erreur s'est produite",
          description: requestStatus?.error,
          variant: "destructive",
        });
      }
    },
    [requestStatus, toast],
  );

  // 🧱 Components
  const CardTitle = <h3 className={`text-5xl ${bebasNeue.className}`}>{title}</h3>;
  const CardSubtitle = <p className='text-zinc-800'>{texts?.subtitle}</p>;
  const AddButton = (
    <Button
      className='mx-auto flex items-center gap-2 rounded-md'
      disabled={loadingRecords}
      variant='inverted'
    >
      <AiOutlineVideoCameraAdd size={17} />
      <span> Ajouter </span>
    </Button>
  );
  const SearchInput = (
    <form className='flex w-full items-center space-x-2' onSubmit={handleSearch}>
      <Input
        type='text'
        placeholder={texts?.placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type='submit'>Rechercher</Button>
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
        <DialogContent className='max-w-[1000px]'>
          <DialogHeader className='space-y-0'>
            <DialogTitle>{texts?.dialogTitle}</DialogTitle>
            <DialogDescription>{texts?.dialogDescription}</DialogDescription>
          </DialogHeader>
          {SearchInput}
          {loadingSuggestions ? (
            <SuperBallsLoader className='mx-auto my-12' />
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
                iconAction={handleAddRecord}
                actionType='add'
              />
            ))
          )}
        </DialogContent>
      </Dialog>
      {loadingRecords ? (
        <SuperBallsLoader className='mx-auto my-12' />
      ) : records.length === 0 ? (
        <p>🤷‍♂️ Aucune {type} </p>
      ) : (
        <ul className='space-y-1'>
          {records.map((resource: any) => (
            <ResourcePreview
              id={getYoutubeResourceId(resource)}
              key={getYoutubeResourceId(resource)}
              type={type}
              thumbnailUrl={resource.snippet.thumbnails.default.url}
              title={resource.snippet.title}
              description={resource.snippet.description}
              texts={texts}
              Icon={AiFillDelete}
              iconAction={handleDeleteRecord}
              actionType='remove'
            />
          ))}
        </ul>
      )}
    </div>
  );
}
