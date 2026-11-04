import { siteSettingsQuery } from "@laptopclub/foundation-cms/queries";
import type { SiteChrome } from "@laptopclub/foundation-ui";
import type { SiteSettingsQueryResult } from "./sanity-query-types";
import { env } from "./env";
import { sanityFetch } from "./live";

export type SiteSettings = SiteChrome & {
  description?: string;
};

type QueryNavigationLink = {
  href?: string | null;
  label?: string | null;
  openInNewTab?: boolean | null;
};

type QueryFooterMenu = {
  links?: QueryNavigationLink[] | null;
  title?: string | null;
};

type ExtendedSiteSettingsQueryResult = SiteSettingsQueryResult & {
  copyrightStartYear?: number | null;
  footerContact?: SiteSettings["footerContact"] | null;
  footerMenus?: QueryFooterMenu[] | null;
  footerTagline?: string | null;
  socialLinks?: QueryNavigationLink[] | null;
};

export const fallbackSiteSettings: SiteSettings = {
  description: "Dan Brazier - strategy, craft and execution. Engineering, music, photography, writing and personal projects.",
  footerMenus: [],
  footerNavigation: [],
  logoText: env.siteName,
  primaryNavigation: [],
  socialLinks: [
    { href: "https://github.com/danbrazieruk", label: "GitHub", openInNewTab: true },
    { href: "https://www.linkedin.com/in/danbrazieruk", label: "LinkedIn", openInNewTab: true }
  ],
  title: env.siteName
};

function normalizeNavigation(navigation: QueryNavigationLink[] | null | undefined): SiteSettings["primaryNavigation"] {
  return (navigation ?? []).flatMap((link) => {
    if (!link.href || !link.label) {
      return [];
    }

    return [{ href: link.href, label: link.label, openInNewTab: link.openInNewTab ?? undefined }];
  });
}

function normalizeFooterMenus(menus: QueryFooterMenu[] | null | undefined): SiteSettings["footerMenus"] {
  return (menus ?? []).flatMap((menu) => {
    if (!menu.title) {
      return [];
    }

    const links = normalizeNavigation(menu.links);

    if (!links?.length) {
      return [];
    }

    return [{ links, title: menu.title }];
  });
}

function normalizeSiteSettings(settings: ExtendedSiteSettingsQueryResult): SiteSettings {
  if (!settings?.title) {
    return fallbackSiteSettings;
  }

  return {
    copyrightStartYear: settings.copyrightStartYear ?? undefined,
    description: settings.description ?? fallbackSiteSettings.description,
    footerContact: settings.footerContact ?? undefined,
    footerMenus: normalizeFooterMenus(settings.footerMenus),
    footerNavigation: normalizeNavigation(settings.footerNavigation),
    footerTagline: settings.footerTagline ?? undefined,
    logoText: settings.logoText ?? settings.title,
    primaryNavigation: normalizeNavigation(settings.primaryNavigation),
    socialLinks: normalizeNavigation(settings.socialLinks),
    title: settings.title
  };
}

export async function getSiteSettings({ stega = true }: { stega?: boolean } = {}): Promise<SiteSettings> {
  if (env.sanity.projectId === "placeholder") {
    return fallbackSiteSettings;
  }

  try {
    const { data: settings } = await sanityFetch({ query: siteSettingsQuery, stega });
    return normalizeSiteSettings(settings as ExtendedSiteSettingsQueryResult);
  } catch {
    return fallbackSiteSettings;
  }
}
