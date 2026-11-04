export const env = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  sanity: {
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
    readToken: process.env.SANITY_API_READ_TOKEN,
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333/studio"
  },
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Dan Brazier",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3333"
};
