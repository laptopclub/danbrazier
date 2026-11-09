import { SanityImage, type ImageConfig } from "@laptopclub/foundation-ui";
import Link from "next/link";
import { formatArticleDate } from "../lib/article-date";
import { getDisplayHighlights, type HighlightsData } from "../lib/highlights";
import { Parallax } from "./parallax";

export function Highlights({ block, imageConfig }: { block: HighlightsData; imageConfig: ImageConfig }) {
  const articles = getDisplayHighlights(block).map((article) => ({ ...article, formattedDate: formatArticleDate(article.publishedAt) }));
  if (!articles.length) return null;
  const heading = block.heading || "Highlights";

  return (
    <section className="relative mx-auto max-w-7xl overflow-visible px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute left-6 top-1/2 z-0 -translate-y-full sm:left-[clamp(-8rem,calc((80rem-100vw)/4+2rem),2rem)]"><Parallax className="whitespace-nowrap font-heading text-[clamp(6rem,20vw,16rem)] font-bold leading-none tracking-[-0.08em] text-neutral-950 opacity-[0.07]" speed={42}>{heading}</Parallax></div>
      <div className="relative z-10 grid gap-5 md:grid-cols-2 md:items-end md:gap-10"><h2 className="font-heading text-4xl font-normal tracking-tight text-neutral-950 sm:text-5xl">{heading}</h2>{block.description ? <p className="max-w-xl text-lg leading-8 text-neutral-700">{block.description}</p> : null}</div>
      <div className="relative z-10 mt-10 space-y-12 sm:space-y-16">{articles.map((article, index) => <article className="grid items-center gap-6 md:grid-cols-2 md:gap-12" key={article.slug}>{article.coverImage ? <div className={`overflow-hidden rounded-2xl ${index % 2 ? "md:order-2" : ""}`}><SanityImage className="aspect-[4/3] w-full object-cover" config={imageConfig} image={article.coverImage} sizes="(min-width: 768px) 50vw, 100vw" /></div> : null}<div className={!article.coverImage && index % 2 === 0 ? "md:col-start-2" : undefined}>{article.formattedDate ? <time className="font-button block text-sm text-slate-500" dateTime={article.publishedAt ?? undefined}>{article.formattedDate}</time> : null}<h3 className="font-heading-mono mt-2 text-2xl font-normal tracking-tight text-neutral-950 sm:text-3xl"><Link className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" href={`/notes/${article.slug}`}>{article.title}</Link></h3>{article.excerpt ? <p className="mt-4 text-base leading-7 text-neutral-700">{article.excerpt}</p> : null}</div></article>)}</div>
    </section>
  );
}
