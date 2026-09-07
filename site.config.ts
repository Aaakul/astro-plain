import type { ThemeObjectOrShikiThemeName } from "astro-expressive-code";
import { loadEnv } from "vite";

const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV || "development", process.cwd(), ""),
};

const getEnv = (key: string): string | undefined => {
  return env[key];
};

const rawBasePath = getEnv("BASE_PATH") || "";
const normalizedBasePath = rawBasePath ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}` : "";

const SiteConfig = {
  /** 默认语言代码 / Default Language Code / デフォルト言語コード */
  defaultLanguage: "zh-Hans",

  /** 默认OG图片 / Default OG Image / デフォルトのOGP画像 */
  ogImage: `${normalizedBasePath}/static/images/og.jpg`,

  /** 多语言名称映射 / Language Name Mapping / 言語名マッピング */
  languageNameMap: {
    "en-US": "English",
    "ja-JP": "日本語",
    "zh-Hans": "简体中文",
  },

  /** 网站根地址 / Site URL / サイトの URL */
  siteUrl: getEnv("SITE_URL")?.replace(/\/+$/, "") || "http://127.0.0.1:4321",

  /** 基础路径 (子目录部署) / Base Path (subdirectory deployment) / ベースパス (サブディレクトリデプロイ) */
  basePath: normalizedBasePath,

  /** 是否允许爬虫索引 / Whether to allow robots indexing / クローラーによるインデックスを許可するかどうか */
  allowRobots: true,

  /** 语言偏好设置 Cookie 有效期 (天数, 'session' 或 'none') / Language preference cookie max age in days, 'session', or 'none' / 言語設定 Cookie の有効期限 (日数、'session'、または 'none') */
  cookieMaxAgeDays: "session" as "session" | "none" | number,

  /** 每页显示的文章数量 / Number of posts displayed per page / 1ページに表示される記事数 */
  postsPerPage: 5,

  /** 顶部导航栏链接配置 / Header navigation links / ヘッダーナビゲーションリンク */
  navLinks: [
    { href: "", titleKey: "home" },
    { href: "/projects", titleKey: "projects" },
    { href: "/about", titleKey: "about" },
    { href: "/search", titleKey: "search" },
  ],

  /** Disqus 评论配置 / Disqus Comments Configuration / Disqus コメント設定 */
  disqus: {
    enable: getEnv("DISQUS_ENABLE")?.toUpperCase() === "TRUE",
    shortname: getEnv("DISQUS_SHORTNAME") || "",
  },

  /** 微软 Clarity 统计配置 / Microsoft Clarity Analytics Configuration / Microsoft Clarity アクセス解析設定 */
  clarity: {
    enable: getEnv("CLARITY_ENABLE")?.toUpperCase() === "TRUE",
    projectId: getEnv("CLARITY_PROJECT_ID") || "",
  },

  /** 是否在 Header 中显示 Logo / Whether to display logo in header / ヘッダーにロゴを表示するかどうか */
  isShowLogo: true,

  /** 代码块高亮主题 / Code Block Themes / コードブロックテーマ */
  codeTheme: {
    light: "light-plus" as ThemeObjectOrShikiThemeName,
    dark: "dark-plus" as ThemeObjectOrShikiThemeName,
  },
} satisfies SiteConfigType;

export interface SiteConfigType {
  defaultLanguage: string;

  ogImage?: string;

  languageNameMap: Record<string, string>;

  siteUrl: string;

  basePath: string;

  allowRobots: boolean;

  cookieMaxAgeDays: "session" | "none" | number;

  postsPerPage: number;

  navLinks?: {
    href: string;
    titleKey: "home" | "projects" | "about" | "search" | (string & {});
  }[];

  disqus: {
    enable: boolean;
    shortname: string;
  };

  clarity: {
    enable: boolean;
    projectId: string;
  };

  isShowLogo: boolean;

  codeTheme: {
    light: ThemeObjectOrShikiThemeName;
    dark: ThemeObjectOrShikiThemeName;
  };
}

export const SITE_URL_WITH_BASE = new URL(
  `${SiteConfig.siteUrl}${SiteConfig.basePath}`,
).href.replace(/\/+$/, "");

export const COOKIE_MAX_AGE: number | undefined = (() => {
  const value = SiteConfig.cookieMaxAgeDays;
  if (typeof value === "number" && value >= 0) {
    return value * 3600 * 24;
  }
  if (value === "none") {
    return 0;
  }
  return undefined;
})();

export default SiteConfig;
