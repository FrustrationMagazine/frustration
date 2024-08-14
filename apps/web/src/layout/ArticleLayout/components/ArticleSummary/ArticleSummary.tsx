import React from "react";

/********************************************
 *               CONSTANTS
 *********************************************/

const ARTICLE_TITLE_SELECTOR = "h1";
const TITLE_SELECTOR = `:is(${ARTICLE_TITLE_SELECTOR}, h2.wp-block-heading)`;
const ARTICLE_SUMMARY = ".article-summary";
const ARTICLE_SELECTOR = "article.post";
const BANNER_SELECTOR = "#banner";
const HEADER_SELECTOR = "header";
const SUMMARY_OFFSET = 35;

/********************************************
 *               FUNCTIONS
 *********************************************/

const intersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: any) => {
    if (entry.isIntersecting) {
      const titleNode = entry.target;
      const titleId = titleNode.getAttribute("data-title");
      const allTitleNodesSummary = document.querySelectorAll(`.article-summary li`);
      const titleNodeSummary = document.querySelector(`.article-summary li[data-title="${titleId}"]`);
      if (titleNodeSummary) {
        allTitleNodesSummary.forEach((node) => {
          node.classList.remove("font-bold");
          const icon = node.querySelector("svg");
          if (icon) {
            icon.classList.remove("block");
            icon.classList.add("hidden");
          }
        });
        titleNodeSummary.classList.add("font-bold");
        const icon = titleNodeSummary.querySelector("svg");
        if (icon) {
          icon.classList.remove("hidden");
          icon.classList.add("block");
        }
      }
    }
  });
};

const intersectionObserverOptions = {
  rootMargin: "-100px",
  threshold: 1,
};

const setDataTitleAttributeAndId = (node: HTMLElement, index: number) => {
  node.id = `title-${index}`;
  node.setAttribute("data-title", `title-${index}`);
};

const retrieveTitlesNodesAndSetAttributes = () => {
  const titlesNodes = Array.from(document.querySelectorAll(TITLE_SELECTOR)) as HTMLElement[];
  titlesNodes.forEach(setDataTitleAttributeAndId);
  return titlesNodes;
};

/********************************************
 *               SUBCOMPONENT
 *********************************************/

const ArticleSummaryLink = (title: string, index: number) => {
  const titleId = `title-${index}`;
  return (
    <li
      data-title={titleId}
      key={index}
      className="flex cursor-pointer items-center gap-1.5"
      onClick={() => {
        const titleInArticle = document.getElementById(titleId);
        console.log("titleInArticle", titleInArticle);
        if (titleInArticle) {
          titleInArticle.scrollIntoView();
          // titleInArticle.scrollIntoViewIfNeeded({ opt_center: false });
        }
      }}>
      <span className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>
    </li>
  );
};

/********************************************
 *               COMPONENT
 *********************************************/

function ArticleSummary() {
  const [titles, setTitles] = React.useState<string[]>([]);

  React.useEffect(function observeTitlesNodes() {
    const titlesNodes = retrieveTitlesNodesAndSetAttributes();
    const observer = new IntersectionObserver(intersectionObserverCallback, intersectionObserverOptions);
    titlesNodes.forEach((node) => observer.observe(node));

    const titles = titlesNodes.map((node) => node.textContent) as string[];
    titles.splice(0, 1, "Intro");
    setTitles(titles);
  }, []);

  /********************************************
   *                   UI
   *********************************************/
  if (titles.length === 0) return null;

  return (
    <div className="article-summary border-box px-12">
      <h3 className="mb-3 flex w-fit items-center gap-2 border-b-[6px] border-b-yellow font-bebas text-3xl">Sommaire</h3>
      <ul className="flex flex-col gap-1.5">{titles.map(ArticleSummaryLink)}</ul>
    </div>
  );
}

export default ArticleSummary;
