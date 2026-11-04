# Dan Brazier

Personal site for Dan Brazier, migrated from Next.js and Storyblok to the Laptop Club Foundation stack.

## Status

The Foundation consumer application, Sanity project and Storyblok content migration are in place. Production deployment still needs provisioning. See `../foundation/reports/provisioning/danbrazier/checklist.md` for the operational checklist.

## Local setup

Foundation packages are private. Register the site in Foundation, then distribute the package credential from the macOS Keychain as documented in `../foundation/docs/package-credentials.md`.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3333`. Until Sanity is configured, the homepage and four existing Storyblok entry routes render from the local migration fallback.

## Sanity migration

1. The `zul5551z` Sanity project and public `production` dataset are provisioned.
2. Site settings, the homepage and four entry pages are imported from Storyblok.
3. Six Storyblok image assets are copied into Sanity. Production content no longer depends on Storyblok image delivery URLs.
4. Configure the Sanity values in Vercel, including a Viewer token and revalidation secret.
5. Add the Vercel preview URL to Sanity CORS origins after the Vercel project is created.
6. Configure the signed `/api/revalidate` webhook as documented in `docs/sanity-revalidation.md`.

The base Foundation page schema can represent the homepage and entry pages. Retain site-specific composition in this repository if the existing filterable archive needs a dedicated Sanity document type later.

## Validation

```bash
pnpm check
pnpm build
```
