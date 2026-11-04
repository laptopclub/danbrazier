import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <footer className="mt-24 bg-neutral-950 px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-display">Get in touch</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-neutral-400">Join the mailing list</p>
              <form className="mt-5 flex max-w-md items-center gap-3">
                <label className="sr-only" htmlFor="email">Email address</label>
                <input
                  className="min-w-0 flex-1 border-b border-neutral-600 bg-transparent py-2 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  type="email"
                />
                <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-neutral-950 transition hover:bg-neutral-300" type="button">
                  Subscribe
                </button>
              </form>
            </div>
            <nav aria-label="Elsewhere" className="flex flex-col gap-3 md:items-end">
              <p className="text-sm font-semibold text-neutral-400">Elsewhere</p>
              <Link className="text-lg font-medium text-neutral-300 transition hover:text-white" href="https://github.com/danbrazieruk">
                GitHub
              </Link>
              <Link className="text-lg font-medium text-neutral-300 transition hover:text-white" href="https://www.linkedin.com/in/danbrazieruk">
                LinkedIn
              </Link>
            </nav>
          </div>
          <p className="mt-20 text-xs tracking-wide text-neutral-400">© {new Date().getFullYear()} Dan Brazier</p>
        </div>
      </footer>
    </div>
  );
}
