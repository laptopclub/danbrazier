import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { syncArticle } from "../../../lib/article-index";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_ALGOLIA_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ message: "Webhook not configured" }, { status: 503 });
  try {
    const { body, isValidSignature } = await parseBody<{ _id?: unknown; _type?: unknown }>(request, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    if (body?._type !== "article" || typeof body._id !== "string" || !body._id || body._id.startsWith("drafts.") || body._id.startsWith("versions.")) return NextResponse.json({ message: "Invalid article" }, { status: 400 });
    await syncArticle(body._id);
    return NextResponse.json({ synced: true });
  } catch (error) {
    console.error("Article indexing failed", error);
    return NextResponse.json({ message: "Article indexing failed" }, { status: 500 });
  }
}
