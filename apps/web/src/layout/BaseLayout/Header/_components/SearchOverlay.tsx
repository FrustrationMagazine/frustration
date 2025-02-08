"use client";

import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

import { cn } from "@/utils/tailwind";

function SearchOverlay() {
  const [search, setSearch] = React.useState("");
  const [opened, setOpened] = React.useState(false);

  const redirectPageResults = () => {
    window.location.href = `/results?term=${encodeURIComponent(search)}`;
    setSearch("");
  };

  return (
    <>
      <button
        type="button"
        title="Recherche"
        className="w-4 md:w-5 xl:w-6"
        onClick={() => setOpened(true)}
        aria-label="Recherche">
        <FaMagnifyingGlass size="100%" />
      </button>
      <div
        className={cn(
          "absolute left-0 top-0 h-0 w-screen overflow-hidden bg-black transition-all duration-1000",
          opened && "h-screen",
        )}>
        <button
          type="button"
          title="Fermer"
          className={cn(
            "absolute right-5 top-5 opacity-0 transition-opacity duration-1000",
            opened && "opacity-100",
          )}
          onClick={() => setOpened(false)}
          aria-label="Fermer">
          <IoCloseSharp size={72} />
        </button>
        <form
          action={redirectPageResults}
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 opacity-0 transition-opacity duration-1000",
            opened && "opacity-100",
          )}>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            className="color-yellow w-[600px] max-w-[90vw] border-4 border-dashed border-yellow bg-black px-4 py-2 text-3xl font-bold"
          />
          <button
            className="rounded-full bg-yellow px-6 py-2 font-bakbak text-3xl text-black transition-opacity duration-300 disabled:opacity-20"
            type="submit"
            disabled={!search}>
            Rechercher
          </button>
        </form>
      </div>
    </>
  );
}

export default SearchOverlay;
