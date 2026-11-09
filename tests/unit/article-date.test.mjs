import assert from "node:assert/strict";
import test from "node:test";
import { formatArticleDate } from "../../lib/article-date.ts";

test("formats article dates in a consistent short UK format", () => {
  assert.equal(formatArticleDate("2026-01-01T09:30:00.000Z"), "01 JAN 2026");
  assert.equal(formatArticleDate("2026-09-09T09:30:00.000Z"), "09 SEP 2026");
});

test("ignores missing or invalid dates", () => {
  assert.equal(formatArticleDate(undefined), undefined);
  assert.equal(formatArticleDate("not a date"), undefined);
});
