import { expect, test } from "@playwright/test";

test("notes and article pages use matching compact vertical padding", async ({ page }) => {
  for (const [width, padding] of [[390, "40px"], [1280, "56px"]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/notes");
    const archive = page.locator("main header").filter({ has: page.getByRole("heading", { level: 1 }) }).locator("..");
    await expect(archive).toHaveCSS("padding-top", padding);
    await expect(archive).toHaveCSS("padding-bottom", padding);

    await page.goto("/notes/nxt-commerce-copenhagen-2026");
    const article = page.locator("main article").first();
    await expect(article).toHaveCSS("padding-top", padding);
    await expect(article).toHaveCSS("padding-bottom", padding);
  }
});
