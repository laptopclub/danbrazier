import { SanityImage, type ImageConfig, type SanityImageData } from "@laptopclub/foundation-ui";
import Link from "next/link";
import { Parallax } from "./parallax";

export type HighlightArticle = { slug?: string | null; title?: string | null; excerpt?: string | null; coverImage?: SanityImageData | null };
export type HighlightsData = { _key: string; heading?: string | null; description?: string | null; articles?: Array<HighlightArticle | null> | null };

export function Highlights({ block, imageConfig }: { block: HighlightsData; imageConfig: ImageConfig }) {
  const articles = (block.articles ?? []).filter((article): article is HighlightArticle & { slug: string; title: string } => Boolean(article?.slug && article.title)).slice(0, 6);
  if (!articles.length) return null;
  const heading = block.heading || "Highlights";

  return (
    <section className="relative mx-auto max-w-7xl overflow-visible px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute left-6 top-1/2 z-0 -translate-y-full sm:left-[clamp(-8rem,calc((80rem-100vw)/4+2rem),2rem)]"><Parallax className="whitespace-nowrap font-heading text-[clamp(6rem,20vw,16rem)] font-bold leading-none tracking-[-0.08em] text-neutral-950 opacity-[0.07]" speed={42}>{heading}</Parallax></div>
      <div className="relative z-10 grid gap-5 md:grid-cols-2 md:items-end md:gap-10"><h2 className="font-heading text-4xl font-normal tracking-tight text-neutral-950 sm:text-5xl">{heading}</h2>{block.description ? <p className="max-w-xl text-lg leading-8 text-neutral-700">{block.description}</p> : null}</div>
      <div className="relative z-10 mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <Link className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-neutral-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" href={`/notes/${article.slug}`} key={article.slug}>{article.coverImage ? <SanityImage className="aspect-[16/9] w-full object-cover" config={imageConfig} image={article.coverImage} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" /> : null}<div className="p-6"><h3 className="font-heading-mono text-2xl font-normal tracking-tight text-neutral-950 group-hover:text-neutral-600">{article.title}</h3>{article.excerpt ? <p className="mt-3 text-sm leading-6 text-neutral-700">{article.excerpt}</p> : null}</div></Link>)}</div>
    </section>
  );
}
