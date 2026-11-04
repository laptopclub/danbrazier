# Dan Brazier agent guide

This file captures site-specific rules for AI agents working in this client repository.

## Project summary

- Client/site: Dan Brazier
- Foundation package version: 0.1.33
- Production URL: https://danbrazier.co.uk
- Sanity project/dataset: zul5551z / production

## Content voice

- Write in a concise, first-person personal voice.
- Keep language direct, thoughtful and unpretentious.
- Use UK English.
- Avoid marketing jargon, corporate tone and unsupported claims.

## Boundaries

- Keep client-specific content, styling and composition in this repository.
- Put reusable schemas, blocks, components and framework fixes in `laptopclub/foundation`.
- Do not edit code inside installed Foundation packages.
- Add site-specific schemas in `sanity/schema-types.ts`.
- Add site-specific renderers in `lib/blocks.ts` or client components.
- Upgrade all `@laptopclub/foundation-*` packages together.
- Do not mutate production Sanity content unless explicitly requested.
- Never commit `.env` files, package tokens, Sanity tokens or webhook secrets.
- Foundation package credentials are distributed from the macOS Keychain using `pnpm sync:package-token` in `laptopclub/foundation`. Do not create or store site-local package tokens.
- Register this repository in `laptopclub/foundation/docs/consumer-sites.json` before package credential distribution and fleet validation.
- Do not hand-edit generated Sanity type files.
- Do not add dependencies without explicit approval.

## Required checks

```bash
pnpm check
pnpm build
```

For schema or GROQ query changes:

```bash
pnpm sanity:schema
pnpm sanity:typegen
```

## Definition of done

- Client-specific changes stay in the client repository.
- Reusable framework changes are made upstream in Foundation.
- Package installation, checks and production build pass.
- Relevant routes are smoke-tested after deploy.
- No secrets or temporary generated files are committed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
