import { sitemapArticlesQuery, sitemapPagesQuery } from "@laptopclub/foundation-cms/queries";
import type { MetadataRoute } from "next";
import { env } from "../lib/env";
import { sanityClient } from "../lib/sanity";

export const dynamic = "force-dynamic";

type SitemapPage = {
  _updatedAt?: string;
  slug?: string;
};

function getPageUrl(slug: string): string {
  const path = slug === "home" ? "/" : `/${slug}`;
  return new URL(path, env.siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (env.sanity.projectId === "placeholder") {
    return [{ url: new URL("/", env.siteUrl).toString() }];
  }

  const client = sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false });
  const [pages, articles] = await Promise.all([
    client.fetch<SitemapPage[]>(sitemapPagesQuery, {}, { perspective: "published", stega: false, cache: "no-store" }),
    client.fetch<SitemapPage[]>(sitemapArticlesQuery, {}, { perspective: "published", stega: false, cache: "no-store" })
  ]);

  return [
    { url: new URL("/notes", env.siteUrl).toString() },
    ...pages.flatMap((page) => {
    if (!page.slug) {
      return [];
    }

    return [
      {
        lastModified: page._updatedAt ? new Date(page._updatedAt) : undefined,
        url: getPageUrl(page.slug)
      }
    ];
    }),
    ...articles.flatMap((article) => article.slug ? [{ lastModified: article._updatedAt ? new Date(article._updatedAt) : undefined, url: new URL(`/notes/${article.slug}`, env.siteUrl).toString() }] : [])
  ];
}
