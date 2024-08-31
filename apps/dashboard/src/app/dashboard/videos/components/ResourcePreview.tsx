"use client";

// 🔩 Base
import React from "react";

// 🔧 Libs
import { createYoutubeUrlFromIdAndType } from "@/data-access/youtube";

// 🧱 Components
import { Button } from "@/ui/components/button";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/components/tooltip";

// 🗿 Models
import { type YoutubeResourceType } from "@/data-access/youtube";

// 🖼️ Images
import Image from "next/image";
import { IconType } from "react-icons/lib";

function getThumbnailSizes(type: string) {
  switch (type) {
    case "channel":
      return {
        width: 66,
        height: 66,
      };
    case "playlist":
      return {
        width: 80,
        height: 80,
      };
    case "video":
      return {
        width: 80,
        height: 80,
      };

    default:
      return {
        width: 80,
        height: 80,
      };
  }
}

export default function ({
  id,
  thumbnailUrl,
  type,
  title,
  description,

  Icon,
  iconAction,
  actionType,

  texts,
}: {
  id: string;
  thumbnailUrl: string;
  type: YoutubeResourceType;
  title: string;
  description: string;

  Icon: IconType;
  iconAction: any;
  actionType: string;

  texts: any;
}) {
  // prettier-ignore
  const iconType = actionType === 'add' ? "default" :
                   actionType === 'remove' ? "destructive" :
                   "primary"
  return (
    <li
      className={`box-content flex list-none space-x-3 rounded-lg p-2 text-left transition-colors hover:cursor-pointer hover:bg-gray-100`}
      key={id}
      style={{ height: `${getThumbnailSizes(type).height}px` }}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        {...getThumbnailSizes(type)}
        className='h-full w-auto flex-shrink-0 self-start rounded-md'
      />
      <div className='flex grow flex-col'>
        <h6 className='text-md mb-1 font-bold leading-tight hover:underline'>
          <a href={createYoutubeUrlFromIdAndType(type, id)} target='_blank'>
            {title}
          </a>
        </h6>
        <p
          className='overflow-auto whitespace-break-spaces text-sm text-gray-600'
          style={{ overflowWrap: "anywhere" }}
        >
          {description}
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <TooltipTrigger asChild>
                <div className='shrink-0 self-center px-3'>
                  <Icon className={`text-${iconType}`} size={26} />
                </div>
              </TooltipTrigger>
            </AlertDialogTrigger>
            <AlertDialogContent className='max-w-[700px]'>
              <AlertDialogHeader>
                <AlertDialogTitle>{texts?.[actionType]?.alertDialogTitle}</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <form action={() => iconAction({ type, id })}>
                  {/* Force to place variant for button here, see issue here : https://github.com/shadcn-ui/ui/issues/1115 */}
                  <AlertDialogAction asChild variant={iconType as any}>
                    <Button type='submit' className='flex gap-2'>
                      <Icon className='shrink-0' size={16} />
                      {texts?.[actionType].alertDialogAction}
                    </Button>
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TooltipContent>
            <p>{texts?.[actionType]?.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
