import { getCollection } from "astro:content";
import { normalizeName } from "@/utils/strings";

export const formatAuthorName = (authorName: string): string => {
  const normalizedAuthorName = normalizeName(authorName);
  return normalizedAuthorName;
};

export const getAuthor = async (authorName: string) => {
  const normalizedAuthorName = formatAuthorName(authorName);
  const allAuthors = await getCollection("authors");
  const defaultAuthor = allAuthors.find(({ id }) => id === "default");
  const author = allAuthors.find(({ id }) => id === normalizedAuthorName);
  return author ?? defaultAuthor;
};
