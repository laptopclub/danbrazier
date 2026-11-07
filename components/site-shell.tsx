import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const progressiveBlurSteps = [0.078125, 0.15625, 0.3125, 0.625, 1.25, 2.5, 5, 10] as const;

function EdgeBlur({ edge }: { edge: "bottom" | "top" }) {
  return <div aria-hidden="true" className={edge === "top" ? "pointer-events-none fixed inset-x-0 top-0 z-40 h-28" : "pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28"}><div className="relative size-full">{progressiveBlurSteps.map((blur, index) => {
    const step = 100 / progressiveBlurSteps.length;
    const start = index * step;
    const maskImage = `linear-gradient(${edge === "top" ? "to top" : "to bottom"}, rgba(0,0,0,0) ${start}%, #000 ${(index + 1) * step}%, #000 ${Math.min((index + 2) * step, 100)}%, rgba(0,0,0,0) ${Math.min((index + 3) * step, 100)}%)`;
    const style = { WebkitBackdropFilter: `blur(${blur}px)`, WebkitMaskImage: maskImage, backdropFilter: `blur(${blur}px)`, maskImage } satisfies CSSProperties;
    return <div className="pointer-events-none absolute inset-0" key={`${edge}-${blur}`} style={style} />;
  })}</div></div>;
}

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
      <EdgeBlur edge="top" />
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
      <EdgeBlur edge="bottom" />
    </div>
  );
}
