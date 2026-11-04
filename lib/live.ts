import { defineLive } from "next-sanity/live";
import { env } from "./env";
import { sanityClient } from "./sanity";

export const { sanityFetch, SanityLive } = defineLive({
  browserToken: env.sanity.readToken,
  client: sanityClient.withConfig({ apiVersion: env.sanity.apiVersion }),
  serverToken: env.sanity.readToken
});
