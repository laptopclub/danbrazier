import { articlesQuery, homePageQuery } from "@laptopclub/foundation-cms/queries";
import { BlockRenderer, type PageBlock } from "@laptopclub/foundation-ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteBlockRegistry } from "../lib/blocks";
import { env } from "../lib/env";
import { sanityClient } from "../lib/sanity";
import { getSiteSettings } from "../lib/site";
import type { PageBySlugQueryResult } from "../lib/sanity-query-types";

export const dynamic = "force-dynamic";

type PageData = NonNullable<PageBySlugQueryResult>;

type ArticleSummary = {
  excerpt?: string;
  publishedAt?: string;
  slug?: string;
  title?: string;
  topics?: string[];
};

async function getHomePage(): Promise<PageData | null> {
  if (env.sanity.projectId === "placeholder") {
    return null;
  }

  return sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false }).fetch<PageBySlugQueryResult>(homePageQuery);
}

async function getLatestArticles(): Promise<ArticleSummary[]> {
  if (env.sanity.projectId === "placeholder") {
    return [];
  }

  return (await sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false }).fetch<ArticleSummary[]>(articlesQuery)).slice(0, 3);
}

function LatestArticles({ articles, notesHeading = "Notes", notesLinkLabel = "View all notes" }: { articles: ArticleSummary[]; notesHeading?: string; notesLinkLabel?: string }) {
  if (!articles.length) {
    return null;
  }

  return <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16"><div className="flex items-end justify-between gap-6"><h2 className="font-heading text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">{notesHeading}</h2><Link className="text-sm font-semibold text-neutral-950 underline underline-offset-4" href="/notes">{notesLinkLabel}</Link></div><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => article.slug ? <Link className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-neutral-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" href={`/notes/${article.slug}`} key={article.slug}><p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{article.topics?.[0] ?? "Note"}</p><h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-neutral-950 group-hover:text-neutral-600">{article.title}</h3>{article.excerpt ? <p className="mt-3 text-sm leading-6 text-neutral-700">{article.excerpt}</p> : null}</Link> : null)}</div></section>;
}

export default async function HomePage() {
  const [page, articles, site] = await Promise.all([getHomePage(), getLatestArticles(), getSiteSettings({ stega: false })]);

  if (!page?.blocks?.length) {
    notFound();
  }

  return <><BlockRenderer blocks={page.blocks as PageBlock[]} imageConfig={{ dataset: env.sanity.dataset, projectId: env.sanity.projectId }} registry={siteBlockRegistry} /><LatestArticles articles={articles} notesHeading={site.notesHeading} notesLinkLabel={site.notesLinkLabel} /></>;
}
