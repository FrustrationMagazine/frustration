import React, { useState, useRef, useEffect } from "react";
import { createIdAnchor } from "@/utils/strings";
import { cn } from "@libs/tailwind";

function PostSummary() {
  const [titles, setTitles] = useState<string[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  // const MAIN_TITLE = "h1";
  const TITLE_SELECTOR = "h2.wp-block-heading";

  // Intersection observer
  /* ******************** */
  const intersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
  ) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting && summaryRef.current) {
        const titleTarget = entry.target;
        const titleSummaryTargeted = summaryRef.current.querySelector(
          `[data-title="${titleTarget.id}"]`,
        );

        if (titleSummaryTargeted) {
          // Remove bold from all titles
          const allTitlesSummary = summaryRef.current.querySelectorAll("li a");
          allTitlesSummary.forEach((titleSummary) =>
            titleSummary.classList.remove("underline"),
          );
          // Add bold to the targeted title
          titleSummaryTargeted.classList.add("underline");
        }
      }
    });
  };

  // Place observer
  /* ******************** */
  useEffect(() => {
    // 1️⃣ We collect all titles from current post and set a unique id for each
    const titlesNodes = Array.from(document.querySelectorAll(TITLE_SELECTOR));

    (titlesNodes as HTMLElement[]).forEach(
      (title: HTMLElement, index: number) => {
        const titleId = createIdAnchor(title.textContent as string);
        title.id = titleId;
        if (`#${titleId}` === window.location.hash) title.scrollIntoView();
      },
    );

    // 2️⃣ We create an intersection observer for each title
    const observer = new IntersectionObserver(intersectionObserverCallback, {
      rootMargin: "-20px",
      threshold: 1,
    });
    titlesNodes.forEach((title) => observer.observe(title));

    const titles = titlesNodes.map((node) => node.textContent) as string[];
    setTitles(titles);
  }, []);

  /* ❌ Early return if no titles */
  if (titles.length === 0) return null;

  return (
    <div ref={summaryRef}>
      <h3
        onClick={() => window.scrollTo({ top: 0 })}
        className={cn(
          "mb-4 w-fit cursor-pointer border-b-[6px] border-b-yellow font-bakbak",
          "text-2xl",
          "lg:text-3xl",
        )}>
        Sommaire
      </h3>
      <ul className="space-y-1">
        {titles.map((title) => {
          const titleId = createIdAnchor(title);
          return (
            <li
              key={titleId}
              className={cn("overflow-hidden text-ellipsis whitespace-nowrap")}>
              <a
                title={title}
                data-title={titleId}
                href={`#${titleId}`}>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostSummary;
