"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { Button } from "@/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import Image from "next/image";

// 💥 Actions
import { fetchYoutubeResults } from "../_actions";

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
  tooltip,
  alertDialogTitle,
  alertDialogAction,
}: {
  type: string;
  title: string;
  subtitle: string;
  dialogTitle: string;
  dialogDescription: string;
  placeholder: string;
  tooltip: string;
  alertDialogTitle: string;
  alertDialogAction: string;
}) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const [suggestions, setSuggestions] = React.useState<any>([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSuggestions(true);
    const resources = await fetchYoutubeResults({
      q: searchTerm,
      relevanceLanguage: "fr",
      type,
    });
    setLoadingSuggestions(false);
    setSuggestions(resources);
  };

  return (
    <div className='space-y-5 self-start rounded-md bg-white px-12 py-6 text-center shadow-md'>
      <div>
        <h3 className={`text-5xl ${bebasNeue.className}`}>{title}</h3>
        <p className='text-zinc-800'>{subtitle}</p>
      </div>
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
                className='flex h-[120px] space-x-3 rounded-lg p-2 transition-colors hover:cursor-pointer hover:bg-gray-100'
                key={suggestion.id?.[`${type}Id`]}
              >
                <Image
                  src={suggestion.snippet.thumbnails.default.url}
                  alt={suggestion.snippet?.[`${type}Title`]}
                  {...getThumbnailSizes(type)}
                  className='rounded-md'
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='self-center px-3'>
                            <AiOutlineVideoCameraAdd className='shrink-0' size={26} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button type='submit'>{alertDialogAction}</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
