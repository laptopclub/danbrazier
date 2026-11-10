import { expect, test } from "@playwright/test";

test("notes images move with scrolling and honour reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const [path, selector] of [
    ["/notes", 'a[href="/notes/nxt-commerce-copenhagen-2026"] [data-parallax-frame] img'],
    ["/notes/nxt-commerce-copenhagen-2026", "[data-parallax-body] .prose figure img"]
  ] as const) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
    const image = page.locator(selector);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.style.transform)).toContain("translate3d");
    const initial = await image.evaluate((element) => element.style.transform);
    await page.evaluate(() => window.scrollBy(0, 240));
    await expect.poll(() => image.evaluate((element) => element.style.transform)).not.toBe(initial);
    if (path === "/notes") {
      const travel = await image.evaluate((element, previous) => Math.abs(new DOMMatrix(element.style.transform).m42 - new DOMMatrix(previous).m42), initial);
      expect(travel).toBeGreaterThan(5);
      await expect(image).toHaveAttribute("style", /scale\(1\.25\)/);
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => image.evaluate((element) => element.style.transform)).toBe("");
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(image).not.toHaveAttribute("style", /transform/);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect.poll(() => image.evaluate((element) => element.style.transform)).toContain("translate3d");
  }
});
