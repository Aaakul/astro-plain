# Astro Plain

![Astro Plain](/src/assets/screenshot.jpg)

[Astro](https://astro.build/) ベースのミニマルな多言語静的ブログテンプレートで、CSS / UI フレームワークに依存しません。

[オンラインデモを見る](https://astro-plain-demo.pages.dev) · [Lighthouse 100/100 レポート](https://pagespeed.web.dev/analysis/https-astro-plain-demo-pages-dev-en-US-blog-sample-intro/koeoulhg15?form_factor=mobile)

[English](/README.md) | [简体中文](/README.zh-Hans.md)

## 特徴

- **高性能ミニマルアーキテクチャ**：[Astro](https://astro.build/) の静的サイト生成（SSG）をベースとし、CSS / UI フレームワークに依存しません。Lighthouse の全カテゴリで 100 点満点を達成。
- **国際化（i18n）と SEO**：
  - 簡体字中国語、英語、日本語の翻訳を内蔵。
  - サブパスベースの静的多言語ルーティング（例：`/zh-Hans/`、`/en-US/`、`/ja-JP/`）。
  - スマート言語リダイレクト：言語設定 Cookie またはブラウザの言語設定に基づいて、サイトの言語を自動選択。
  - 多言語 SEO タグ（`hreflang` / `x-default` / Open Graph）の自動生成。
  - サイトマップ（Sitemap）、`robots.txt`、および各言語対応の RSS フィードの自動生成。
- **オフライン全文検索**：[Pagefind](https://pagefind.app/) 静的検索エンジンを統合、設定不要。
- **モダンな Markdown / MDX ライティング体験**：
  - Zod と [Astro Content Layer](https://docs.astro.build/ja/guides/content-collections/) に基づく型安全なコンテンツコレクション。
  - [Expressive Code](https://expressive-code.com/) によるコードハイライト。
  - 組み込みの実用的な MDX コンポーネント：ファイルツリー（[`FileTree`](https://starlight.astro.build/ja/guides/components/#file-tree)）、ステップバイステップ手順（[`Steps`](https://starlight.astro.build/ja/guides/components/#steps)）、タブ（[`Tabs`](https://starlight.astro.build/ja/guides/components/#tabs)）、および GitHub スタイルのアラートブロック引用（[`remark-github-blockquote-alert`](https://github.com/jaywcjlove/remark-github-blockquote-alert)）
    。
- **その他の機能**：[Disqus](https://disqus.com/) コメントシステムと [Microsoft Clarity](https://clarity.microsoft.com/) サイトアクセス分析をサポート。

---

## クイックスタート

### インストール

1. リポジトリをクローン：

   ```bash
   git clone https://github.com/Aaakul/astro-plain.git
   cd astro-plain
   ```

2. 依存関係をインストール：

   ```bash
   # npm
   npm install

   # pnpm
   pnpm install

   # bun
   bun install
   ```

3. 開発サーバーを起動：

   ```bash
   # npm
   npm run dev

   # pnpm
   pnpm run dev

   # bun
   bun --bun run dev
   ```

   開発サーバーはデフォルトで `http://127.0.0.1:4321` で起動します。

> [!NOTE]
> `Pagefind` はインデックス生成に静的ビルドの出力に依存しています。開発環境で初めて使用する前に、ビルドコマンドを少なくとも1回実行する必要があります。
> 記事を追加・修正した後、開発サーバーは検索インデックスを自動的に再生成しません。

---

## 設定説明

### サイト基本設定

コア設定ファイルは `site.config.ts` で、主な設定項目は以下の通りです：

| 設定項目          | 説明                                                                | デフォルト値              |
| :---------------- | :------------------------------------------------------------------ | :------------------------ |
| `defaultLanguage` | デフォルト言語コード                                                | `"zh-Hans"`               |
| `siteUrl`         | サイト URL（環境変数 `SITE_URL` でも設定可能）                      | `"http://127.0.0.1:4321"` |
| `basePath`        | サブパスデプロイプレフィックス（環境変数 `BASE_PATH` でも設定可能） | `""`                      |
| `languageNameMap` | 言語コードと表示名のマッピング                                      | 設定ファイルを参照        |
| `postsPerPage`    | ブログ記事一覧の1ページあたりの表示件数                             | `5`                       |
| `navLinks`        | トップナビゲーションバーリンク                                      | 設定ファイルを参照        |
| `ogImage`         | デフォルトのソーシャル共有画像（OG Image）、推奨サイズ 1200x630     | `"/static/images/og.jpg"` |
| `allowRobots`     | クローラーを許可するかどうか                                        | `true`                    |
| `disqus`          | Disqus コメント（`enable` + `shortname`）                           | 無効                      |
| `clarity`         | Microsoft Clarity（`enable` + `projectId`）                         | 無効                      |

### 環境変数

`.env.example` のコメントを参考に `.env` ファイルを作成してください。その中で `SITE_URL`、`BASE_PATH`、および Disqus、Clarity サービスを設定できます。

### ファビコンと画像の差し替え

以下のファイルを差し替えてください：

- `public/favicon.ico`
- `public/favicon.svg`
- `public/apple-touch-icon.png`
- `public/static/images/og.jpg`
- `src/assets/*`

---

## コンテンツ作成

コンテンツファイルは `src/content/` に配置され、`src/content.config.ts` で Schema が定義されています。

### ヒーローセクション（Hero Section）

対応するファイルは `src/content/mdx/<言語コード>/hero.mdx` にあります。

### 記事（`src/content/blog/`）

Markdown および MDX 形式をサポートしています。記事 Frontmatter の例：

```yaml
---
title: "記事タイトル" # 必須
translationKey: "unique-key" # 必須：異なる言語版の記事を関連付けるために使用
language: "zh-Hans" # 必須：言語コード、languageNameMap で宣言されている必要あり
date: "2026-08-30T10:00:00Z" # 必須：ISO 8601 形式
summary: "記事の概要" # 任意：一覧表示と SEO 用
lastmod: "2026-08-30T12:00:00Z" # 任意：最終更新日時
isCanonical: true # 任意：正規言語版として設定（x-default/canonical を生成）
draft: false # 任意：下書きはビルドに含まれません
authors: ["default"] # 任意：著者リスト
categories: ["技術"] # 任意
tags: ["Astro"] # 任意
image: "@/assets/banner.jpg" # 任意：記事カバー画像
enableComments: false # 任意：コメントを有効にするかどうか、デフォルトは true
---
```

> [!NOTE]
> 多言語の関連付け（`translationKey`）：異なる言語の同一記事において、それぞれの Frontmatter で同じ `translationKey` を宣言すると、テンプレートが自動的に言語切り替えリンクと hreflang タグを生成します。

### 著者（`src/content/author/<言語コード>/`）

デフォルトの著者ファイルは `default.mdx` です。例：

```yaml
---
name: "著者名" # 必須
language: "zh-Hans" # 必須
avatar: "@/assets/avatar.svg"
occupation: "役職"
company: "会社名"
email: "hello@example.com"
link:
  github: "https://github.com/username"
---
```

### プロジェクト紹介（`src/content/project/`）

```yaml
---
name: "Astro Plain" # 必須：プロジェクトタイトル
language: "zh-Hans" # 必須：言語コード
website: "https://example.com"
image: "@/assets/project-preview.png"
link:
  github: "https://github.com/Aaakul/astro-plain"
---
本文内容...
```

### 新しい言語の追加

1. `site.config.ts` の `languageNameMap` に言語コードを追加します（例：`"fr-FR": "Français"`）。
2. `i18n/messages/` 配下に対応する翻訳辞書ファイルを作成します（例：`fr-FR.ts`）。
3. `i18n/utils.ts` でそのファイルをインポートします。
4. `src/content/author/<言語コード>/` 配下に最低限 `default.mdx` を含む著者ファイルを作成します。

---

## デプロイ

プロジェクトはビルド完了後に純粋な静的ファイルを出力します。出力ディレクトリは `dist` です。

### 例：Cloudflare Pages

1. 本プロジェクトをご自身の GitHub アカウントに Fork します。

2. [Cloudflare Dashboard](https://dash.cloudflare.com) にログインし、**コンピュート -> Workers & Pages -> アプリケーションを作成する -> Pages を導入しようとお考えですか? 始める** をクリックして GitHub リポジトリを接続します。

3. ビルド設定を構成：

   - **ビルドコマンド**：

     ```bash
     npm run build
     ```

   - **ビルド出力ディレクトリ**：`dist`

   - **環境変数**：`SITE_URL` をデプロイ後のドメイン（例：`https://example.pages.dev`）に設定し、必要に応じて Disqus や Clarity 関連の変数を設定します。

4. 保存してデプロイします。以降 `main` ブランチにプッシュ（Push）するたびに自動的にビルドとデプロイが行われます。

## オープンソースライセンス

本プロジェクトは MIT License のもとでオープンソースとして公開されています。Star、PR、Issue の投稿を歓迎します。
