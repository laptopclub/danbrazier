import { SanityImage, type ImageConfig } from "@laptopclub/foundation-ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatArticleDate } from "../lib/article-date";
import { getDisplayHighlights, type HighlightsData } from "../lib/highlights";
import { SectionHeading } from "./section-heading";

export function Highlights({ block, imageConfig }: { block: HighlightsData; imageConfig: ImageConfig }) {
  const articles = getDisplayHighlights(block).map((article) => ({ ...article, formattedDate: formatArticleDate(article.publishedAt) }));
  if (!articles.length) return null;
  const heading = block.heading || "Highlights";

  return (
    <section className="relative mx-auto max-w-7xl overflow-visible px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div className="relative z-10 grid gap-5 md:grid-cols-2 md:items-end md:gap-10"><SectionHeading heading={heading} />{block.description ? <p className="max-w-xl text-lg leading-8 text-neutral-700">{block.description}</p> : null}</div>
      <div className="relative z-10 mt-10 space-y-12 sm:space-y-16">
        {articles.map((article, index) => {
          const offset = Math.sin(index * Math.PI / 3 - Math.PI / 3) * 3.5;
          const style: CSSProperties & { "--highlight-offset": string } = { "--highlight-offset": `${offset.toFixed(3)}rem` };
          const imageRight = index % 2 === 1;
          const columns = article.coverImage ? imageRight ? "lg:grid-cols-[minmax(0,1fr)_18rem]" : "lg:grid-cols-[18rem_minmax(0,1fr)]" : "lg:max-w-xl";

          return (
            <article className={`mx-auto grid max-w-4xl items-center gap-6 lg:translate-x-[var(--highlight-offset)] lg:gap-10 ${columns}`} key={article.slug} style={style}>
              {article.coverImage ? <div className={`overflow-hidden rounded-2xl ${imageRight ? "lg:order-2" : ""}`}><SanityImage className="aspect-[4/3] w-full object-cover" config={imageConfig} image={article.coverImage} sizes="(min-width: 1024px) 288px, (min-width: 896px) 896px, 100vw" /></div> : null}
              <div>
                {article.formattedDate ? <time className="font-button block text-sm text-slate-500" dateTime={article.publishedAt ?? undefined}>{article.formattedDate}</time> : null}
                <h3 className="font-heading-mono mt-2 text-2xl font-normal tracking-tight text-neutral-950 sm:text-3xl"><Link className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" href={`/notes/${article.slug}`}>{article.title}</Link></h3>
                {article.excerpt ? <p className="mt-4 text-base leading-7 text-neutral-700">{article.excerpt}</p> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
