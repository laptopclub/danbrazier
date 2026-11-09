import { expect, test } from "@playwright/test";

test("decorative headings are anchored to their section headings", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const name of ["Recent notes", "Highlights"]) {
      const heading = page.getByRole("heading", { name, exact: true });
      const wrapper = heading.locator("..");
      const background = wrapper.locator(':scope > [aria-hidden="true"]');
      await expect(background).toBeVisible();
      const [headingBox, backgroundBox] = await Promise.all([heading.boundingBox(), background.boundingBox()]);
      expect(headingBox).not.toBeNull();
      expect(backgroundBox).not.toBeNull();
      const headingCentre = headingBox!.y + headingBox!.height / 2;
      const backgroundCentre = backgroundBox!.y + backgroundBox!.height / 2;
      expect(Math.abs(headingCentre - backgroundCentre)).toBeLessThan(1);
    }
  }
});
