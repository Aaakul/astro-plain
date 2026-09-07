import zhHans, { type Translation, type TranslationSchema } from "./messages/zh-Hans";
import enUS from "./messages/en-US";
import jaJP from "./messages/ja-JP";
import type { Lang } from "./";

const translations: Record<Lang, TranslationSchema> = {
  "zh-Hans": zhHans,
  "en-US": enUS,
  "ja-JP": jaJP,
};

// Top-level object keys used as namespaces (e.g. 'common', 'nav')
type NamespaceKeys = {
  [K in keyof Translation]: Translation[K] extends object ? K : never;
}[keyof Translation];

export type TranslationNamespace = NamespaceKeys;

// Extracts placeholder variable names inside curly braces, e.g. '{name}' -> 'name'
type ExtractPlaceholders<S> = S extends `${string}{${infer P}}${infer Rest}`
  ? P | ExtractPlaceholders<Rest>
  : never;

// Resolves the value type at a given dot-separated path within object T
type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ValueAtPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Type-safe parameter object based on placeholders detected in the translation string
export type TranslationParams<K extends string> = {
  [P in ExtractPlaceholders<ValueAtPath<Translation, K>>]: string | number;
};

/**
 * Returns a type-safe translation function for the specified language and optional namespace.
 *
 * @example
 * const t = await getTranslation("en-US");
 * const about = t("common.about");
 *
 * // With namespace:
 * const u = await getTranslation("en-US", "common");
 * const about = u("about");
 *
 * // With template parameters (e.g. "Hello {name}"):
 * const greeting = u("greeting", { name: "Alice" });
 */
export const getTranslation = async <N extends TranslationNamespace | undefined = undefined>(
  lang: Lang,
  namespace?: N,
) => {
  const translation = translations[lang] || translations["zh-Hans"];

  // Helper to safely traverse nested translation objects by dot-separated path
  const resolve = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  return <K extends string>(
    key: K,
    params?: N extends TranslationNamespace ? TranslationParams<`${N}.${K}`> : TranslationParams<K>,
  ): string => {
    const fullKey = (namespace ? `${namespace}.${key}` : key) as string;
    const value = resolve(translation, fullKey);

    if (typeof value === "string") {
      let result = value;
      // Replace `{key}` placeholders with provided param values
      if (params && Object.keys(params).length > 0) {
        Object.entries(params as Record<string, string>).forEach(([k, v]) => {
          result = result.replace(new RegExp(`{${k}}`, "g"), v);
        });
      }
      return result;
    }

    return `Missing translation: ${fullKey}`;
  };
};

export type { Translation, TranslationSchema };
