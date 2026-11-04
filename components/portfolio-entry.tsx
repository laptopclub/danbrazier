import Link from "next/link";
import type { PortfolioEntry } from "../lib/portfolio";

export function PortfolioEntryPage({ entry }: { entry: PortfolioEntry }) {
  return (
    <article className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
      <Link
        className="text-sm font-semibold text-neutral-600 underline underline-offset-4 hover:text-neutral-950"
        href="/"
      >
        Back to everything
      </Link>
      <div className="mt-12 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-500">
        <span className="font-bold uppercase tracking-[0.2em]">{entry.category}</span>
        <time>{entry.date}</time>
      </div>
      <h1 className="mt-3 font-heading text-h1 text-neutral-950">{entry.title}</h1>
      <p className="mt-6 max-w-2xl text-xl leading-8 text-neutral-700">{entry.excerpt}</p>
      <div className="mt-12 border-t border-neutral-200 pt-8 text-neutral-700">
        <p>
          This page is ready for its migrated Sanity content. The published
          Storyblok entry has been inventoried for the migration and can be
          imported once the new Sanity project is provisioned.
        </p>
      </div>
    </article>
  );
}
