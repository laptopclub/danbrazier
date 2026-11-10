import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArticleSearch } from "./article-search";

const progressiveBlurSteps = [0.078125, 0.15625, 0.3125, 0.625, 1.25, 2.5, 5, 10] as const;

function EdgeBlur({ edge }: { edge: "bottom" | "top" }) {
  return <div aria-hidden="true" data-viewport-blur={edge} className={`pointer-events-none fixed inset-x-0 z-40 h-14 ${edge === "top" ? "top-0" : "bottom-0"}`}><div className="relative size-full">{progressiveBlurSteps.map((blur, index) => {
    const step = 100 / progressiveBlurSteps.length;
    const start = index * step;
    const maskImage = `linear-gradient(${edge === "top" ? "to top" : "to bottom"}, rgba(0,0,0,0) ${start}%, #000 ${(index + 1) * step}%, #000 ${Math.min((index + 2) * step, 100)}%, rgba(0,0,0,0) ${Math.min((index + 3) * step, 100)}%)`;
    const style = { WebkitBackdropFilter: `blur(${blur}px)`, WebkitMaskImage: maskImage, backdropFilter: `blur(${blur}px)`, maskImage } satisfies CSSProperties;
    return <div className="pointer-events-none absolute inset-0" key={`${edge}-${blur}`} style={style} />;
  })}</div></div>;
}

function socialIconClass(link: { href?: string; label?: string }): string | undefined {
  const value = `${link.label ?? ""} ${link.href ?? ""}`.toLowerCase();
  if (value.includes("github")) return "bi-github";
  if (value.includes("linkedin")) return "bi-linkedin";
  if (value.includes("instagram")) return "bi-instagram";
  return undefined;
}

type SiteShellProps = {
  children: ReactNode;
  footerHeading?: string;
  footerTagline?: string;
  newsletterButtonLabel?: string;
  newsletterHeading?: string;
  newsletterPlaceholder?: string;
  socialHeading?: string;
  socialLinks?: Array<{ href?: string; label?: string; openInNewTab?: boolean }>;
};

export function SiteShell({ children, footerHeading = "Get in touch", footerTagline, newsletterButtonLabel = "Subscribe", newsletterHeading = "Join my mailing list", newsletterPlaceholder = "your@email.com", socialHeading = "Elsewhere", socialLinks = [] }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <EdgeBlur edge="top" />
      <header className="sticky top-0 z-50 bg-transparent px-6 py-3"><nav aria-label="Site navigation" className="mx-auto flex max-w-6xl items-center justify-between gap-6"><Link aria-label="Home" className="font-button inline-flex min-h-12 items-center text-base text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" href="/">danbrazier.co.uk</Link><ArticleSearch /></nav></header>
      <main className="flex-1">{children}</main>
      <footer className="relative z-50 mt-24 bg-neutral-950 px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-display">{footerHeading}</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div>
              <p className="font-heading-mono text-base text-neutral-400">{newsletterHeading}</p>
              <form className="mt-5 flex max-w-md items-center gap-3">
                <label className="sr-only" htmlFor="email">Email address</label>
                <input
                  className="min-w-0 flex-1 border-b border-neutral-600 bg-transparent py-2 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
                  id="email"
                  name="email"
                  placeholder={newsletterPlaceholder}
                  type="email"
                />
                <button className="font-button rounded-full bg-white px-6 py-2.5 text-sm text-neutral-950 transition hover:bg-neutral-300" type="button">
                  {newsletterButtonLabel}
                </button>
              </form>
              {footerTagline ? <p className="font-button mt-4 max-w-md text-sm leading-6 text-neutral-400">{footerTagline}</p> : null}
            </div>
            <nav aria-label="Elsewhere" className="flex flex-col gap-3 md:items-end">
              <p className="font-heading-mono text-base text-neutral-400">{socialHeading}</p>
              <div className="flex gap-4">{socialLinks.map((link) => {
                if (!link.href || !link.label) return null;
                const iconClass = socialIconClass(link);
                return <Link aria-label={link.label} className="text-2xl text-neutral-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href={link.href} key={link.href} rel={link.openInNewTab ? "noreferrer" : undefined} target={link.openInNewTab ? "_blank" : undefined}>{iconClass ? <i aria-hidden="true" className={`bi ${iconClass}`} /> : <span className="text-base">{link.label}</span>}</Link>;
              })}</div>
            </nav>
          </div>
          <p className="font-button mt-20 text-xs tracking-wide text-neutral-400">© {new Date().getFullYear()} Dan Brazier</p>
        </div>
      </footer>
      <EdgeBlur edge="bottom" />
    </div>
  );
}
