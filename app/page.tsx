import { articleSummaryFields, articlesQuery, homePageQuery } from "@laptopclub/foundation-cms/queries";
import { BlockRenderer } from "@laptopclub/foundation-ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, type ArticleSummary } from "../components/article-card";
import { Parallax } from "../components/parallax";
import { Highlights } from "../components/highlights";
import type { HighlightsData } from "../lib/highlights";
import { siteBlockRegistry } from "../lib/blocks";
import { env } from "../lib/env";
import { sanityClient } from "../lib/sanity";
import { getSiteSettings } from "../lib/site";
import type { PageBySlugQueryResult } from "../lib/sanity-query-types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

type PageData = NonNullable<PageBySlugQueryResult>;

async function getHomePage(): Promise<PageData | null> {
  if (env.sanity.projectId === "placeholder") {
    return null;
  }

  return sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false }).fetch<PageBySlugQueryResult>(homePageQuery);
}

async function getHighlights(): Promise<HighlightsData[]> {
  if (env.sanity.projectId === "placeholder") return [];
  const client = sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false, perspective: "published" });
  return (await client.fetch<HighlightsData[] | null>(`*[_type == "page" && (_id == "page.home" || slug.current == "home")][0].blocks[_type == "highlightsBlock"]{
    _key, heading, description,
    "articles": articles[]->${articleSummaryFields}
  }`, {}, { stega: false, cache: "no-store" })) ?? [];
}

async function getLatestArticles(): Promise<ArticleSummary[]> {
  if (env.sanity.projectId === "placeholder") {
    return [];
  }

  return sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false }).fetch<ArticleSummary[]>(articlesQuery);
}

function LatestArticles({ articles, notesHeading = "Notes", notesDescription, notesLinkLabel = "View all notes" }: { articles: ArticleSummary[]; notesHeading?: string; notesDescription?: string; notesLinkLabel?: string }) {
  if (!articles.length) {
    return null;
  }

  return <section className="relative mx-auto max-w-7xl overflow-visible px-6 py-20 sm:px-10 sm:py-24 lg:px-16"><div aria-hidden="true" className="pointer-events-none absolute left-6 top-1/2 z-0 -translate-y-full sm:left-[clamp(-8rem,calc((80rem-100vw)/4+2rem),2rem)]"><Parallax className="whitespace-nowrap font-heading text-[clamp(6rem,20vw,16rem)] font-bold leading-none tracking-[-0.08em] text-neutral-950 opacity-[0.07]" speed={42}>{notesHeading}</Parallax></div><div className="relative z-10 grid gap-5 md:grid-cols-2 md:items-end md:gap-10"><h2 className="font-heading text-4xl font-normal tracking-tight text-neutral-950 sm:text-5xl">Recent notes</h2>{notesDescription ? <p className="max-w-xl text-lg leading-8 text-neutral-700">{notesDescription}</p> : null}</div><div className="relative z-10 mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => article.slug ? <ArticleCard article={article} imageConfig={{ dataset: env.sanity.dataset, projectId: env.sanity.projectId }} key={article.slug} variant="recent" /> : null)}</div><div className="relative z-10 mt-10 text-center"><Link className="font-button inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm text-white transition hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" href="/notes">{notesLinkLabel}</Link></div></section>;
}

export default async function HomePage() {
  const [page, articles, highlights, site] = await Promise.all([getHomePage(), getLatestArticles(), getHighlights(), getSiteSettings({ stega: false })]);

  if (!page?.blocks?.length) {
    notFound();
  }

  const blocks = page.blocks as Array<{ _key?: string; _type: string }>;
  const quoteBlocks = blocks.filter((block) => block._type === "randomQuoteBlock");
  const contentBlocks = blocks.filter((block) => block._type !== "randomQuoteBlock" && block._type !== "highlightsBlock");
  const highlightBlocks = blocks.filter((block) => block._type === "highlightsBlock");
  const imageConfig = { dataset: env.sanity.dataset, projectId: env.sanity.projectId };
  const highlightsByKey = new Map(highlights.map((block) => [block._key, block]));
  const highlightedSlugs = new Set(highlights.flatMap((block) => (block.articles ?? []).flatMap((article) => article?.slug ? [article.slug] : [])));
  const recentArticles = articles.filter((article) => !article.slug || !highlightedSlugs.has(article.slug)).slice(0, 3);

  return <>{contentBlocks.some((block) => block._type === "heroBlock") ? null : <h1 className="sr-only">Dan Brazier</h1>}{contentBlocks.map((block, index) => <div className={block._key === "HeythereImDa" ? "home-intro" : undefined} key={block._key ?? `${block._type}-${index}`}><BlockRenderer blocks={[block]} imageConfig={imageConfig} registry={siteBlockRegistry} /></div>)}<LatestArticles articles={recentArticles} notesHeading={site.notesHeading} notesDescription={site.notesDescription} notesLinkLabel={site.notesLinkLabel} />{highlightBlocks.map((block) => {
    const highlight = block._key ? highlightsByKey.get(block._key) : undefined;
    return highlight ? <Highlights block={highlight} imageConfig={imageConfig} key={highlight._key} /> : null;
  })}<BlockRenderer blocks={quoteBlocks} imageConfig={imageConfig} registry={siteBlockRegistry} /></>;
}
