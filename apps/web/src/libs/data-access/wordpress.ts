import dotenv from "dotenv";
import { getNumberOfDaysFromNow, convertDifferenceOfDays } from "../utils/dates";
dotenv.config();
const WP_URL = process.env.WP_URL;

async function fetchAPI(query: string) {
  try {
    const res = await fetch(WP_URL ?? "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
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
    data: { posts },
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
    image,
  }));

  return posts;
}

export async function getSlugs() {
  let {
    data: { posts },
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
    data: { posts },
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
    categories: categories.map((category) => (category.parent ? category.parent.node.name : category.name)),
  }));

  return posts;
}

export async function getInterviews() {
  const {
    data: { posts },
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
    image,
  }));

  return interviews;
}
