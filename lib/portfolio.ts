export type PortfolioEntry = {
  category: "Music" | "Personal" | "Photography" | "Work";
  date: string;
  excerpt: string;
  slug: string;
  title: string;
};

export const portfolioEntries: PortfolioEntry[] = [
  {
    category: "Personal",
    date: "9 August 2026",
    excerpt: "Why I moved off an ageing template and onto a clean, CMS-driven stack.",
    slug: "personal/rebuilding-my-site",
    title: "Rebuilding my site with Next.js and Storyblok"
  },
  {
    category: "Photography",
    date: "15 July 2026",
    excerpt: "A handful of frames from recent walks.",
    slug: "photography/street-and-light",
    title: "Street & light — a small set"
  },
  {
    category: "Music",
    date: "1 June 2026",
    excerpt: "A stripped-back solo acoustic set. Just guitar and vocals.",
    slug: "music/solo-acoustic-session",
    title: "Live session — solo acoustic"
  },
  {
    category: "Work",
    date: "1 January 2025",
    excerpt: "A short summary of the problem, my role, and the outcome.",
    slug: "work/example-project",
    title: "Example Project"
  }
];

export function getPortfolioEntry(slug: string): PortfolioEntry | undefined {
  return portfolioEntries.find((entry) => entry.slug === slug);
}
