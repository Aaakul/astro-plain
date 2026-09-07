import rss from "@astrojs/rss";
import { SITE_URL_WITH_BASE } from "~/site.config";
import { AVAILABLE_LANG, getTranslation, type Lang } from "~/i18n";
import type { APIRoute } from "astro";
import { getBlog, getAuthorName } from "~/lib/content-utils";

// Generates an RSS feed route for each supported language
export async function getStaticPaths() {
  return AVAILABLE_LANG.map((lang) => ({
    params: { lang: lang },
  }));
}

/** Generates localized RSS 2.0 feed with Dublin Core metadata */
export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const t = await getTranslation(lang, "common");

  const posts = await getBlog(lang);
  const siteChannelUrl = `${SITE_URL_WITH_BASE}/${lang}/`;
  const selfFeedUrl = `${SITE_URL_WITH_BASE}/${lang}/rss.xml`;

  const items = await Promise.all(
    posts.map(async ({ id, data }) => {
      const authorNames = await Promise.all(
        data.authors.map((authorId) => getAuthorName(lang, authorId)),
      );
      const postUrl = encodeURI(`${SITE_URL_WITH_BASE}/${lang}/blog/${id}/`);

      return {
        title: data.title,
        pubDate: data.date,
        description: data.summary || data.title,
        link: postUrl,
        categories: data.categories || [],
        customData: `<dc:creator><![CDATA[${authorNames.join(", ")}]]></dc:creator>`,
      };
    }),
  );

  return rss({
    title: t("site_title"),
    description: t("site_description"),
    site: siteChannelUrl,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
      dc: "http://purl.org/dc/elements/1.1/",
    },
    customData: [
      `<language>${lang}</language>`,
      `<atom:link href="${selfFeedUrl}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    items,
  });
};
