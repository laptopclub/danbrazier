import { SanityImage, type ImageConfig, type SanityImageData } from "@laptopclub/foundation-ui";
import Link from "next/link";

export type ArticleSummary = {
  coverImage?: SanityImageData | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  slug?: string | null;
  title?: string | null;
  topics?: string[] | null;
};

function formatDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function ArticleCard({ article, imageConfig, variant }: { article: ArticleSummary; imageConfig: ImageConfig; variant: "recent" | "archive" }) {
  if (!article.slug || !article.title) return null;
  const isRecent = variant === "recent";
  const Heading = isRecent ? "h3" : "h2";
  const date = formatDate(article.publishedAt);

  return (
    <article className={isRecent ? "h-full" : "border-t border-slate-200 pt-6"}>
      <Link className={isRecent ? "group block h-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-neutral-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" : "group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"} href={`/notes/${article.slug}`}>
        {!isRecent && article.coverImage ? <SanityImage className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" config={imageConfig} image={article.coverImage} sizes="(min-width: 1024px) 66vw, 100vw" /> : null}
        {!isRecent && date ? <time className="font-button text-sm text-slate-500" dateTime={article.publishedAt ?? undefined}>{date}</time> : null}
        <Heading className={isRecent ? "font-heading-mono mt-2 text-2xl font-normal tracking-tight text-neutral-950 group-hover:text-neutral-600" : "font-heading-mono mt-3 text-2xl font-normal tracking-tight group-hover:text-brand-700"}>{article.title}</Heading>
        {article.excerpt ? <p className={isRecent ? "mt-3 text-sm leading-6 text-neutral-700" : "mt-3 leading-7 text-slate-600"}>{article.excerpt}</p> : null}
      </Link>
    </article>
  );
}
