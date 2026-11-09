import { expect, test } from "@playwright/test";

test("LinkedIn video loads only after a visitor chooses to load it", async ({ page }) => {
  let requests = 0;
  await page.route("https://www.linkedin.com/embed/**", async (route) => {
    requests += 1;
    await route.fulfill({ contentType: "text/html", body: "<title>Video</title>" });
  });
  await page.goto("/notes/nxt-commerce-copenhagen-2026");
  const video = page.getByTitle("LinkedIn event video");
  await expect(video).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Watch on LinkedIn" })).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "Load LinkedIn video" }).click();
  await expect(video).toHaveAttribute("src", "https://www.linkedin.com/embed/feed/update/urn:li:activity:7467826327706812416?compact=true");
  await expect.poll(() => requests).toBe(1);
});
