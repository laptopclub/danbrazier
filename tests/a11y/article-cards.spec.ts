import { expect, test } from "@playwright/test";

test("recent and archive cards use the same article content", async ({ page }) => {
  await page.goto("/");
  const recent = page.locator("section").filter({ has: page.getByRole("heading", { name: "Recent notes", exact: true }) });
  const card = recent.locator("article").first();
  await expect(card).toBeVisible();
  await expect(card.locator("a")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const href = await card.locator("a").getAttribute("href");
  const title = await card.locator("h3").innerText();
  const excerpt = await card.locator("p").innerText();
  expect(href).toBeTruthy();

  await page.goto("/notes");
  const archiveCard = page.locator("article").filter({ has: page.locator(`a[href="${href}"]`) });
  await expect(archiveCard.locator("a")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(archiveCard.locator("h2")).toHaveText(title);
  await expect(archiveCard.locator("p")).toHaveText(excerpt);
});
