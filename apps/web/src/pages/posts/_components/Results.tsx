import React from "react";
import { Image } from "astro:assets";
import H3 from "@components/H2";
import { cn } from "@libs/tailwind";
import { Button } from "@/ui/components/button";
import { CgArrowTopRight } from "react-icons/cg";

// 🐝 Wordpress API
import {
  // Format functions
  formatImage,
} from "@/data-access/wordpress";

type Props = {
  term: string;
  category: string;
  initialPosts: any;
  initialPageInfo: any;
};

const { PUBLIC_WP_URL } = import.meta.env;

function Results({ term, category, initialPosts, initialPageInfo }: Props) {
  const [posts, setPosts] = React.useState(initialPosts);
  const [loadingPosts, setLoadingPosts] = React.useState(false);
  const [pageInfo, setPageInfo] = React.useState(initialPageInfo);

  if (!posts || !pageInfo) return null;
  if (posts.length === 0)
    return (
      <p className="flex justify-center gap-2 text-center text-xl">
        <span>🕵️‍♂️</span>
        <span>Aucun article ne correspond à votre recherche...</span>
      </p>
    );

  const handleMoreArticles = async () => {
    setLoadingPosts(true);
    const query = `
     query searchPosts {
      posts(
        first: 6
        ${pageInfo?.endCursor ? `after: "${pageInfo.endCursor}"` : ""}
        where: { search: "${term}", ${category ? `categoryName: "${category}",` : ""} orderby: { field: DATE, order: DESC } }
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
      const res = await fetch(
        PUBLIC_WP_URL ?? "https://adminfrustrationmagazine.fr/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        },
      );
      const json = await res.json();
      if (json.errors) {
        throw new Error("Failed to fetch wordpress API");
      }

      if (json.data) {
        const data = json.data.posts;
        setPosts([...posts, ...data.nodes]);
        setPageInfo(data.pageInfo);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {posts.map(({ title, excerpt, slug }) => (
        <a
          href={`/${slug}`}
          key={slug}
          className="space-y-3">
          <h3
            className={cn(
              "font-bakbak font-bold !leading-[1]",
              "text-2xl",
              "md:text-3xl",
            )}>
            {title}
          </h3>
          {/* <div className="flex gap-2">
              <span>Écrit par {author}</span>
              <span>•</span>
              <span>Il y a {date}</span>
            </div> */}
          {/* <ul className="flex gap-4">
              {categories.map(({ category, id }: any) => (
                <li key={id}>{category}</li>
              ))}
            </ul> */}
          {/* <Image
              class="h-full w-full object-cover"
              title={formatImage(image).title}
              src={formatImage(image).sourceUrl}
              alt={formatImage(image).altText}
              width="500"
              height="300"
            /> */}
          <p
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: excerpt }}></p>
          <Button className="flex items-center gap-1 rounded-none font-bakbak text-lg uppercase">
            <span>Lire</span>
            <CgArrowTopRight size={20} />
          </Button>
        </a>
      ))}
      <Button
        className="mt-12 bg-black p-6 font-bebas text-2xl text-yellow hover:bg-black hover:text-yellow"
        onClick={handleMoreArticles}
        type="button">
        {loadingPosts ? "Chargement..." : "Voir plus d'articles"}
      </Button>
    </div>
  );
}

export default Results;
