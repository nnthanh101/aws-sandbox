import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads with Sandbox in title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sandbox/i);
  });

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });
});
