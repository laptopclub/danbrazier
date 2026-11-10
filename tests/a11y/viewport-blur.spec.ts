import { expect, test } from "@playwright/test";

test("viewport blurs match and clear the sticky selected notes heading", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const path of ["/notes", "/notes/nxt-commerce-copenhagen-2026"]) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 600); });
    const top = page.locator('[data-viewport-blur="top"]');
    const bottom = page.locator('[data-viewport-blur="bottom"]');
    await expect(top).toHaveCSS("height", "56px");
    await expect(bottom).toHaveCSS("height", "56px");
    const heading = page.getByRole("heading", { name: "Selected notes" });
    await expect(heading).toBeVisible();
    const [blurBox, headingBox] = await Promise.all([top.boundingBox(), heading.boundingBox()]);
    expect(blurBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    expect(headingBox!.y).toBeCloseTo(56, 0);
    expect(headingBox!.y).toBeGreaterThanOrEqual(blurBox!.y + blurBox!.height);
    const footerZ = await page.locator("footer").evaluate((footer) => Number(getComputedStyle(footer).zIndex));
    const blurZ = await bottom.evaluate((blur) => Number(getComputedStyle(blur).zIndex));
    expect(footerZ).toBeGreaterThan(blurZ);
  }
});
