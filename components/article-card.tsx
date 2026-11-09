import { SanityImage, type ImageConfig, type SanityImageData } from "@laptopclub/foundation-ui";
import Link from "next/link";
import { formatArticleDate } from "../lib/article-date";

export type ArticleSummary = {
  coverImage?: SanityImageData | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  slug?: string | null;
  title?: string | null;
  topics?: string[] | null;
};

export function ArticleCard({ article, imageConfig, variant }: { article: ArticleSummary; imageConfig: ImageConfig; variant: "recent" | "archive" }) {
  if (!article.slug || !article.title) return null;
  const isRecent = variant === "recent";
  const Heading = isRecent ? "h3" : "h2";
  const date = formatArticleDate(article.publishedAt);

  return (
    <article className={isRecent ? "h-full" : undefined}>
      <Link className={`group block rounded-2xl border border-neutral-200 bg-white/90 p-6 transition hover:border-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950 ${isRecent ? "h-full shadow-sm hover:-translate-y-1 hover:shadow-lg" : ""}`} href={`/notes/${article.slug}`}>
        {!isRecent && article.coverImage ? <SanityImage className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" config={imageConfig} image={article.coverImage} sizes="(min-width: 1024px) 66vw, 100vw" /> : null}
        {date ? <time className="font-button text-sm text-slate-500" dateTime={article.publishedAt ?? undefined}>{date}</time> : null}
        <Heading className={isRecent ? "font-heading-mono mt-2 text-2xl font-normal tracking-tight text-neutral-950 group-hover:text-neutral-600" : "font-heading-mono mt-3 text-2xl font-normal tracking-tight group-hover:text-brand-700"}>{article.title}</Heading>
        {article.excerpt ? <p className={isRecent ? "mt-3 text-sm leading-6 text-neutral-700" : "mt-3 leading-7 text-slate-600"}>{article.excerpt}</p> : null}
      </Link>
    </article>
  );
}
