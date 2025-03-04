import React, { useEffect, useState } from "react";
// 🐝 Wordpress API
import { fetchLinkPreview } from "@libs/wordpress";
import { cn } from "@libs/tailwind";
import LogoSquare from "../../assets/logo_square.png";

const EMBED_INTERNAL_LINK_SELECTOR =
  "figure.wp-block-embed:not(.is-type-video):has(.wp-block-embed__wrapper)";
const scanEmbedArticles = () => {
  let nodes = document.querySelectorAll(EMBED_INTERNAL_LINK_SELECTOR);
  return nodes;
};
const SEPARATORS_SELECTOR = ".wp-block-separator";
const scanSeparators = () => document.querySelectorAll(SEPARATORS_SELECTOR);
const mapToLinks = (embedArticles: any) =>
  Array.from(embedArticles)
    .map((node: any) => {
      const REGEX_HTTPS = /^https?:\/\/frustrationmagazine.fr/;
      const potentialLink = node?.textContent.trim();
      if (!potentialLink || !REGEX_HTTPS.test(potentialLink)) return null;
      return potentialLink.replace(REGEX_HTTPS, "");
    })
    .filter((link) => typeof link === "string");

/* ================== */
/* |||||||||||||||||| */
/* ================== */

function MoreArticles() {
  const [linkPreviews, setLinkPreviews] = useState<any>([]);

  useEffect(() => {
    const embedArticles = scanEmbedArticles();
    const links = mapToLinks(embedArticles);

    // Fetch articles
    const linksPreviewPromises = links.map(fetchLinkPreview);
    Promise.all(linksPreviewPromises).then((values) => {
      setLinkPreviews(values);
      const separators = scanSeparators();
      embedArticles.forEach((node) => node.remove());
      separators.forEach((node) => node.remove());
    });
  }, []);

  if (linkPreviews.length === 0) return null;

  return (
    <div>
      <h3
        className="mb-6 font-bakbak text-4xl underline decoration-[#FCCF00] decoration-[10px] underline-offset-[-5px]"
        style={{ textDecorationSkipInk: "none" }}>
        Plus d'articles
      </h3>
      <ul className="space-y-4">
        {linkPreviews.map((linkPreview: any) => (
          <li key={linkPreview.slug}>
            <a
              href={`/${linkPreview.slug}`}
              className={cn(
                "flex rounded-md border shadow-md",
                "flex-col items-center gap-4 p-4",
                "sm:flex-row sm:items-start sm:gap-6 sm:p-6",
              )}>
              <img
                src={LogoSquare.src}
                alt="Logo Square"
                className={cn("h-12 w-12")}
              />
              <div>
                <h5
                  className={cn(
                    "font-bakbak font-bold !leading-none",
                    "mb-2 text-xl",
                    "sm:mb-2 sm:text-2xl",
                  )}>
                  {linkPreview.title}
                </h5>
                <div
                  className={cn("text-sm", "xs:text-base")}
                  dangerouslySetInnerHTML={{ __html: linkPreview.excerpt }}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoreArticles;
