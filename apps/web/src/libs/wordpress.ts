export async function fetchPostBySlug({ slug }: any) {
  const query = `
   query fetchPostBySlug {
        post(id: "${slug}", idType: SLUG) {
          title(format: RENDERED)
          slug
          date
          author { node { firstName lastName userId slug } }
          categories { nodes { slug name parent { node { name } } } }
          content(format: RENDERED)
          featuredImage {
            node {
              title(format: RENDERED)
              altText
              sourceUrl
              mediaDetails { height width }
              mimeType
            }
          }
        }
    }`;

  let {
    data: { post },
  } = await fetchWordpress({ query });

  return post;
}

export async function fetchLastPosts({ first = 6 }: any) {
  const query = `
   query fetchLastPosts {
        posts(first: ${first}) {
          nodes {
            title(format: RENDERED)
            slug
            date
            author { node { firstName lastName userId } }
            categories { nodes { slug name parent { node { name } } } }
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
    }`;

  let {
    data: {
      posts: { nodes: posts },
    },
  } = await fetchWordpress({ query });

  return posts;
}

export async function fetchRSSItems({ first = 6 }: any) {
  const query = `
   query fetchLastPosts {
        posts(first: ${first}) {
          nodes {
            title(format: RENDERED)
            slug
            date
            content(format: RENDERED)
            author { node { name } }
            categories { nodes { name } }
            excerpt(format: RENDERED)
          }
        }
    }`;

  let {
    data: {
      posts: { nodes: posts },
    },
  } = await fetchWordpress({ query });

  return posts;
}

export async function fetchInterviews({ first = 6 }: any) {
  const query = `
   query fetchInterviews {
        posts(where: {categoryName: "Entretiens"}, first: ${first}) {
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
  `;

  let {
    data: {
      posts: { nodes: interviews },
    },
  } = await fetchWordpress({ query });

  interviews = interviews.map(
    ({ title, link, slug, featuredImage: { node: image } }: any) => ({
      title,
      link,
      slug,
      image,
    }),
  );

  return interviews;
}

export async function fetchSearchPosts({ term, category, author, after }: any) {
  const query = `
    query fetchSearchPosts {
      posts(
        first: 6
        ${after ? `after: "${after}"` : ""}
        where: { search: "${term}", ${category ? `categoryName:"${category}",` : ""} ${author ? `authorName:"${author}",` : ""} orderby: { field: DATE, order: DESC } }
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

  let {
    data: {
      posts: { nodes: posts, pageInfo },
    },
  } = await fetchWordpress({ query });

  return { posts, pageInfo };
}

export async function fetchLinkPreview(link: string) {
  const query = `
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
  `;

  let {
    data: { post },
  } = await fetchWordpress({ query });

  return post;
}

export async function fetchCategories() {
  const query = `
    query GetDraftPosts {
      categories(first: 30) {
        nodes {
          slug
          name
          parent {
            node {
              name
              slug
            }
          }
          children {
            nodes {
              name
              slug
            }
          }
          count
        }
      }
    }
  `;

  let {
    data: {
      categories: { nodes: categories },
    },
  } = await fetchWordpress({ query });

  return categories;
}

/* ========================================================= */
/* ========================================================= */

async function fetchWordpress({ query, variables = {} }: any) {
  const PUBLIC_WP_URL = import.meta.env.PUBLIC_WP_URL;

  if (!PUBLIC_WP_URL) {
    console.error("Missing PUBLIC_WP_URL env variable");
    return;
  }

  try {
    const res = await fetch(PUBLIC_WP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch wordpress API");
    }

    const json = await res.json();
    if (json.errors) throw new Error("Failed to parse wordpress API response");
    return json;
  } catch (e) {
    console.error(e);
  }
}
