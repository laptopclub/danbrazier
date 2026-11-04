import type { MetadataRoute } from "next";
import { env } from "../lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*"
    },
    sitemap: new URL("/sitemap.xml", env.siteUrl).toString()
  };
}
