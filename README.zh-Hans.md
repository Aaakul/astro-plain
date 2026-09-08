# Astro Plain

![Astro Plain](/src/assets/screenshot.jpg)

基于 [Astro](https://astro.build/) 的极简多语言静态博客模板，无 CSS / UI 框架依赖。

[查看在线示例](https://astro-plain-demo.pages.dev) · [Lighthouse 100/100 满分报告](https://pagespeed.web.dev/analysis/https-astro-plain-demo-pages-dev-en-US-blog-sample-intro/koeoulhg15?form_factor=mobile)

[English](/README.md) | [日本語](/README.ja-JP.md)

## 特性

- **高性能最小化架构**：基于 [Astro](https://astro.build/) 静态站点生成（SSG），无 CSS / UI 框架依赖。在 Lighthouse 各项指标评测中均获得 100 满分。
- **国际化（i18n）与 SEO**：
  - 内置简体中文，英文和日文翻译。
  - 基于子路径的静态多语言路由（如 `/zh-Hans/`、`/en-US/`、`/ja-JP/`）。
  - 智能语言跳转：根据语言偏好 Cookie 或浏览器语言自动选择网站语言。
  - 自动生成多语言 SEO 标签（`hreflang` / `x-default` / Open Graph）。
  - 自动生成站点地图（Sitemap）、 `robots.txt`以及各语言对应的 RSS 订阅源。
- **离线全文搜索**：集成 [Pagefind](https://pagefind.app/) 静态搜索引擎，无需配置。
- **现代 Markdown / MDX 写作体验**：
  - 基于 Zod 和 [Astro Content Layer](https://docs.astro.build/zh-cn/guides/content-collections/) 的类型安全内容集合。
  - 基于 [Expressive Code](https://expressive-code.com/) 的代码高亮。
  - 内置实用 MDX 组件：文件树（[`FileTree`](https://starlight.astro.build/zh-cn/guides/components/#file-tree)）、分步说明（[`Steps`](https://starlight.astro.build/zh-cn/guides/components/#steps)）、标签页（[`Tabs`](https://starlight.astro.build/zh-cn/guides/components/#tabs)）及 GitHub 风格提示框（[`remark-github-blockquote-alert`](https://github.com/jaywcjlove/remark-github-blockquote-alert)）
    。
- **其他功能**：支持 [Disqus](https://disqus.com/) 评论系统与 [Microsoft Clarity](https://clarity.microsoft.com/) 站点访问分析。

---

## 快速上手

### 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/Aaakul/astro-plain.git
   cd astro-plain
   ```

2. 安装依赖：

   ```bash
   # npm
   npm install

   # pnpm
   pnpm install

   # bun
   bun install
   ```

3. 启动开发服务器：

   ```bash
   # npm
   npm run dev

   # pnpm
   pnpm run dev

   # bun
   bun --bun run dev
   ```

   开发服务器默认运行在 `http://127.0.0.1:4321`。

> [!NOTE]
> `Pagefind` 依赖静态构建产物生成索引，在开发环境中首次使用必须至少运行过一次构建命令。
> 新增或修改文章后，开发服务器不会自动重新生成搜索索引。

---

## 配置说明

### 站点基础配置

核心配置文件为 `site.config.ts`，主要配置项如下：

| 配置项            | 说明                                                | 默认值                    |
| :---------------- | :-------------------------------------------------- | :------------------------ |
| `defaultLanguage` | 默认语言代码                                        | `"zh-Hans"`               |
| `siteUrl`         | 网站 URL（也可通过环境变量 `SITE_URL` 设置）        | `"http://127.0.0.1:4321"` |
| `basePath`        | 子路径部署前缀（也可通过环境变量 `BASE_PATH` 设置） | `""`                      |
| `languageNameMap` | 语言代码与显示名称映射                              | 见配置文件                |
| `postsPerPage`    | 博客列表每页文章数                                  | `5`                       |
| `navLinks`        | 顶部导航栏链接                                      | 见配置文件                |
| `ogImage`         | 默认社交分享图（OG Image），推荐尺寸 1200x630       | `"/static/images/og.jpg"` |
| `allowRobots`     | 是否允许爬虫                                        | `true`                    |
| `disqus`          | Disqus 评论（`enable` + `shortname`）               | 禁用                      |
| `clarity`         | Microsoft Clarity（`enable` + `projectId`）         | 禁用                      |

### 环境变量

参考 `.env.example` 中的注释创建 `.env` 文件，可在其中设置 `SITE_URL`、`BASE_PATH` 以及 Disqus、Clarity 服务。

### 替换网站图标和图片

替换以下文件：

- `public/favicon.ico`
- `public/favicon.svg`
- `public/apple-touch-icon.png`
- `public/static/images/og.jpg`
- `src/assets/*`

---

## 内容创作

内容文件位于 `src/content/`，由 `src/content.config.ts` 定义 Schema。

### 首屏区域（Hero Section）

相应文件位于 `src/content/mdx/<语言代码>/hero.mdx`

### 文章（`src/content/blog/`）

支持 Markdown 与 MDX 格式。文章 Frontmatter 示例：

```yaml
---
title: "文章标题" # 必须
translationKey: "unique-key" # 必须：用于关联不同语言版本的文章
language: "zh-Hans" # 必须：语言代码，须在 languageNameMap 中声明
date: "2026-08-30T10:00:00Z" # 必须：ISO 8601 格式
summary: "文章摘要" # 可选：用于列表展示与 SEO
lastmod: "2026-08-30T12:00:00Z" # 可选：最后修改时间
isCanonical: true # 可选：设为权威语言版本（生成 x-default/canonical）
draft: false # 可选：草稿不参与构建
authors: ["default"] # 可选：作者列表
categories: ["技术"] # 可选
tags: ["Astro"] # 可选
image: "@/assets/banner.jpg" # 可选：文章封面图
enableComments: false # 可选：是否开启评论，默认为 true
---
```

> [!NOTE]
> 多语言关联（`translationKey`）：不同语言的同一篇文章，在各自的 Frontmatter 中声明相同的 `translationKey`，模板会自动生成语言切换链接和 hreflang 标签。

### 作者（`src/content/author/<语言代码>/`）

默认作者文件为 `default.mdx`。示例：

```yaml
---
name: "作者名" # 必须
language: "zh-Hans" # 必须
avatar: "@/assets/avatar.svg"
occupation: "职位"
company: "公司名"
email: "hello@example.com"
link:
  github: "https://github.com/username"
---
```

### 项目展示（`src/content/project/`）

```yaml
---
name: "Astro Plain" # 必须：项目标题
language: "zh-Hans" # 必须：语言代码
website: "https://example.com"
image: "@/assets/project-preview.png"
link:
  github: "https://github.com/Aaakul/astro-plain"
---
正文内容...
```

### 新增语言

1. 在 `site.config.ts` 的 `languageNameMap` 中添加语言代码（如 `"fr-FR": "Français"`）。
2. 在 `i18n/messages/` 下创建对应的翻译字典文件（如 `fr-FR.ts`）。
3. 在 `i18n/utils.ts` 中引入该文件。
4. 在 `src/content/author/<语言代码>/` 下创建至少包含 `default.mdx` 的作者文件。

---

## 部署

项目构建完成后输出纯静态文件，输出目录为 `dist`。

### 示例：Cloudflare Pages

1. Fork 本项目到你自己的 GitHub 账号下。

2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)，点击**计算 -> Workers和Pages -> 创建应用程序 -> 想要部署 Pages？开始使用**，然后关联你的 GitHub 仓库。

3. 配置构建参数：

   - **构建命令**：

     ```bash
     npm run build
     ```

   - **构建输出目录**：`dist`

   - **环境变量**：设置 `SITE_URL` 为部署后的域名（如 `https://example.pages.dev`），按需配置 Disqus 和 Clarity 相关变量。

4. 保存并部署。后续每次向 `main` 分支推送（Push）代码时，均会自动触发构建与部署。

## 开源协议

本项目基于 MIT License 开源发布。欢迎提交 Star、PR 或 Issue。
