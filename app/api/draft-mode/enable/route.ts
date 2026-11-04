import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { env } from "../../../../lib/env";
import { sanityClient } from "../../../../lib/sanity";

if (!env.sanity.readToken) {
  console.warn("SANITY_API_READ_TOKEN is required for Sanity Presentation and draft mode.");
}

const draftModeHandler = env.sanity.readToken
  ? defineEnableDraftMode({
      client: sanityClient.withConfig({ token: env.sanity.readToken })
    }).GET
  : () => new Response("SANITY_API_READ_TOKEN is required for Sanity Presentation and draft mode.", { status: 500 });

export const GET = draftModeHandler;
