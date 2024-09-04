// 🔩 Base
import React from "react";

const MAIN_TITLE = "h1";
const TITLE_SELECTOR = `:is(${MAIN_TITLE}, h2.wp-block-heading)`;
const SUMMARY_LINK = ".article-summary li a";

function generateTitleId(title: string) {
  return title
    .normalize("NFD") // Normalize the string to decompose combined letters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/********************************************
 *               FUNCTIONS
 *********************************************/

const intersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: any) => {
    if (entry.isIntersecting) {
      const titleTarget = entry.target;
      const titleSummaryTargeted = document.querySelector(
        `${SUMMARY_LINK}[data-title="${titleTarget.id}"]`,
      );

      if (titleSummaryTargeted) {
        // Remove bold from all titles
        const allTitlesSummary = document.querySelectorAll(SUMMARY_LINK);
        allTitlesSummary.forEach((titleSummary) =>
          titleSummary.classList.remove("font-bold"),
        );
        // Add bold to the targeted title
        titleSummaryTargeted.classList.add("font-bold");
      }
    }
  });
};

/********************************************
 *               COMPONENT
 *********************************************/

function ArticleSummary() {
  const [titles, setTitles] = React.useState<string[]>([]);

  React.useEffect(function observeTitlesNodes() {
    // 1️⃣ We collect all titles from current post and set a unique id for each
    const titlesNodes = Array.from(
      document.querySelectorAll(TITLE_SELECTOR),
    ) as HTMLElement[];

    titlesNodes.forEach((title: HTMLElement, index: number) => {
      const titleId = generateTitleId(title.textContent as string);
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
    <div className="article-summary border-box px-12">
      <h3 className="mb-3 flex w-fit items-center gap-2 border-b-[6px] border-b-yellow font-bebas text-3xl">
        Sommaire
      </h3>
      <ul className="space-y-1">
        {titles.map((title, index) => {
          const titleId = generateTitleId(title);
          const formattedTitle = index === 0 ? "Intro" : title;
          return (
            <li
              key={titleId}
              className="overflow-hidden text-ellipsis whitespace-nowrap">
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
