import assert from "node:assert/strict";
import test from "node:test";
import { getDisplayHighlights } from "../../lib/highlights.ts";

test("empty or unavailable selections produce no highlights", () => {
  assert.deepEqual(getDisplayHighlights({ _key: "highlights" }), []);
  assert.deepEqual(getDisplayHighlights({ _key: "highlights", articles: [null, { title: "Missing slug" }, { slug: "missing-title" }] }), []);
});

test("highlight selection preserves editorial order and includes text-only articles", () => {
  const articles = [{ title: "First", slug: "first" }, { title: "Second", slug: "second", coverImage: null }];
  assert.deepEqual(getDisplayHighlights({ _key: "highlights", articles }).map(({ slug }) => slug), ["first", "second"]);
});

test("highlight selection is limited to six articles", () => {
  const articles = Array.from({ length: 7 }, (_, index) => ({ title: `Article ${index}`, slug: `article-${index}` }));
  assert.equal(getDisplayHighlights({ _key: "highlights", articles }).length, 6);
});
