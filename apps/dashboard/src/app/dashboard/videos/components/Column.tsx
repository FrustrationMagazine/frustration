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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/components/alert-dialog";
import { Input } from "@/ui/components/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/components/tooltip";
import SuperBallsLoader from "@dashboard/components/SuperBallsLoader/SuperBallsLoader";

// 🖼️ Assets
import { bebasNeue } from "@dashboard/fonts";
import { AiOutlineVideoCameraAdd, AiFillDelete } from "react-icons/ai";
import Image from "next/image";

// 💥 Server actions
import {
  fetchYoutubeSuggestions,
  addYoutubeResource,
  getYoutubeResourcesByType,
  fetchYoutubeResourcesByIds,
} from "../_actions";

// 🪝 Hooks
import { useToast } from "@/ui/components/use-toast";

function createUrlFromId(type: string, id: string) {
  switch (type) {
    case "channel":
      return `https://www.youtube.com/channel/${id}`;
    case "playlist":
      return `https://www.youtube.com/playlist?list=${id}`;
    case "video":
      return `https://www.youtube.com/watch?v=${id}`;
  }
}

function getThumbnailSizes(type: string) {
  switch (type) {
    case "channel":
      return {
        width: 88,
        height: 88,
      };
    case "playlist":
      return {
        width: 125,
        height: 125,
      };
    case "video":
      return {
        width: 125,
        height: 125,
      };
  }
}

