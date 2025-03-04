"use client";

import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";

import { cn } from "@libs/tailwind";

const CATEGORIES_TO_FILTER_OUT = [
  "chronique-de-nos-coeurs-mouvementes",
  "socialcast",
];

type Props = {
  readonly categories: any[];
};

function CategoriesOverlay({ categories }: Props) {
  const [opened, setOpened] = React.useState(false);
  const standaloneCategories = categories.filter(
    (category) => !category.parent && category.children.nodes.length === 0,
  );

  const categoriesWithChildren = categories.filter(
    (category) => category.children.nodes.length > 0,
  );

  const OpenButton = (
    <button
      type="button"
      title="Recherche"
      className={cn("w-4", "md:w-5", "xl:w-6")}
      onClick={() => setOpened(true)}
      aria-label="Recherche">
      <HiOutlineMenuAlt3 size="100%" />
    </button>
  );

  const CloseButton = (
    <button
      type="button"
      title="Fermer"
      className={cn(
        "absolute right-5 top-5 opacity-0 transition-opacity duration-1000",
        opened && "opacity-100",
      )}
      onClick={() => setOpened(false)}
      aria-label="Fermer">
      <IoCloseSharp size="clamp(40px, 5vw, 72px)" />
    </button>
  );

  const MailButton = (
    <a
      href="/chere-frustration"
      type="button"
      title="Nous contacter"
      className={cn(
        "fixed bottom-5 right-5 rounded-full bg-yellow p-2 text-black opacity-0 transition-opacity duration-1000",
        opened && "opacity-100",
      )}
      aria-label="Nous contacter">
      <IoIosMail size="clamp(30px, 2vw, 72px)" />
    </a>
  );

  return (
    <>
      {OpenButton}
      <div
        className={cn(
          "absolute left-0 top-0 grid h-0 w-screen items-center overflow-hidden bg-black transition-all duration-1000",
          opened && "h-screen",
        )}>
        {CloseButton}
        {MailButton}
        <ul
          className={cn(
            "flex h-full flex-col overflow-y-scroll py-[15dvh] text-center font-bakbak uppercase scrollbar scrollbar-track-yellow scrollbar-thumb-yellow",
            "gap-2 text-xl",
            "sm:gap-3 sm:text-2xl",
            "md:gap-3 md:text-3xl",
          )}>
          {categoriesWithChildren.map((category) => (
            <details key={category.slug}>
              <summary className="mb-2 cursor-pointer">{category.name}</summary>
              <ul className="mx-auto flex flex-col gap-1">
                {category.children.nodes.map((categoryChildren: any) => (
                  <a
                    style={{ fontSize: ".8em" }}
                    key={categoryChildren.slug}
                    href={`/posts?category=${categoryChildren.slug}`}>
                    {categoryChildren.name.replace(/^[^-]*-\s/, "")}
                  </a>
                ))}
              </ul>
            </details>
          ))}
          {standaloneCategories
            .filter(
              (category) => !CATEGORIES_TO_FILTER_OUT.includes(category.slug),
            )
            .toSorted((a, b) => b.count - a.count)
            .map((category) => (
              <a
                className="mb-1"
                href={`/posts?category=${category.slug}`}
                key={category.slug}>
                {category.name}
              </a>
            ))}
        </ul>
      </div>
    </>
  );
}

export default CategoriesOverlay;
