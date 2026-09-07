import type { BlogCoreContent } from "./content-utils";
import SiteConfig from "~/site.config";

const DEFAULT_PAGE_SIZE = SiteConfig.postsPerPage;

/**
 * Paginates an array of posts into static route entries for Astro's `getStaticPaths`.
 * - For page 1, `path` is `undefined` to serve at root (e.g. `/en-US/categories/tech/`).
 * - For page 2+, `path` is `page/${page}` (e.g. `/en-US/categories/tech/page/2/`).
 */
export function customPaginate<T extends Record<string, string | number | undefined>>(
  posts: BlogCoreContent[],
  baseParams: T,
) {
  const totalPages = Math.max(1, Math.ceil(posts.length / DEFAULT_PAGE_SIZE));

  return Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;

    return {
      params: {
        ...baseParams,
        // Page 1 has no path suffix, subsequent pages use 'page/N'
        path: page === 1 ? undefined : `page/${page}`,
      },
      props: {
        posts: posts.slice(index * DEFAULT_PAGE_SIZE, (index + 1) * DEFAULT_PAGE_SIZE),
        pagination: {
          currentPage: page,
          totalPages,
        },
      },
    };
  });
}
