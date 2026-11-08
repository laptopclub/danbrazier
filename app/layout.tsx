import { GoogleAnalytics } from "@laptopclub/foundation-analytics";
import { SiteShell } from "../components/site-shell";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "../components/disable-draft-mode";
import { env } from "../lib/env";
import { SanityLive } from "../lib/live";
import { getSiteSettings } from "../lib/site";
import "./globals.css";

const geistSans = localFont({
  display: "swap",
  src: [
    { path: "./fonts/geist-400.ttf", weight: "400" },
    { path: "./fonts/geist-500.ttf", weight: "500" },
    { path: "./fonts/geist-600.ttf", weight: "600" },
    { path: "./fonts/geist-700.ttf", weight: "700" }
  ],
  variable: "--font-geist-sans"
});

const geistPixel = localFont({
  display: "swap",
  src: "./fonts/geist-pixel-400.ttf",
  variable: "--font-geist-pixel"
});

const geistMono = localFont({
  display: "swap",
  src: [
    { path: "./fonts/geist-mono-400.ttf", weight: "400" },
    { path: "./fonts/geist-mono-500.ttf", weight: "500" },
    { path: "./fonts/geist-mono-600.ttf", weight: "600" }
  ],
  variable: "--font-geist-mono"
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings({ stega: false });

  return {
    description: site.description,
    metadataBase: new URL(env.siteUrl),
    title: {
      default: site.title,
      template: `%s | ${site.title}`
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const mode = await draftMode();

  const site = await getSiteSettings({ stega: false });

  return (
    <html className={`${geistSans.variable} ${geistMono.variable} ${geistPixel.variable}`} lang="en">
      <body>
        <SiteShell footerHeading={site.footerHeading} footerTagline={site.footerTagline} newsletterButtonLabel={site.newsletterButtonLabel} newsletterHeading={site.newsletterHeading} newsletterPlaceholder={site.newsletterPlaceholder} socialHeading={site.socialHeading} socialLinks={site.socialLinks}>{children}</SiteShell>
        <SanityLive />
        {mode.isEnabled ? (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        ) : null}
        <GoogleAnalytics measurementId={env.gaMeasurementId} />
      </body>
    </html>
  );
}
