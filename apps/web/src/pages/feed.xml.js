import rss from "@astrojs/rss";
import { fetchRSSItems } from "@libs/wordpress";

export async function GET(context) {
  const lastPosts = await fetchRSSItems({ first: 25 });
  const items = lastPosts.map((post) => ({
    title: post.title,
    author: post.author.node.name,
    description: post.excerpt,
    content: post.content,
    categories: post.categories.nodes.map(({ name }) => name),
    pubDate: new Date(post.date),
    link: `/${post.slug}`,
  }));

  return rss({
    title: "Frustration Magazine",
    description:
      "Frustration Magazine, média indépendant et offensif qui relate la guerre des classes.",
    site: context.site,
    items,
    customData: `<language>fr-fr</language>`,
  });
}
