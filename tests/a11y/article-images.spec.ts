import { expect, test } from "@playwright/test";

test("article summaries use body images when no primary image is selected", async ({ page }) => {
  const slug = "/notes/stockholm-commerce-customisation";
  const imageHash = "426a277c606ec69512963a0377ae9fecfbca94bb";
  await page.goto("/");
  const highlights = page.locator("section").filter({ has: page.getByRole("heading", { name: "Highlights", exact: true }) });
  const highlight = highlights.locator("article").filter({ has: page.locator(`a[href="${slug}"]`) });
  await expect(highlight.locator("img")).toHaveAttribute("src", new RegExp(imageHash));

  await page.goto("/notes");
  const card = page.locator("article").filter({ has: page.locator(`a[href="${slug}"]`) });
  await expect(card.locator("img")).toHaveAttribute("src", new RegExp(imageHash));

  await page.goto(slug);
  const images = page.locator("article img");
  await expect(images).toHaveCount(1);
  await expect(images.first()).toHaveAttribute("src", new RegExp(imageHash));
});

test("explicit covers and text-only summaries still work", async ({ page }) => {
  await page.goto("/notes");
  const withCover = page.locator("article").filter({ has: page.locator('a[href="/notes/nxt-commerce-copenhagen-2026"]') });
  await expect(withCover.locator("img")).toHaveAttribute("src", /27bb8de3a6db52482845d03a9894d7d56ddde2df/);
  const withoutImage = page.locator("article").filter({ has: page.locator('a[href="/notes/building-foundation"]') });
  await expect(withoutImage.locator("img")).toHaveCount(0);
});
