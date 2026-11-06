import Link from "next/link";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
  footerHeading?: string;
  newsletterButtonLabel?: string;
  newsletterHeading?: string;
  newsletterPlaceholder?: string;
  socialHeading?: string;
  socialLinks?: Array<{ href?: string; label?: string; openInNewTab?: boolean }>;
};

export function SiteShell({ children, footerHeading = "Get in touch", newsletterButtonLabel = "Subscribe", newsletterHeading = "Join the mailing list", newsletterPlaceholder = "your@email.com", socialHeading = "Elsewhere", socialLinks = [] }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <footer className="mt-24 bg-neutral-950 px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-display">{footerHeading}</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-neutral-400">{newsletterHeading}</p>
              <form className="mt-5 flex max-w-md items-center gap-3">
                <label className="sr-only" htmlFor="email">Email address</label>
                <input
                  className="min-w-0 flex-1 border-b border-neutral-600 bg-transparent py-2 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
                  id="email"
                  name="email"
                  placeholder={newsletterPlaceholder}
                  type="email"
                />
                <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-neutral-950 transition hover:bg-neutral-300" type="button">
                  {newsletterButtonLabel}
                </button>
              </form>
            </div>
            <nav aria-label="Elsewhere" className="flex flex-col gap-3 md:items-end">
              <p className="text-sm font-semibold text-neutral-400">{socialHeading}</p>
              {socialLinks.map((link) => link.href && link.label ? <Link className="text-lg font-medium text-neutral-300 transition hover:text-white" href={link.href} key={link.href} target={link.openInNewTab ? "_blank" : undefined}>{link.label}</Link> : null)}
            </nav>
          </div>
          <p className="mt-20 text-xs tracking-wide text-neutral-400">© {new Date().getFullYear()} Dan Brazier</p>
        </div>
      </footer>
    </div>
  );
}
