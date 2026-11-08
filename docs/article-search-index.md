# Article search index

Published, indexable articles are synced from Sanity `zul5551z / production` to Algolia application `M7RBZ9L91C`, index `danbrazier_articles_production`. The index contains public article text. Drafts, release versions and articles with `seo.noIndex` enabled are excluded.

## Configuration

Production-only Vercel secrets:

- `ALGOLIA_INDEX_WRITE_KEY`: Algolia key scoped to this index with `addObject`, `deleteObject`, `browse` and `search` permissions.
- `SANITY_ALGOLIA_WEBHOOK_SECRET`: signing secret shared with the Sanity webhook.
- `CRON_SECRET`: Vercel cron bearer secret.
- `SANITY_API_READ_TOKEN`: Sanity Viewer token for the production dataset.

Never put these values in source control or expose them to the browser. Preview deployments must not write to the production index.

## Sync and recovery

The signed Sanity document webhook posts create, update and delete events to `/api/algolia-sync`. It sends only the published document ID and type. The handler fetches the current published document, so out-of-order deliveries generally converge on current content. A daily Vercel cron at 04:17 UTC calls `/api/algolia-reconcile` to upsert all eligible articles and remove stale records. Reconciliation refuses to clear a non-empty index if Sanity unexpectedly returns no eligible articles. Check Vercel logs and Sanity webhook delivery logs for failures.

The webhook is configured for dataset `production`, create/update/delete, with drafts and release versions disabled. Filter: `_type == "article"`. Projection: `{ "_id": coalesce(after()._id, before()._id), "_type": coalesce(after()._type, before()._type) }`.

To trigger reconciliation manually, send a GET to the production endpoint with the production `CRON_SECRET` as a bearer token. Do not put the secret in a shell history, log or issue. Check the response and compare the Algolia index against the published Sanity articles after running.

This is an eventually consistent integration, not a transaction across Sanity and Algolia. Overlapping updates or a failed delivery can temporarily produce stale results until the next successful event or reconciliation.
