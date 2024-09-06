// 🔩 Base
import React from "react";

// 🔧 Libs
import { cn } from "@/utils/tailwind";
import { createIdAnchor } from "@/utils/strings";

function ArticleSummary({ className }: { className?: string }) {
  const [titles, setTitles] = React.useState<string[]>([]);
  const summaryRef = React.useRef<HTMLDivElement>(null);

  const MAIN_TITLE = "h1";
  const TITLE_SELECTOR = `:is(${MAIN_TITLE}, h2.wp-block-heading)`;

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
            titleSummary.classList.remove("font-bold"),
          );
          // Add bold to the targeted title
          titleSummaryTargeted.classList.add("font-bold");
        }
      }
    });
  };

  // Place observer
  /* ******************** */
  React.useEffect(function observeTitlesNodes() {
    // 1️⃣ We collect all titles from current post and set a unique id for each
    const titlesNodes = Array.from(
      document.querySelectorAll(TITLE_SELECTOR),
    ) as HTMLElement[];

    titlesNodes.forEach((title: HTMLElement, index: number) => {
      const titleId = createIdAnchor(title.textContent as string);
      title.id = titleId;
      if (`#${titleId}` === window.location.hash) title.scrollIntoView();
    });

    // 2️⃣ We create an intersection observer for each title
    const observer = new IntersectionObserver(intersectionObserverCallback, {
      rootMargin: "-100px",
      threshold: 1,
    });
    titlesNodes.forEach((title) => observer.observe(title));

    const titles = titlesNodes.map((node) => node.textContent) as string[];
    setTitles(titles);
  }, []);

  /* ❌ Early return if no titles */
  if (titles.length === 0) return null;

  return (
    <div
      className={cn(className, "border-box")}
      ref={summaryRef}>
      <h3 className="mb-3 flex w-fit items-center gap-2 border-b-[6px] border-b-yellow font-bebas text-2xl lg:text-3xl">
        Sommaire
      </h3>
      <ul className="space-y-1">
        {titles.map((title, index) => {
          const titleId = createIdAnchor(title);
          const formattedTitle = index === 0 ? "Intro" : title;
          return (
            <li
              key={titleId}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-sm md:text-base">
              <a
                title={formattedTitle}
                data-title={titleId}
                href={`#${titleId}`}>
                {formattedTitle}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ArticleSummary;
