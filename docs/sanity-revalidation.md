# Sanity cache revalidation

Foundation uses `next-sanity/live` for normal content freshness and visual editing. A signed Sanity webhook provides an additional production revalidation path for statically generated routes and `sitemap.xml`.

## Environment variable

Generate a strong random secret:

```bash
openssl rand -base64 32
```

Set the same value in local development and Vercel:

```env
SANITY_REVALIDATE_SECRET=your-secret
```

Do not commit the value.

## Sanity webhook

Create a GROQ-powered webhook in the Sanity project API settings.

Use these settings:

- Name: `Foundation route revalidation`
- URL: `https://your-production-domain.com/api/revalidate`
- Dataset: `production`
- Trigger on: create, update and delete
- Include drafts: disabled
- HTTP method: `POST`
- Secret: the value of `SANITY_REVALIDATE_SECRET`
- API version: `v2025-01-01` or newer

Filter:

```groq
_type in ["page", "siteSettings"]
```

Projection:

```groq
{
  "_type": coalesce(after()._type, before()._type),
  "slug": after().slug.current,
  "previousSlug": before().slug.current
}
```

The before/after projection allows the endpoint to invalidate the old route when a page slug changes and the last known route when a page is unpublished or deleted.

## Revalidation behavior

For `page` changes, the endpoint revalidates:

- the current page route
- the previous page route, when the slug changed or the document was deleted
- `/sitemap.xml`

The slug `home` maps to `/`. Nested slugs such as `services/design` map to `/services/design`.

For `siteSettings` changes, the endpoint revalidates the root layout and therefore all site routes because navigation, footer and default metadata may be affected.

## Security and reliability

- Requests are verified with `parseBody` from `next-sanity/webhook`.
- The endpoint waits briefly for Content Lake/CDN propagation before revalidating.
- Draft and Content Release changes should not trigger this production webhook.
- Revalidation operations are idempotent, so webhook retries are safe.
- Review failed deliveries in the Sanity webhook message log.
- For a larger fleet, Foundation Dash should provision webhook URLs and secrets and provide a reconciliation workflow for missed events.

## Vercel preview deployments

A production webhook should target the canonical production deployment. If editorial teams need webhook revalidation on stable preview environments, create a separate webhook and secret strategy rather than targeting ephemeral deployment URLs individually.
