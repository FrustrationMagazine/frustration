"use client";
import React from "react";
import { formatSearchPosts } from "@/data-access/wordpress";
import { Image } from "astro:assets";

// 🐝 Wordpress API
import {
  // Format functions
  formatImage,
} from "@/data-access/wordpress";

type Props = {
  term: string;
  results: any;
  pageInfo: any;
};

const { PUBLIC_WP_URL } = import.meta.env;

function Results({ term, results, pageInfo }: Props) {
  const [allResults, setAllResults] = React.useState(results);
  const [currentPageInfo, setCurrentPageInfo] = React.useState(pageInfo);

  const handleMoreArticles = async () => {
    const query = `
     query searchArticles {
      posts(
        first: 6
        ${currentPageInfo?.endCursor ? `after: "${currentPageInfo.endCursor}"` : ""}
        where: { search: "${term}", orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          title(format: RENDERED)
          slug
          date
          categories {
            nodes {
              name
              id
              parent {
                node {
                  name
                }
              }
            }
          }
          featuredImage {
            node {
              title(format: RENDERED)
              altText
              sourceUrl
            }
          }
          excerpt(format: RENDERED)
          author {
            node {
              name
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `;

    try {
      const res = await fetch(PUBLIC_WP_URL ?? "", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error("Failed to fetch wordpress API");
      }

      if (json.data) {
        const newPosts = formatSearchPosts(json.data.posts);
        setAllResults([...allResults, ...newPosts.posts]);
        setCurrentPageInfo(newPosts.pageInfo);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10">
      {allResults.map(
        ({ title, author, slug, excerpt, image, date, categories }) => (
          <div key={slug}>
            <h2
              className="decoration-skip-ink-none mb-1 font-bakbak text-4xl font-bold leading-[1] underline decoration-[#FFF200] decoration-[25px] underline-offset-[-25px]"
              style={{ textDecorationSkipInk: "none" }}>
              <a href={`/${slug}`}>{title}</a>
            </h2>
            <div className="flex gap-2">
              <span>Écrit par {author}</span>
              <span>•</span>
              <span>Il y a {date}</span>
            </div>
            {/* <ul className="flex gap-4">
              {categories.map(({ category, id }: any) => (
                <li key={id}>{category}</li>
              ))}
            </ul> */}
            <Image
              class="h-full w-full object-cover"
              title={formatImage(image).title}
              src={formatImage(image).sourceUrl}
              alt={formatImage(image).altText}
              width="500"
              height="300"
            />
            <p
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: excerpt }}></p>
          </div>
        ),
      )}
      <button
        onClick={handleMoreArticles}
        type="button">
        Plus d'articles
      </button>
    </div>
  );
}

export default Results;
