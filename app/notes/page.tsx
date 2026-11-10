import { articlesQuery } from "@laptopclub/foundation-cms/queries";
import type { Metadata } from "next";
import { ArticleCard, type ArticleSummary } from "../../components/article-card";
import { ImageParallax } from "../../components/image-parallax";
import { SelectedNotes } from "../../components/selected-notes";
import { env } from "../../lib/env";
import { sanityClient } from "../../lib/sanity";
import { getSiteSettings } from "../../lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/notes" }, description: "Notes on commerce, technology and rebuilding things carefully.", title: "Notes" };

export default async function NotesPage() {
  const client = sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false, perspective: "published" });
  const [articles, site] = await Promise.all([
    client.fetch<ArticleSummary[]>(articlesQuery),
    getSiteSettings({ stega: false })
  ]);
  const imageConfig = { dataset: env.sanity.dataset, projectId: env.sanity.projectId };

  return <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-16"><header className="grid gap-5 md:grid-cols-2 md:items-end md:gap-10"><h1 className="text-4xl font-normal tracking-tight sm:text-6xl">{site.notesHeading ?? "Notes"}</h1><p className="max-w-xl text-xl leading-8 text-slate-600">{site.notesDescription ?? "Notes on commerce, technology and rebuilding things carefully."}</p></header><div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><ImageParallax className="grid content-start gap-10">{articles.map((article) => article.slug ? <ArticleCard article={article} imageConfig={imageConfig} key={article.slug} variant="archive" /> : null)}</ImageParallax><SelectedNotes /></div></div>;
}
