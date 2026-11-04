import type { Link, Page, SiteSettings } from "../sanity.types";

type ResolvedLink = Omit<Link, "href" | "page"> & {
  href?: string;
};

export type PageBySlugQueryResult =
  | (Omit<Page, "blocks" | "slug"> & {
      blocks?: unknown[];
      slug?: string;
    })
  | null;

export type AllPageSlugsQueryResult = Array<{
  slug?: string | null;
}>;

export type SiteSettingsQueryResult =
  | (Omit<SiteSettings, "footerNavigation" | "primaryNavigation"> & {
      footerNavigation?: ResolvedLink[];
      primaryNavigation?: ResolvedLink[];
    })
  | null;
