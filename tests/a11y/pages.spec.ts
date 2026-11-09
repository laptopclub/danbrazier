import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/notes", "/notes/the-stack-behind-this-site"] as const;

for (const route of routes) {
  test(`${route} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://danbrazier.co.uk${route === "/" ? "" : route}`);
    await expect(page.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
    await expect(page.locator("main h1").first()).toHaveCSS("font-weight", "500");
    await expect(page.locator("main h2").first()).toHaveCSS("font-weight", route === "/notes" ? "400" : "500");

    const results = await new AxeBuilder({ page })
      .exclude("iframe")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
