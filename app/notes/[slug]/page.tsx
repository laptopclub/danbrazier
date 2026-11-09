import { allArticleSlugsQuery, articleBySlugQuery } from "@laptopclub/foundation-cms/queries";
import type { ArticleData } from "@laptopclub/foundation-ui";
import type { Metadata } from "next";
import { groq, stegaClean } from "next-sanity";
import { notFound } from "next/navigation";
import { NoteArticle } from "../../../components/note-article";
import { env } from "../../../lib/env";
import { sanityFetch } from "../../../lib/live";
import { getSiteSettings } from "../../../lib/site";

export const dynamic = "force-dynamic";

type Article = ArticleData & { seo?: { description?: string; noIndex?: boolean; title?: string } };

async function getArticle(slug: string, stega = true): Promise<Article | null> {
  const { data } = await sanityFetch({ params: { slug }, query: articleBySlugQuery, stega });
  return data as Article | null;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({ perspective: "published", query: allArticleSlugsQuery, stega: false });
  return (data as Array<{ slug?: string }>).flatMap((article) => article.slug ? [{ slug: article.slug }] : []);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [article, site] = await Promise.all([getArticle(slug, false), getSiteSettings({ stega: false })]);
  return { alternates: { canonical: `/notes/${encodeURIComponent(slug)}` }, description: article?.seo?.description ?? article?.excerpt ?? site.description, robots: article?.seo?.noIndex ? { follow: false, index: false } : undefined, title: article?.seo?.title ?? article?.title ?? site.title };
}

export default async function ArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, video] = await Promise.all([
    getArticle(slug),
    sanityFetch({ params: { slug }, query: groq`*[_type == "article" && slug.current == $slug][0]{linkedinVideoActivityId}`, stega: true })
  ]);
  if (!article) notFound();
  const videoData = video.data as { linkedinVideoActivityId?: string | null } | null;
  return <NoteArticle article={article} imageConfig={{ dataset: env.sanity.dataset, projectId: env.sanity.projectId }} linkedinVideoActivityId={stegaClean(videoData?.linkedinVideoActivityId)} slug={slug} />;
}
