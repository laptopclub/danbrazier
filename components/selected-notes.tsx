import Link from "next/link";
import { env } from "../lib/env";
import { sanityClient } from "../lib/sanity";

type SelectedArticle = { slug?: string | null; title?: string | null };

export async function SelectedNotes({ currentSlug }: { currentSlug?: string }) {
  if (env.sanity.projectId === "placeholder") return null;

  const client = sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false, perspective: "published" });
  const articles = await client.fetch<Array<SelectedArticle | null> | null>(
    `*[_id == "notesSettings"][0].featuredArticles[]->{title, "slug": slug.current}`
  );
  const selected = (articles ?? []).filter((article): article is SelectedArticle & { slug: string; title: string } => Boolean(article?.slug && article.title)).slice(0, 5);
  if (!selected.length) return null;

  return (
    <aside aria-labelledby="selected-notes-heading" className="border-t border-slate-300 pt-6 lg:sticky lg:top-8 lg:self-start">
      <h2 id="selected-notes-heading" className="text-2xl font-normal tracking-tight">Selected notes</h2>
      <ol className="mt-6 space-y-5">
        {selected.map((article) => <li key={article.slug}><Link aria-current={article.slug === currentSlug ? "page" : undefined} className="font-heading-mono text-base text-neutral-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" href={`/notes/${article.slug}`}>{article.title}</Link></li>)}
      </ol>
    </aside>
  );
}
