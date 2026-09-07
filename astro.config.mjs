// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import SiteConfig from "./site.config";
import { remarkReadingTime } from "./lib/remark-reading-time.mjs";
import expressiveCode from "astro-expressive-code";
import { remarkAlert } from "remark-github-blockquote-alert";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import pagefind from "astro-pagefind";
import pluginPagefindIgnore from "./lib/expressive-code-pagefind-ignore-plugin";

export default defineConfig({
  site: SiteConfig.siteUrl,
  base: SiteConfig.basePath,
  output: "static",
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    // Disable default syntax highlighter in favor of Expressive Code integration below
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkReadingTime, remarkAlert],
    }),
  },
  integrations: [
    expressiveCode({
      defaultProps: {
        showLineNumbers: false,
        wrap: true,
      },
      themes: [SiteConfig.codeTheme.light, SiteConfig.codeTheme.dark],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers(), pluginPagefindIgnore()],
      styleOverrides: {
        lineNumbers: {
          foreground: "var(--muted-foreground)",
          highlightForeground: "var(--foreground)",
        },
      },
    }),
    mdx(),
    sitemap({
      // Exclude page/1 to avoid duplicate URLs with the main list page
      filter: (page) => !page.endsWith("/page/1"),
    }),
    pagefind(),
  ],
  vite: {
    build: {
      assetsInlineLimit: 10240,
    },
  },
});
