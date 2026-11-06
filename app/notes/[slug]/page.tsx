import { allArticleSlugsQuery, articleBySlugQuery } from "@laptopclub/foundation-cms/queries";
import { ArticlePage, type ArticleData } from "@laptopclub/foundation-ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return { description: article?.seo?.description ?? article?.excerpt ?? site.description, robots: article?.seo?.noIndex ? { follow: false, index: false } : undefined, title: article?.seo?.title ?? article?.title ?? site.title };
}

export default async function ArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  return <ArticlePage article={article} imageConfig={{ dataset: env.sanity.dataset, projectId: env.sanity.projectId }} />;
}
