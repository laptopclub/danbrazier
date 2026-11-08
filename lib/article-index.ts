import { sanityClient } from "./sanity";
import { env } from "./env";

const applicationId = "M7RBZ9L91C";
const indexName = "danbrazier_articles_production";
const articleProjection = `{
  _id, title, "slug": slug.current, excerpt, publishedAt, topics,
  "body": body[_type == "block"].children[].text
}`;

type Article = { _id: string; title: string; slug: string; excerpt?: string; publishedAt?: string; topics?: string[]; body?: string[] };
type IndexRecord = { objectID: string; title: string; slug: string; excerpt: string; publishedAt: string | null; publishedAtTimestamp: number; topics: string[]; body: string };

function toRecord(article: Article): IndexRecord {
  const timestamp = article.publishedAt ? Date.parse(article.publishedAt) : NaN;
  return { objectID: article._id, title: article.title, slug: article.slug, excerpt: article.excerpt ?? "", publishedAt: article.publishedAt ?? null, publishedAtTimestamp: Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : 0, topics: article.topics ?? [], body: (article.body ?? []).join(" ") };
}

function getClient() {
  if (env.sanity.projectId !== "zul5551z" || env.sanity.dataset !== "production" || !env.sanity.readToken) throw new Error("Expected production Sanity project and a read token");
  return sanityClient.withConfig({ token: env.sanity.readToken, useCdn: false, perspective: "published" });
}

async function algolia(path: string, method: "POST", body: unknown): Promise<Response> {
  const key = process.env.ALGOLIA_INDEX_WRITE_KEY;
  if (!key) throw new Error("Missing ALGOLIA_INDEX_WRITE_KEY");
  const response = await fetch(`https://${applicationId}.algolia.net/1/indexes/${indexName}${path}`, { method, headers: { "content-type": "application/json", "x-algolia-application-id": applicationId, "x-algolia-api-key": key }, body: JSON.stringify(body), cache: "no-store" });
  if (!response.ok) throw new Error(`Algolia request failed (${response.status})`);
  return response;
}

async function batch(requests: Array<{ action: "addObject" | "deleteObject"; body: IndexRecord | { objectID: string } }>) {
  if (requests.length) await algolia("/batch", "POST", { requests });
}

const eligible = `_type == "article" && defined(slug.current) && defined(title) && seo.noIndex != true`;

export async function syncArticle(id: string) {
  if (!id || id.startsWith("drafts.") || id.startsWith("versions.")) throw new Error("Invalid published document ID");
  const article = await getClient().fetch<Article | null>(`*[${eligible} && _id == $id][0]${articleProjection}`, { id }, { cache: "no-store", stega: false });
  await batch(article ? [{ action: "addObject", body: toRecord(article) }] : [{ action: "deleteObject", body: { objectID: id } }]);
}

export async function reconcileArticles(): Promise<{ upserted: number; deleted: number }> {
  const client = getClient();
  const articles = await client.fetch<Article[]>(`*[${eligible}]${articleProjection}`, {}, { cache: "no-store", stega: false });
  const ids = new Set(articles.map((article) => article._id));
  const indexedIds: string[] = [];
  let cursor: string | undefined;
  do {
    const response = await algolia("/browse", "POST", { attributesToRetrieve: ["objectID"], hitsPerPage: 1000, ...(cursor ? { cursor } : {}) });
    const page = await response.json() as { hits: Array<{ objectID: string }>; cursor?: string };
    indexedIds.push(...page.hits.map((hit) => hit.objectID));
    cursor = page.cursor;
  } while (cursor);

  if (!articles.length && indexedIds.length) throw new Error("Refusing to clear a non-empty index from an empty Sanity result");

  for (let i = 0; i < articles.length; i += 500) await batch(articles.slice(i, i + 500).map((article) => ({ action: "addObject", body: toRecord(article) })));
  let deleted = 0;
  for (const id of indexedIds.filter((item) => !ids.has(item))) {
    // Re-read before deletion so newly published articles are not removed from an older snapshot.
    const stillExists = await client.fetch<boolean>(`defined(*[${eligible} && _id == $id][0]._id)`, { id }, { cache: "no-store", stega: false });
    if (!stillExists) { await batch([{ action: "deleteObject", body: { objectID: id } }]); deleted++; }
  }
  return { upserted: articles.length, deleted };
}
