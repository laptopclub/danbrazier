import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SlugValue = string | { current?: string | null };

type RevalidationPayload = {
  _type?: "page" | "siteSettings";
  previousSlug?: SlugValue | null;
  slug?: SlugValue | null;
};

function slugToPath(slug: SlugValue | null | undefined): string | null {
  const value = typeof slug === "string" ? slug : slug?.current;

  if (!value) {
    return null;
  }

  const normalizedSlug = value.replace(/^\/+|\/+$/g, "");

  if (!normalizedSlug || normalizedSlug.includes("..") || normalizedSlug.includes(":") || normalizedSlug.includes("//")) {
    return null;
  }

  return normalizedSlug === "home" ? "/" : `/${normalizedSlug}`;
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  try {
    const { body, isValidSignature } = await parseBody<RevalidationPayload>(request, secret, true);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid webhook signature" }, { status: 401 });
    }

    if (!body?._type || !["page", "siteSettings"].includes(body._type)) {
      return NextResponse.json({ message: "Unsupported or missing document type" }, { status: 400 });
    }

    if (body._type === "siteSettings") {
      revalidatePath("/", "layout");

      return NextResponse.json({ revalidated: ["all site routes"] });
    }

    const paths = new Set([slugToPath(body.slug), slugToPath(body.previousSlug)].filter((path): path is string => Boolean(path)));

    for (const path of paths) {
      revalidatePath(path);
    }

    revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: [...paths, "/sitemap.xml"] });
  } catch (error: unknown) {
    console.error("Sanity revalidation failed", error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown revalidation error" },
      { status: 500 }
    );
  }
}
