"use client";

import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

import { cn } from "@libs/tailwind";

function SearchOverlay() {
  const [search, setSearch] = React.useState("");
  const [opened, setOpened] = React.useState(false);

  const redirectPageResults = () => {
    window.location.href = `/posts?term=${encodeURIComponent(search)}`;
    setSearch("");
  };

  const OpenButton = (
    <button
      type="button"
      title="Recherche"
      className={cn("w-4", "md:w-5", "xl:w-6")}
      onClick={() => setOpened(true)}
      aria-label="Recherche">
      <FaMagnifyingGlass size="100%" />
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

  const SearchInput = (
    <input
      type="text"
      onChange={(e) => setSearch(e.target.value)}
      className={cn(
        "color-yellow w-[600px] max-w-[90vw] border-4 border-dashed border-yellow bg-black px-4 py-2 font-bold",
        "text-xl",
        "md:text-2xl",
        "xl:text-3xl",
      )}
    />
  );

  const SearchButton = (
    <button
      className={cn(
        "rounded-full bg-yellow font-bakbak text-black transition-opacity duration-300 disabled:opacity-20",
        "px-4 py-1.5 text-xl",
        "md:px-6 md:py-2 md:text-2xl",
        "xl:px-6 xl:py-2 xl:text-3xl",
      )}
      type="submit"
      disabled={!search}>
      Rechercher
    </button>
  );

  return (
    <>
      {OpenButton}
      <div
        className={cn(
          "absolute left-0 top-0 h-0 w-screen overflow-hidden bg-black transition-all duration-1000",
          opened && "h-screen",
        )}>
        {CloseButton}
        <form
          action={redirectPageResults}
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 opacity-0 transition-opacity duration-1000",
            opened && "opacity-100",
          )}>
          {SearchInput}
          {SearchButton}
        </form>
      </div>
    </>
  );
}

export default SearchOverlay;
