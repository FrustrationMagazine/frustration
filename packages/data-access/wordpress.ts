// 🔧 Libs
import { convertDifferenceOfDays, getNumberOfDaysFromNow } from "../utils/dates";

interface WPGraphqlParams {
  query: string;
  variables?: object;
}

// =======================================
// WPQUERY
// =======================================

// TYPES =================================

type WPSearchOptions = {
  slug?: string;
  first?: number;
};

// QUERY WRAPPER =========================

export async function wpquery({ query, variables = {} }: WPGraphqlParams) {
  const ENDPOINT = process.env.WP_URL as string;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    console.error(res);
    return {};
  }

  const data = await res.json();
  return data;
}

// =======================================
// FETCH ARTICLE
// =======================================

// TYPES =================================

type ArticleTitleRaw = string;
type ArticleSlugRaw = string;
type ArticleAuthorRaw = {
  node: {
    firstName: string;
    lastName: string;
  };
};
type ArticleDateRaw = string;
type ArticleCategoryRaw = {
  name: string;
  parent: {
    node: {
      name: string;
    };
  };
};
type ArticleCategoriesRaw = {
  nodes: ArticleCategoryRaw[];
};
type ArticleFeaturedImageRaw = {
  node: {
    title: string;
    altText: string;
    sourceUrl: string;
  };
};
type ArticleContentRaw = string;
type ArticleExcerptRaw = string;

export type ArticleRaw = {
  title?: ArticleTitleRaw;
  slug?: ArticleSlugRaw;
  author?: ArticleAuthorRaw;
  date?: ArticleDateRaw;
  categories?: ArticleCategoriesRaw;
  featuredImage?: ArticleFeaturedImageRaw;
  content?: ArticleContentRaw;
  excerpt?: ArticleExcerptRaw;
};
type ArticleQueryField = "title" | "slug" | "author" | "date" | "categories" | "image" | "content" | "excerpt";

// QUERIES =================================

const createFetchArticleQuery = (wpSearchOptions: WPSearchOptions, fields: ArticleQueryField[]): string => {
  const titleIfWanted = fields.includes("title") ? "title(format: RENDERED)" : "";
  const slugIfWanted = fields.includes("slug") ? "slug" : "";
  const authorIfWanted = fields.includes("author") ? `author { node { firstName lastName } }` : "";
  const dateIfWanted = fields.includes("date") ? "date" : "";
  const categoriesIfWanted = fields.includes("categories") ? `categories { nodes { name parent { node { name } } } }` : "";
  const imageIfWanted = fields.includes("image") ? `featuredImage { node { title(format: RENDERED) altText sourceUrl } }` : "";
  const contentIfWanted = fields.includes("content") ? "content(format: RENDERED)" : "";
  const excerptIfWanted = fields.includes("excerpt") ? "excerpt(format: RENDERED)" : "";

  let filterOptionsArray: string[] = [];
  Object.entries(wpSearchOptions).forEach(([key, value]: [string, string | number]) => {
    switch (key) {
      case "slug":
        filterOptionsArray.push(`id: "${value}", idType: SLUG`);
        break;
      case "first":
        filterOptionsArray.push(`first: ${value}`);
        break;
    }
  });
  let filterOptions: string = filterOptionsArray.join(", ");
  const postsOrPost = wpSearchOptions.first ? "posts" : "post";

  return `query fetchArticle {
  ${postsOrPost}(${filterOptions}) {
    ${postsOrPost === "posts" ? "nodes {" : ""}
    ${titleIfWanted}
    ${slugIfWanted}
    ${authorIfWanted}
    ${dateIfWanted}
    ${categoriesIfWanted}
    ${imageIfWanted}
    ${contentIfWanted}
    ${excerptIfWanted}
    ${postsOrPost === "posts" ? "}" : ""}
  }
}
  `;
};

export const fetchArticle = async (
  wpSearchOptions: WPSearchOptions,
  fields: ArticleQueryField[] = ["title", "author", "date", "categories", "image", "content"]
): Promise<ArticleRaw | ArticleRaw[]> => {
  const query = createFetchArticleQuery(wpSearchOptions, fields);
  const { data: nestedData } = await wpquery({ query });
  const postsOrPost = wpSearchOptions.first ? "posts" : "post";
  const data = postsOrPost === "posts" ? nestedData[postsOrPost].nodes : nestedData[postsOrPost];
  return data;
};

// FORMATTERS =================================

const UNKNOWN_TITLE = "Article sans titre";
const UNKNOWN_AUTHOR = "Invité.e";
const DEFAULT_ARTICLE_IMAGE_METADATA_PATH = "DEFAULT_ARTICLE_IMAGE";
const DEFAULT_ARTICLE_IMAGE_METADATA = { title: "Image de couverture de l'article", altText: "Image de couverture par défaut de l'article", sourceUrl: DEFAULT_ARTICLE_IMAGE_METADATA_PATH };

