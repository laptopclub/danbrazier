import { RichTextBlock, SanityImage, type ArticleData, type ImageConfig } from "@laptopclub/foundation-ui";
import { formatArticleDate } from "../lib/article-date";
import { SelectedNotes } from "./selected-notes";
import { LinkedInVideo } from "./linkedin-video";

export function NoteArticle({ article, imageConfig, slug, linkedinVideoActivityId }: { article: ArticleData; imageConfig: ImageConfig; slug: string; linkedinVideoActivityId?: string | null }) {
  const date = formatArticleDate(article.publishedAt);

  return (
    <article className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <header>
          {article.topics?.length ? <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{article.topics.join(" · ")}</p> : null}
          <h1 className="font-heading-mono mt-4 text-4xl font-normal tracking-tight text-slate-950 sm:text-6xl">{article.title}</h1>
          {article.excerpt ? <p className="mt-6 text-xl leading-8 text-slate-600">{article.excerpt}</p> : null}
          {date ? <time className="font-button mt-6 block text-sm text-slate-500" dateTime={article.publishedAt}>{date}</time> : null}
        </header>
      </div>
      <div className="mt-12 grid gap-16 sm:mt-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className={`-mx-6 min-w-0 [&_.prose_figure]:px-6 sm:[&_.prose_figure]:px-10 ${article.coverImage ? "" : "[&>section]:pt-0"}`}>
          {article.coverImage ? <div className="px-6"><SanityImage className="aspect-[16/9] w-full rounded-3xl object-cover" config={imageConfig} image={article.coverImage} priority sizes="(min-width: 1024px) 700px, 100vw" /></div> : null}
          <RichTextBlock block={{ _type: "richTextBlock", content: article.body, spacing: "standard", width: "narrow" }} imageConfig={imageConfig} />
          {linkedinVideoActivityId ? <LinkedInVideo activityId={linkedinVideoActivityId} /> : null}
        </div>
        <SelectedNotes currentSlug={slug} />
      </div>
    </article>
  );
}
