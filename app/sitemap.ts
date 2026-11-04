import { sitemapPagesQuery } from "@laptopclub/foundation-cms/queries";
import type { MetadataRoute } from "next";
import { env } from "../lib/env";
import { portfolioEntries } from "../lib/portfolio";
import { sanityClient } from "../lib/sanity";

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
    return ["/", ...portfolioEntries.map((entry) => `/${entry.slug}`)].map((path) => ({
      url: new URL(path, env.siteUrl).toString()
    }));
  }

  const pages = await sanityClient.fetch<SitemapPage[]>(sitemapPagesQuery, {}, { perspective: "published", stega: false });

  return pages.flatMap((page) => {
    if (!page.slug) {
      return [];
    }

    return [
      {
        lastModified: page._updatedAt ? new Date(page._updatedAt) : undefined,
        url: getPageUrl(page.slug)
      }
    ];
  });
}
