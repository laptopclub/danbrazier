import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("search dialog is keyboard-accessible and displays article results", async ({ page }) => {
  await page.route("**/api/search", async (route) => {
    await route.fulfill({ json: { results: [{ slug: "building-foundation", title: "Building Foundation", excerpt: "A reusable starting point." }] } });
  });
  await page.goto("/");
  await page.waitForTimeout(1500);
  const trigger = page.getByRole("button", { name: "Search", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Search notes" });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole("searchbox", { name: "Search articles" });
  await expect(input).toBeFocused();
  await input.fill("foundation");
  await expect(dialog.getByRole("link", { name: "Building Foundation" })).toHaveAttribute("href", "/notes/building-foundation");
  expect((await new AxeBuilder({ page }).exclude("iframe").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
