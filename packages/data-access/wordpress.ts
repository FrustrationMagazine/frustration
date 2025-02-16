// 🔧 Libs
import { convertDifferenceOfDays, getNumberOfDaysFromNow } from "@/utils/dates";

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

type ArticleAuthorRaw = {
  node: {
    firstName: string;
    lastName: string;
  };
};
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

export type Post = {
  title?: string;
  slug?: string;
  author?: ArticleAuthorRaw;
  date?: string;
  categories?: ArticleCategoriesRaw;
  featuredImage?: ArticleFeaturedImageRaw;
  content?: string;
  excerpt?: string;
};
type ArticleQueryField = "title" | "slug" | "author" | "date" | "categories" | "image" | "content" | "excerpt";

// QUERIES =================================

const postQuery = (wpSearchOptions: WPSearchOptions, fields: ArticleQueryField[]): string => {
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

  const query = `query fetchPosts {
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
  return query;
};

export const fetchPosts = async (wpSearchOptions: WPSearchOptions, fields: ArticleQueryField[] = ["title", "author", "date", "categories", "image", "content"]): Promise<Post | Post[]> => {
  const query = postQuery(wpSearchOptions, fields);
  const { data: nestedData } = await wpquery({ query });
  const postsOrPost = wpSearchOptions.first ? "posts" : "post";
  const data = postsOrPost === "posts" ? nestedData[postsOrPost].nodes : nestedData[postsOrPost];
  return data;
};

// FORMATTERS =================================

const UNKNOWN_TITLE = "Article sans titre";
const UNKNOWN_AUTHOR = "Invité.e";
const DEFAULT_ARTICLE_IMAGE_METADATA_PATH = "DEFAULT_ARTICLE_IMAGE";
const DEFAULT_ARTICLE_IMAGE_METADATA = {
  title: "Image de couverture de l'article",
  altText: "Image de couverture par défaut de l'article",
  sourceUrl: "https://www.frustrationmagazine.fr/wp-content/uploads/2021/11/LOGO-SLOGAN-3.png"
};

export const formatSlug = (article: Post): string => article?.slug ?? "";
export const formatTitle = (article: Post): string => article?.title ?? UNKNOWN_TITLE;

export const formatAuthor = (article: Post) => {
  if (article?.author?.node?.firstName || article?.author?.node?.lastName) {
    return `${article?.author.node.firstName ?? ""} ${article?.author.node.lastName ?? ""}`;
  }
  return UNKNOWN_AUTHOR;
};

export const formatImage = (article: Post): { title: string; altText: string; sourceUrl: string } => {
  if (article?.featuredImage?.node) {
    return article?.featuredImage.node;
  }

  return DEFAULT_ARTICLE_IMAGE_METADATA;
};

export const formatDate = (article: Post, options: { explicit: boolean } = { explicit: false }): Date | string => {
  if (article?.date) {
    const intlOptions: Intl.DateTimeFormatOptions | undefined = options.explicit ? { weekday: "long", year: "numeric", month: "long", day: "numeric" } : undefined;
    let date = new Date(article?.date).toLocaleDateString("fr-FR", intlOptions);
    date = date.charAt(0).toUpperCase() + date.slice(1);
    return date;
  }

  return "";
};

export const formatCategories = (article: Post, onlyParents: boolean): string[] => {
  if (!article.categories) return [];
  const {
    categories: { nodes: categories }
  } = article;
  let f_categories = categories.map((category: ArticleCategoryRaw) => {
    if (category.parent && onlyParents) return category.parent.node.name;
    return category.name;
  });
  f_categories = [...new Set(f_categories)];
  return f_categories;
};

export const formatContent = (article: Post): string => {
  if (article?.content) {
    return article?.content;
  }

  return "";
};

export const formatExcerpt = (article: Post): string => article?.excerpt ?? "";

// ===================================================================================================

async function fetchAPI(query: string) {
  try {
    const res = await fetch("https://adminfrustrationmagazine.fr/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error("Failed to fetch wordpress API");
    const json = await res.json();
    if (json.errors) throw new Error("Failed to parse wordpress API response");
    return json;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchLinkPreview(link: string) {
  let {
    data: { post }
  } = await fetchAPI(`
   query fetchLinkPreview {
      post(id: "${link}", idType: URI) {
        title(format: RENDERED)
        slug
        featuredImage {
          node {
            title(format: RENDERED)
            altText
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
        excerpt
      }
    }
  `);

  return post;
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
              id
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

  posts = posts.nodes.map(({ title, slug, excerpt, featuredImage: { node: image }, date, categories: { nodes: categories }, author: { node: name } }) => ({
    title,
    author: name,
    slug,
    excerpt,
    image,
    date: convertDifferenceOfDays(getNumberOfDaysFromNow(new Date(date))),
    categories: categories.map((category: any) => (category.parent ? category.parent.node.name : category.name))
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

export function formatSearchPosts(posts: any) {
  const { pageInfo } = posts;
  posts = posts.nodes.map(
    ({
      title,
      slug,
      excerpt,
      featuredImage: { node: image },
      date,
      categories: { nodes: categories },
      author: {
        node: { name }
      }
    }) => ({
      title,
      author: name,
      slug,
      excerpt,
      image,
      date: convertDifferenceOfDays(getNumberOfDaysFromNow(new Date(date))),
      categories: categories.map((category: any) => ({ id: category.id, category: category.parent ? category.parent.node.name : category.name }))
    })
  );

  return { posts, pageInfo };
}

export async function searchArticles(term: string, after?: string) {
  let {
    data: { posts }
  } = await fetchAPI(`
    query searchArticles {
      posts(
        first: 6
        ${after ? `after: "${after}"` : ""}
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
  `);

  return formatSearchPosts(posts);
}
