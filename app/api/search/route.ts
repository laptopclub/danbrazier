import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ results: [] }, { status: 400 }); }
  const query = input && typeof input === "object" && "query" in input && typeof input.query === "string" ? input.query.trim() : "";
  if (query.length < 2 || query.length > 120) return NextResponse.json({ results: [] }, { status: 400 });

  const key = process.env.ALGOLIA_SEARCH_KEY;
  if (!key) return NextResponse.json({ message: "Search is not configured" }, { status: 503 });

  try {
    const response = await fetch("https://M7RBZ9L91C-dsn.algolia.net/1/indexes/danbrazier_articles_production/query", {
      method: "POST",
      headers: { "content-type": "application/json", "x-algolia-application-id": "M7RBZ9L91C", "x-algolia-api-key": key },
      body: JSON.stringify({ query, hitsPerPage: 8, attributesToRetrieve: ["objectID", "title", "slug", "excerpt"], analytics: false }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`Algolia search failed (${response.status})`);
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("hits" in data) || !Array.isArray(data.hits)) throw new Error("Invalid Algolia response");
    const results = data.hits.flatMap((hit: unknown) => {
      if (!hit || typeof hit !== "object" || !("slug" in hit) || !("title" in hit) || typeof hit.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(hit.slug) || typeof hit.title !== "string") return [];
      return [{ slug: hit.slug, title: hit.title, excerpt: "excerpt" in hit && typeof hit.excerpt === "string" ? hit.excerpt : "" }];
    });
    return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Article search failed", error);
    return NextResponse.json({ message: "Search is temporarily unavailable" }, { status: 503 });
  }
}
