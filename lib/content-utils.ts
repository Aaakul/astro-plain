import { getCollection } from "astro:content";
import type { Lang } from "~/i18n";
import { type BlogFrontmatter } from "@/content.config";

/** Core post data combining frontmatter and post ID */
export type BlogCoreContent = BlogFrontmatter & {
  id: string;
};

/**
 * Fetches blog posts from the content collection.
 * - In production, draft posts are excluded.
 * - Supports language filtering, custom predicates, and date sorting (default: newest first).
 */
export const getBlog = async (
  language?: Lang,
  length?: number,
  sorting: "ascend" | "descend" = "descend",
  filter?: (data: BlogFrontmatter) => boolean,
) => {
  return (
    await getCollection(
      "blog",
      ({ data }) =>
        (import.meta.env.PROD ? data.draft !== true : true) &&
        (language ? data.language === language : true) &&
        (filter ? filter(data) : true),
    )
  )
    .sort((a, b) =>
      sorting === "descend"
        ? b.data.date.valueOf() - a.data.date.valueOf()
        : a.data.date.valueOf() - b.data.date.valueOf(),
    )
    .slice(0, length);
};

type BlogData = Awaited<ReturnType<typeof getBlog>>[number]["data"];

/** Flattens blog collection entries to BlogCoreContent array */
export const getBlogCoreContent = (posts: Awaited<ReturnType<typeof getBlog>>): BlogCoreContent[] =>
  posts.map(({ id, data }) => ({
    id,
    ...data,
  }));

/**
 * Aggregates frequency counts of a frontmatter field (e.g. 'tags' or 'categories')
 * for a given language, sorted from highest to lowest count.
 */
export const getStats = async (
  language: Lang,
  field: string,
): Promise<Record<string, number> | null> => {
  const filter = (data: BlogData): boolean => {
    const value = data[field as keyof BlogData];
    return Array.isArray(value)
      ? value.length > 0
      : typeof value === "string" && value.trim().length > 0;
  };

  const blogs = await getBlog(language, undefined, undefined, filter);

  if (blogs.length === 0) {
    return null;
  }

  // Count occurrences of each tag or category
  const statsMap = blogs.reduce((map, { data }) => {
    const fieldValue = data[field as keyof BlogData];

    const processValue = (value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        map.set(trimmed, (map.get(trimmed) || 0) + 1);
      }
    };

    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((item) => {
        if (typeof item === "string") {
          processValue(item);
        }
      });
    } else if (typeof fieldValue === "string") {
      processValue(fieldValue);
    }

    return map;
  }, new Map<string, number>());

  if (statsMap.size === 0) {
    return null;
  }

  // Sort by count descending
  const sortedEntries = Array.from(statsMap.entries()).sort(([, a], [, b]) => b - a);

  return Object.fromEntries(sortedEntries);
};

/** Returns all unique tag and category names for a specific language */
export const getTopics = async (lang: Lang) => {
  const tagStats = await getStats(lang, "tags");
  const tagList = !tagStats ? null : Object.keys(tagStats);

  const categoryStats = await getStats(lang, "categories");
  const categoryList = !categoryStats ? null : Object.keys(categoryStats);

  return { tagList, categoryList };
};

/**
 * Resolves translated variants of a post by matching its translationKey.
 * Returns a map of language codes to post IDs, plus 'x-default' for canonical version.
 */
export const getAlternateVersionSlug = async (translationKey: string, targetLanguage?: Lang) => {
  const filter = (data: BlogData): boolean => {
    return data.translationKey === translationKey;
  };

  const blogs = await getBlog(targetLanguage, undefined, undefined, filter);

  const result = blogs.reduce((map, { id, data }) => {
    if (data.isCanonical) {
      map.set("x-default", data.language);
    }
    map.set(data.language, id);
    return map;
  }, new Map<Lang | "x-default", string>());

  return result.size === 0 ? null : result;
};

/** Resolves an author's display name, falling back to the author suffix/ID if not found */
export const getAuthorName = async (language: Lang, suffix: string) => {
  const [author] = await getCollection(
    "author",
    ({ id, data }) => data.language === language && id.endsWith(suffix),
  );

  return author?.data.name ?? suffix;
};

/**
 * Finds related posts that share categories or tags with the current post.
 * Ranks candidates by number of matching categories + tags, using publish date to break ties.
 */
export const getRelatedPosts = async (
  currentPostId: string,
  language: Lang,
  categories?: string[],
  tags?: string[],
  limit: number = 3,
): Promise<BlogCoreContent[]> => {
  if (!categories || categories.length === 0 || !tags || tags.length === 0) {
    return [];
  }

  const categorySet = new Set(categories);
  const tagSet = new Set(tags);

  const filter = (data: BlogFrontmatter): boolean => {
    const hasCategory = data.categories?.some((c) => categorySet.has(c));
    const hasTag = data.tags?.some((t) => tagSet.has(t));
    return Boolean(hasCategory && hasTag);
  };

  const blogs = await getBlog(language, undefined, undefined, filter);

  const scoredBlogs = blogs
    .filter((blog) => blog.id !== currentPostId)
    .map((blog) => {
      const matchedCategories = blog.data.categories?.filter((c) => categorySet.has(c)).length ?? 0;
      const matchedTags = blog.data.tags?.filter((t) => tagSet.has(t)).length ?? 0;
      return {
        blog,
        score: matchedCategories + matchedTags,
      };
    });

  // Sort by highest score first, then newest date
  scoredBlogs.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.blog.data.date.valueOf() - a.blog.data.date.valueOf();
  });

  return scoredBlogs.slice(0, limit).map(({ blog }) => ({
    id: blog.id,
    ...blog.data,
  }));
};

/**
 * Gets adjacent chronological posts (previous = older, next = newer).
 * Note: Since getBlog sorts descending (newest first), index + 1 is older and index - 1 is newer.
 */
export const getPrevNextPosts = async (
  currentPostId: string,
  language: Lang,
): Promise<{
  prev: BlogCoreContent | null;
  next: BlogCoreContent | null;
}> => {
  const posts = await getBlog(language);
  const index = posts.findIndex((post) => post.id === currentPostId);
  if (index === -1) {
    return { prev: null, next: null };
  }

  // posts array is sorted descending by date
  const prevPost = index < posts.length - 1 ? posts[index + 1] : null; // older post
  const nextPost = index > 0 ? posts[index - 1] : null; // newer post

  return {
    prev: prevPost ? { id: prevPost.id, ...prevPost.data } : null,
    next: nextPost ? { id: nextPost.id, ...nextPost.data } : null,
  };
};
