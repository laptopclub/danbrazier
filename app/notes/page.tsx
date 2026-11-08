import { articlesQuery } from "@laptopclub/foundation-cms/queries";
import { SanityImage, type SanityImageData } from "@laptopclub/foundation-ui";
import type { Metadata } from "next";
import Link from "next/link";
import { env } from "../../lib/env";
import { sanityClient } from "../../lib/sanity";
import { getSiteSettings } from "../../lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { description: "Notes on commerce, technology and rebuilding things carefully.", title: "Notes" };

type ArticleSummary = {
  coverImage?: SanityImageData;
  excerpt?: string;
  publishedAt?: string;
  slug?: string;
  title?: string;
  topics?: string[];
};

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default async function NotesPage() {
  const client = sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false, perspective: "published" });
  const [articles, selectedArticles, site] = await Promise.all([
    client.fetch<ArticleSummary[]>(articlesQuery),
    client.fetch<Array<ArticleSummary | null> | null>(`*[_id == "notesSettings"][0].featuredArticles[]->{title, "slug": slug.current}`),
    getSiteSettings({ stega: false })
  ]);
  const imageConfig = { dataset: env.sanity.dataset, projectId: env.sanity.projectId };

  return <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28"><header className="grid gap-5 md:grid-cols-2 md:gap-10"><h1 className="text-4xl font-normal tracking-tight sm:text-6xl">{site.notesHeading ?? "Notes"}</h1><p className="max-w-xl text-xl leading-8 text-slate-600">{site.notesDescription ?? "Notes on commerce, technology and rebuilding things carefully."}</p></header><div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><div className="grid content-start gap-10">{articles.map((article) => article.slug ? <article key={article.slug} className="border-t border-slate-200 pt-6">{article.coverImage ? <SanityImage className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" config={imageConfig} image={article.coverImage} sizes="(min-width: 768px) 50vw, 100vw" /> : null}<p className="font-button text-sm text-slate-500">{formatDate(article.publishedAt)}</p><h2 className="font-heading-mono mt-3 text-2xl font-normal tracking-tight"><Link className="hover:text-brand-700" href={`/notes/${article.slug}`}>{article.title}</Link></h2>{article.excerpt ? <p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p> : null}</article> : null)}</div>{selectedArticles?.length ? <aside aria-labelledby="selected-notes-heading" className="border-t border-slate-300 pt-6 lg:sticky lg:top-8 lg:self-start"><h2 id="selected-notes-heading" className="text-2xl font-normal tracking-tight">Selected notes</h2><ol className="mt-6 space-y-5">{selectedArticles.filter((article): article is ArticleSummary => Boolean(article?.slug && article.title)).slice(0, 5).map((article) => article.slug && article.title ? <li key={article.slug}><Link className="font-heading-mono text-base text-neutral-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" href={`/notes/${article.slug}`}>{article.title}</Link></li> : null)}</ol></aside> : null}</div></div>;
}
