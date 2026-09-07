import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

/**
 * Remark plugin that calculates reading time from markdown content
 * and injects the result into `data.astro.frontmatter.readingTime`.
 */
export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    data.astro.frontmatter.readingTime = getReadingTime(textOnPage);
  };
}
