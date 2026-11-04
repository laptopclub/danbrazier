import { homePageId } from "@laptopclub/foundation-cms";
import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

function getPublishedId(documentId?: string): string | undefined {
  return documentId?.replace(/^drafts\./, "");
}

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    page: defineLocations({
      select: {
        id: "_id",
        slug: "slug.current",
        title: "title",
      },
      resolve: (doc) => ({
        locations: [
          {
            href:
              getPublishedId(doc?.id) === homePageId || doc?.slug === "home"
                ? "/"
                : `/${doc?.slug ?? ""}`,
            title: doc?.title ?? "Untitled page",
          },
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: {
        title: "title",
      },
      resolve: (doc) => ({
        locations: [
          {
            href: "/",
            title: doc?.title ?? "Site settings",
          },
        ],
      }),
    }),
  },
};
