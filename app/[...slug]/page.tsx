import { allPageSlugsQuery, pageBySlugQuery } from "@laptopclub/foundation-cms/queries";
import { BlockRenderer, type PageBlock } from "@laptopclub/foundation-ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioEntryPage } from "../../components/portfolio-entry";
import { siteBlockRegistry } from "../../lib/blocks";
import { env } from "../../lib/env";
import { sanityFetch } from "../../lib/live";
import { getPortfolioEntry } from "../../lib/portfolio";
import { getSiteSettings } from "../../lib/site";
import type { AllPageSlugsQueryResult, PageBySlugQueryResult } from "../../lib/sanity-query-types";

type PageData = NonNullable<PageBySlugQueryResult>;

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function hasSanityProject(): boolean {
  return env.sanity.projectId !== "placeholder";
}

function slugSegmentsToPath(slug: string[]): string {
  return slug.join("/");
}

function slugPathToSegments(slug: string): string[] {
  return slug.split("/").filter(Boolean);
}

async function getPage(slug: string, { stega = true }: { stega?: boolean } = {}): Promise<PageData | null> {
  if (!hasSanityProject()) {
    return null;
  }

  const { data } = await sanityFetch({ params: { slug }, query: pageBySlugQuery, stega });
  return data as PageBySlugQueryResult;
}

export async function generateStaticParams() {
  if (!hasSanityProject()) {
    return [];
  }

  const { data } = await sanityFetch({ perspective: "published", query: allPageSlugsQuery, stega: false });

  return (data as AllPageSlugsQueryResult).flatMap((page) => {
    if (!page.slug || page.slug === "home") {
      return [];
    }

    return [{ slug: slugPathToSegments(page.slug) }];
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = slugSegmentsToPath((await params).slug);
  const fallbackEntry = getPortfolioEntry(slug);
  const [page, site] = await Promise.all([getPage(slug, { stega: false }), getSiteSettings({ stega: false })]);

  return {
    description: page?.seo?.description ?? fallbackEntry?.excerpt ?? site.description,
    robots: page?.seo?.noIndex ? { follow: false, index: false } : undefined,
    title: page?.seo?.title ?? page?.title ?? fallbackEntry?.title ?? site.title
  };
}

export default async function CmsPage({ params }: PageProps) {
  const slug = slugSegmentsToPath((await params).slug);
  const page = await getPage(slug);

  if (page && page.slug !== "home") {
    const imageConfig = { dataset: env.sanity.dataset, projectId: env.sanity.projectId };

    return (
      <BlockRenderer
        blocks={page.blocks?.length ? (page.blocks as PageBlock[]) : []}
        imageConfig={imageConfig}
        registry={siteBlockRegistry}
      />
    );
  }

  const fallbackEntry = getPortfolioEntry(slug);

  if (!fallbackEntry) {
    notFound();
  }

  return <PortfolioEntryPage entry={fallbackEntry} />;
}
