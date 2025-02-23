import rss from "@astrojs/rss";

export function GET(context) {
  return rss({
    title: "Frustration Magazine",
    description:
      "Frustration Magazine, média indépendant et offensif qui relate la guerre des classes.",
    site: context.site,
    items: [],
    customData: `<language>fr-fr</language>`,
  });
}