export default function Column({
  type,
  title,
  subtitle,
  dialogTitle,
  dialogDescription,
  placeholder,
  tooltipAdd,
  tooltipRemove,
  alertDialogTitleAdd,
  alertDialogActionAdd,
  alertDialogTitleRemove,
  alertDialogActionRemove,
}: {
  type: "channel" | "playlist" | "video";
  title: string;
  subtitle: string;
  dialogTitle: string;
  dialogDescription: string;
  placeholder: string;
  tooltipAdd: string;
  tooltipRemove: string;
  alertDialogTitleAdd: string;
  alertDialogActionAdd: string;
  alertDialogTitleRemove: string;
  alertDialogActionRemove: string;
}) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [suggestions, setSuggestions] = React.useState<any>([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState<boolean>(false);
  const [savedResources, setSavedResources] = React.useState<any>([]);

  const [networkStatus, setNetworkStatus] = React.useState<{
    successMessage: string | null;
    errorMessage: string | null;
  }>({ successMessage: null, errorMessage: null });

  React.useEffect(function loadSavedVideos() {
    (async function () {
      try {
        const savedResources = await getYoutubeResourcesByType(type);
        const savedResourcesIds = savedResources.map((resource: any) => resource.id) as string[];
        const completeSavedResources = await fetchYoutubeResourcesByIds(savedResourcesIds, type);
        console.log("completeSavedResources", completeSavedResources);
        setSavedResources(completeSavedResources);
      } catch (e) {
        return;
      }
    })();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSuggestions(true);
    const resources = await fetchYoutubeSuggestions({
      q: searchTerm,
      relevanceLanguage: "fr",
      type,
    });
    setLoadingSuggestions(false);
    setSuggestions(resources);
  };

  const handleAddYoutubeResource = async ({
    type,
    id,
  }: {
    type: "channel" | "playlist" | "video";
    id: string;
  }) => {
    const status = await addYoutubeResource({ type, id });
    setNetworkStatus(status);
  };

  const handleDeleteYoutubeResource = async ({
    type,
    id,
  }: {
    type: "channel" | "playlist" | "video";
    id: string;
  }) => {
    alert("delete!");
    // const status = await addYoutubeResource({ type, id });
    // setAddingResourceStatus(status);
  };

  const { toast } = useToast();
  React.useEffect(
    function displayToaster() {
      if (networkStatus?.successMessage) {
        setTimeout(() => {
          toast({
            title: "✅ Succès",
            description: networkStatus?.successMessage,
          });
        }, 0);
        setTimeout(() => window.location.reload(), 2000);
      }

      if (networkStatus?.errorMessage) {
        setTimeout(() => {
          toast({
            title: "Une erreur s'est produite",
            description: networkStatus?.errorMessage,
            variant: "destructive",
          });
        }, 0);
      }
    },
    [networkStatus, toast],
  );

  return (
    <div className='space-y-5 self-start rounded-md bg-white px-12 py-6 text-center shadow-md'>
      <div>
        <h3 className={`text-5xl ${bebasNeue.className}`}>{title}</h3>
        <p className='text-zinc-800'>{subtitle}</p>
      </div>
      <ul>
        {savedResources.map((savedResource: any) => (
          <li
            className='flex h-[120px] list-none space-x-3 rounded-lg p-2 text-left transition-colors hover:cursor-pointer hover:bg-gray-100'
            key={savedResource.id?.[`${type}Id`]}
          >
            <Image
              src={savedResource.snippet.thumbnails.default.url}
              alt={savedResource.snippet?.[`${type}Title`]}
              {...getThumbnailSizes(type)}
              className='self-start rounded-md'
            />
            <div className='flex grow flex-col'>
              <h6 className='mb-1 text-lg font-bold leading-tight hover:underline'>
                <a href={createUrlFromId(type, savedResource.id)} target='_blank'>
                  {savedResource.snippet.title}
                </a>
              </h6>
              <p className='overflow-auto text-ellipsis whitespace-break-spaces text-sm text-gray-600'>
                {savedResource.snippet.description}
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <TooltipTrigger asChild>
                      <div className='self-center px-3'>
                        <AiFillDelete className='shrink-0 text-destructive' size={26} />
                      </div>
                    </TooltipTrigger>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='max-w-[700px]'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{alertDialogTitleRemove}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <form
                        action={() =>
                          handleDeleteYoutubeResource({ type, id: savedResource.id?.[`${type}Id`] })
                        }
                      >
                        {/* Force to place variant for button here, see issue here : https://github.com/shadcn-ui/ui/issues/1115 */}
                        <AlertDialogAction asChild variant='destructive'>
                          <Button className='flex gap-2'>
                            <AiFillDelete className='shrink-0' size={16} />
                            {alertDialogActionRemove}
                          </Button>
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <TooltipContent>
                  <p>{tooltipRemove}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </ul>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mx-auto flex items-center gap-2 rounded-md' variant='inverted'>
            <AiOutlineVideoCameraAdd size={17} />
            <span> Ajouter </span>
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-[1000px]'>
          <DialogHeader className='space-y-0'>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <form className='flex w-full items-center space-x-2' onSubmit={handleSearch}>
            <Input
              type='text'
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type='submit'>Rechercher</Button>
          </form>
          {loadingSuggestions ? (
            <SuperBallsLoader className='mx-auto my-12' />
          ) : (
            suggestions.map((suggestion: any) => (
              <div
                className='flex max-h-[120px] space-x-3 rounded-lg p-2 transition-colors hover:cursor-pointer hover:bg-gray-100'
                key={suggestion.id?.[`${type}Id`]}
              >
                <Image
                  src={suggestion.snippet.thumbnails.default.url}
                  alt={suggestion.snippet?.[`${type}Title`]}
                  {...getThumbnailSizes(type)}
                  className='self-start rounded-md'
                />
                <div className='flex grow flex-col'>
                  <h6 className='mb-1 text-lg font-bold leading-tight hover:underline'>
                    <a href={createUrlFromId(type, suggestion.id?.[`${type}Id`])} target='_blank'>
                      {suggestion.snippet.title}
                    </a>
                  </h6>
                  <p className='overflow-auto text-ellipsis whitespace-break-spaces text-sm text-gray-600'>
                    {suggestion.snippet.description}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <TooltipTrigger asChild>
                          <div className='self-center px-3'>
                            <AiOutlineVideoCameraAdd className='shrink-0' size={26} />
                          </div>
                        </TooltipTrigger>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{alertDialogTitleAdd}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <form
                            action={() =>
                              handleAddYoutubeResource({ type, id: suggestion.id?.[`${type}Id`] })
                            }
                          >
                            <AlertDialogAction asChild>
                              <Button type='submit'>{alertDialogActionAdd}</Button>
                            </AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <TooltipContent>
                      <p>{tooltipAdd}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
