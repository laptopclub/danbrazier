import type { SanityImageData } from "@laptopclub/foundation-ui";

export type HighlightArticle = { slug?: string | null; title?: string | null; excerpt?: string | null; publishedAt?: string | null; coverImage?: SanityImageData | null };
export type HighlightsData = { _key: string; heading?: string | null; description?: string | null; articles?: Array<HighlightArticle | null> | null };
export type DisplayHighlight = HighlightArticle & { slug: string; title: string };

export function getDisplayHighlights(block: HighlightsData): DisplayHighlight[] {
  return (block.articles ?? []).filter((article): article is DisplayHighlight => Boolean(article?.slug && article.title)).slice(0, 6);
}
