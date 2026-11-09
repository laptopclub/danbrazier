import { expect, test } from "@playwright/test";

test("sitemap includes the homepage and published notes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  expect(xml).toContain("<loc>https://danbrazier.co.uk/</loc>");
  expect(xml).toContain("<loc>https://danbrazier.co.uk/notes</loc>");
  expect(xml).toContain("<loc>https://danbrazier.co.uk/notes/the-stack-behind-this-site</loc>");
  expect(xml).not.toMatch(/<loc>[^<]*\/(?:\$|&amp;)<\/loc>/);
});
