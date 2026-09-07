# Astro Plain

![Astro Plain](/src/assets/screenshot.jpg)

A minimalist multilingual static blog template built on [Astro](https://astro.build/), with no CSS / UI framework dependencies.

[View Live Demo](https://astro-plain-demo.pages.dev)

[简体中文](/README.zh-Hans.md) | [日本語](/README.ja-JP.md)

## Features

- **High-Performance Minimal Architecture**: Built on [Astro](https://astro.build/) Static Site Generation (SSG), with no CSS / UI framework dependencies.
- **Internationalization (i18n) & SEO**:
  - Built-in Simplified Chinese, English, and Japanese translations.
  - Subpath-based static multilingual routing (e.g., `/zh-Hans/`, `/en-US/`, `/ja-JP/`).
  - Smart language redirect: automatically selects the site language based on language preference cookie or browser language.
  - Automatic generation of multilingual SEO tags (`hreflang` / `x-default` / Open Graph).
  - Automatic generation of sitemap, `robots.txt`, and per-language RSS feeds.
- **Offline Full-Text Search**: Integrated [Pagefind](https://pagefind.app/) static search engine, zero configuration required.
- **Modern Markdown / MDX Writing Experience**:
  - Type-safe content collections based on Zod and [Astro Content Layer](https://docs.astro.build/en/guides/content-collections/).
  - Code highlighting powered by [Expressive Code](https://expressive-code.com/).
  - Built-in utility MDX components: file tree ([`FileTree`](https://starlight.astro.build/en/guides/components/#file-tree)), step-by-step instructions ([`Steps`](https://starlight.astro.build/en/guides/components/#steps)), tabs ([`Tabs`](https://starlight.astro.build/en/guides/components/#tabs)), and GitHub-style alert blockquotes ([`remark-github-blockquote-alert`](https://github.com/jaywcjlove/remark-github-blockquote-alert))
    .
- **Other Features**: Support for [Disqus](https://disqus.com/) comment system and [Microsoft Clarity](https://clarity.microsoft.com/) site analytics.

---

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Aaakul/astro-plain.git
   cd astro-plain
   ```

2. Install dependencies:

   ```bash
   # npm
   npm install

   # pnpm
   pnpm install

   # bun
   bun install
   ```

3. Start the development server:

   ```bash
   # npm
   npm run dev

   # pnpm
   pnpm run dev

   # bun
   bun --bun run dev
   ```

   The development server runs at `http://127.0.0.1:4321` by default.

> [!NOTE]
> `Pagefind` relies on static build output to generate its index. You must run the build command at least once before using it in the development environment for the first time.
> After adding or modifying posts, the dev server will not automatically regenerate the search index.

---

## Configuration

### Site Configuration

The core configuration file is `site.config.ts`, with key options as follows:

| Option            | Description                                                                      | Default                   |
| :---------------- | :------------------------------------------------------------------------------- | :------------------------ |
| `defaultLanguage` | Default language code                                                            | `"zh-Hans"`               |
| `siteUrl`         | Site URL (can also be set via environment variable `SITE_URL`)                   | `"http://127.0.0.1:4321"` |
| `basePath`        | Subpath deployment prefix (can also be set via environment variable `BASE_PATH`) | `""`                      |
| `languageNameMap` | Mapping of language codes to display names                                       | See config file           |
| `postsPerPage`    | Number of posts per page in the blog list                                        | `5`                       |
| `navLinks`        | Top navigation bar links                                                         | See config file           |
| `ogImage`         | Default social sharing image (OG Image), recommended size 1200x630               | `"/static/images/og.jpg"` |
| `allowRobots`     | Whether to allow crawlers                                                        | `true`                    |
| `disqus`          | Disqus comments (`enable` + `shortname`)                                         | Disabled                  |
| `clarity`         | Microsoft Clarity (`enable` + `projectId`)                                       | Disabled                  |

### Environment Variables

Refer to the comments in `.env.example` to create a `.env` file, where you can set `SITE_URL`, `BASE_PATH`, as well as Disqus and Clarity services.

### Replacing Favicons and Images

Replace the following files:

- `public/favicon.ico`
- `public/favicon.svg`
- `public/apple-touch-icon.png`
- `public/static/images/og.jpg`
- `src/assets/*`

---

## Content Creation

Content files are located in `src/content/`, with schemas defined in `src/content.config.ts`.

### Hero Section

Corresponding files are located at `src/content/mdx/<language-code>/hero.mdx`.

### Posts (`src/content/blog/`)

Both Markdown and MDX formats are supported. Post Frontmatter example:

```yaml
---
title: "Post Title" # Required
translationKey: "unique-key" # Required: used to associate posts across different language versions
language: "zh-Hans" # Required: language code, must be declared in languageNameMap
date: "2026-08-30T10:00:00Z" # Required: ISO 8601 format
summary: "Post summary" # Optional: used for list display and SEO
lastmod: "2026-08-30T12:00:00Z" # Optional: last modified date
isCanonical: true # Optional: set as canonical language version (generates x-default/canonical)
draft: false # Optional: drafts are excluded from builds
authors: ["default"] # Optional: author list
categories: ["Tech"] # Optional
tags: ["Astro"] # Optional
image: "@/assets/banner.jpg" # Optional: post cover image
enableComments: false # Optional: whether to enable comments, defaults to true
---
```

> [!NOTE]
> Multilingual association (`translationKey`): For the same post in different languages, declare the same `translationKey` in their respective Frontmatter, and the template will automatically generate language switcher links and hreflang tags.

### Authors (`src/content/author/<language-code>/`)

The default author file is `default.mdx`. Example:

```yaml
---
name: "Author Name" # Required
language: "zh-Hans" # Required
avatar: "@/assets/avatar.svg"
occupation: "Occupation"
company: "Company Name"
email: "hello@example.com"
link:
  github: "https://github.com/username"
---
```

### Project Showcase (`src/content/project/`)

```yaml
---
name: "Astro Plain" # Required: project title
language: "zh-Hans" # Required: language code
website: "https://example.com"
image: "@/assets/project-preview.png"
link:
  github: "https://github.com/Aaakul/astro-plain"
---
Body content...
```

### Adding a New Language

1. Add the language code to `languageNameMap` in `site.config.ts` (e.g., `"fr-FR": "Français"`).
2. Create the corresponding translation dictionary file under `i18n/messages/` (e.g., `fr-FR.ts`).
3. Import the file in `i18n/utils.ts`.
4. Create an author file containing at least `default.mdx` under `src/content/author/<language-code>/`.

---

## Deployment

The project outputs pure static files upon build completion, with the output directory being `dist`.

### Example: Cloudflare Pages

1. Fork this repository to your own GitHub account.

2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com), click **Compute -> Workers and Pages -> Create Application -> Continue to Pages**, and connect your GitHub repository.

3. Configure build settings:

   - **Build command**:

     ```bash
     npm run build
     ```

   - **Build output directory**: `dist`

   - **Environment variables**: Set `SITE_URL` to the domain after deployment (e.g., `https://example.pages.dev`), and configure Disqus and Clarity variables as needed.

4. Save and deploy. Any subsequent push to the `main` branch will automatically trigger a new build and deployment.

## License

This project is open-sourced under the MIT License. Stars, PRs, and Issues are welcome.
