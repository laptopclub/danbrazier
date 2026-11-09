import { expect, test } from "@playwright/test";

test("highlight rows are staggered on desktop and stack on mobile", async ({ page }) => {
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Highlights", exact: true }) });
    const rows = section.locator("article");
    await expect(rows).toHaveCount(3);
    const layout = await rows.evaluateAll((elements) => elements.map((row) => {
      const rect = row.getBoundingClientRect();
      const image = row.querySelector("img")?.getBoundingClientRect();
      const heading = row.querySelector("h3")?.getBoundingClientRect();
      const transform = getComputedStyle(row).transform;
      return { width: rect.width, left: rect.left, right: rect.right, offset: transform === "none" ? 0 : new DOMMatrix(transform).m41, image: image ? { width: image.width, bottom: image.bottom } : null, headingTop: heading?.top };
    }));
    for (const row of layout) {
      expect(row.left).toBeGreaterThanOrEqual(0);
      expect(row.right).toBeLessThanOrEqual(width);
      if (width < 1024) {
        expect(row.offset).toBe(0);
        if (row.image && row.headingTop !== undefined) expect(row.image.bottom).toBeLessThan(row.headingTop);
      } else {
        expect(row.width).toBeLessThanOrEqual(896);
        if (row.image) expect(row.image.width).toBeLessThanOrEqual(288);
      }
    }
    if (width >= 1024) {
      expect(layout[0]!.offset).toBeLessThan(-40);
      expect(Math.abs(layout[1]!.offset)).toBeLessThan(1);
      expect(layout[2]!.offset).toBeGreaterThan(40);
    }
  }
});
