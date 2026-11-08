import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/notes"] as const;

for (const route of routes) {
  test(`${route} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main h1").first()).toHaveCSS("font-weight", "400");
    await expect(page.locator("main h2").first()).toHaveCSS("font-weight", "400");

    const results = await new AxeBuilder({ page })
      .exclude("iframe")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