export const formatSlugFromRawArticleData = (article: ArticleRaw): string => article.slug || "";
export const formatTitleFromRawArticleData = (article: ArticleRaw): string => article.title || UNKNOWN_TITLE;

export const formatAuthorFromRawArticleData = (article: ArticleRaw) => {
  if (article?.author?.node?.firstName || article?.author?.node?.lastName) {
    return `${article.author.node.firstName ?? ""} ${article.author.node.lastName ?? ""}`;
  }
  return UNKNOWN_AUTHOR;
};

export const formatImageFromRawArticleData = (article: ArticleRaw): { title: string; altText: string; sourceUrl: string } => {
  if (article.featuredImage?.node) {
    return article.featuredImage.node;
  }

  return DEFAULT_ARTICLE_IMAGE_METADATA;
};

export const formatDateFromRawArticleData = (article: ArticleRaw, options: { explicit: boolean } = { explicit: false }): Date | string => {
  if (article.date) {
    const intlOptions: Intl.DateTimeFormatOptions | undefined = options.explicit ? { weekday: "long", year: "numeric", month: "long", day: "numeric" } : undefined;
    let date = new Date(article.date).toLocaleDateString("fr-FR", intlOptions);
    date = date.charAt(0).toUpperCase() + date.slice(1);
    return date;
  }

  return "";
};

export const formatCategoriesFromRawArticleData = (article: ArticleRaw): string[] => {
  if (article.categories) {
    article.categories.nodes.map((category: ArticleCategoryRaw) => (category.parent ? category.parent.node.name : category.name));
  }
  return [];
};

export const formatContentFromRawArticleData = (article: ArticleRaw): string => {
  if (article.content) {
    return article.content;
  }

  return "";
};

export const formatExcerptFromRawArticleData = (article: ArticleRaw): string => {
  if (article.excerpt) {
    return article.excerpt;
  }

  return "";
};

// ===================================================================================================

async function fetchAPI(query: string) {
  try {
    const res = await fetch(process.env.WP_URL ?? "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    if (json.errors) {
      throw new Error("Failed to fetch wordpress API");
    }
    return json;
  } catch (e) {
    console.error(e);
  }
}

export async function getLastPosts() {
  let {
    data: { posts }
  } = await fetchAPI(`
   query getLastPosts {
        posts(first: 6) {
          nodes {
            title(format: RENDERED)
            slug
            excerpt(format: RENDERED)
            featuredImage {
              node {
                title(format: RENDERED)
                altText
                sourceUrl
              }
            }
          }
        }
    }
  `);

  posts = posts.nodes.map(({ title, slug, excerpt, featuredImage: { node: image } }) => ({
    title,
    slug,
    excerpt,
    image
  }));

  return posts;
}

export async function getSlugs() {
  let {
    data: { posts }
  } = await fetchAPI(`
  query getSlugs {
  posts {
    nodes {
      slug
      id
    }
  }
}`);

  const slugs = posts.nodes;
  return slugs;
}

export async function getLastArticles() {
  let {
    data: { posts }
  } = await fetchAPI(`
   query getLastArticles {
        posts(first: 6, where: {categoryNotIn: "2370"}) {
          nodes {
            title(format: RENDERED)
            slug
            excerpt(format: RENDERED)
            featuredImage {
              node {
                title(format: RENDERED)
                altText
                sourceUrl
              }
            }
            date
            categories {
              nodes {
                name
                parent {
                  node {
                    name
                  }
                }
              }
            }
            author {
              node {
                lastName
                firstName
              }
            }
          }
        }
    }
  `);

  posts = posts.nodes.map(({ title, slug, excerpt, featuredImage: { node: image }, date, categories: { nodes: categories }, author: { node: author } }) => ({
    title,
    author: `${author.firstName ?? ""} ${author.lastName ?? ""}`,
    slug,
    excerpt,
    image,
    date: convertDifferenceOfDays(getNumberOfDaysFromNow(new Date(date))),
    categories: categories.map((category) => (category.parent ? category.parent.node.name : category.name))
  }));

  return posts;
}

export async function getInterviews() {
  const {
    data: { posts }
  } = await fetchAPI(`
   query getInterviews {
        posts(where: {categoryName: "Entretiens"}, first: 6) {
          nodes {
            title(format: RENDERED)
            link
            slug
            featuredImage {
              node {
                title
                altText
                sourceUrl
              }
            }
          }
        }
    }
  `);

  const interviews = posts.nodes.map(({ title, link, slug, featuredImage: { node: image } }) => ({
    title,
    link,
    slug,
    image
  }));

  return interviews;
}
