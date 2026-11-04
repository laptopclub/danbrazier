import { homePageQuery } from "@laptopclub/foundation-cms/queries";
import { BlockRenderer, type PageBlock } from "@laptopclub/foundation-ui";
import Link from "next/link";
import { siteBlockRegistry } from "../lib/blocks";
import { env } from "../lib/env";
import { sanityFetch } from "../lib/live";
import { portfolioEntries } from "../lib/portfolio";
import type { PageBySlugQueryResult } from "../lib/sanity-query-types";

type PageData = NonNullable<PageBySlugQueryResult>;

async function getHomePage(): Promise<PageData | null> {
  if (env.sanity.projectId === "placeholder") {
    return null;
  }

  const { data } = await sanityFetch({ query: homePageQuery });
  return data as PageBySlugQueryResult;
}

function PortfolioFallback() {
  return (
    <>
      <section className="border-b border-neutral-200 px-6 py-28 sm:px-10 sm:py-40 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-6xl font-heading text-display text-neutral-950">Things &amp; stuff</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-700 sm:text-xl">
            Strategy, craft and execution. Engineering, music, photography, writing and personal projects.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <h2 className="font-heading text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">Everything</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioEntries.map((entry) => (
            <Link
              className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-neutral-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
              href={`/${entry.slug}`}
              key={entry.slug}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{entry.category}</p>
              <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-neutral-950 group-hover:text-neutral-600">{entry.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{entry.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default async function HomePage() {
  const page = await getHomePage();

  if (!page?.blocks?.length) {
    return <PortfolioFallback />;
  }

  return (
    <BlockRenderer
      blocks={page.blocks as PageBlock[]}
      imageConfig={{ dataset: env.sanity.dataset, projectId: env.sanity.projectId }}
      registry={siteBlockRegistry}
    />
  );
}
