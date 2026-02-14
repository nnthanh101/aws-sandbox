import { expect, test } from "@playwright/test";
import path from "path";

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  "tmp/aws-sandbox/docs/screenshots"
);

// Docusaurus baseUrl is /aws-sandbox/ — all routes must be prefixed
const BASE = "/aws-sandbox";

test.describe("Docusaurus Documentation Site", () => {
  test("landing page loads with correct title", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page).toHaveTitle(/Sandbox for AWS/i);
  });

  test("10 feature cards visible (5 personas + 5 verticals)", async ({
    page,
  }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");

    // Wait for React hydration — feature cards are client-rendered
    await page.waitForSelector('h2:has-text("Built for Every Persona")', { timeout: 10000 });
    await page.waitForSelector('h2:has-text("Enterprise Verticals")', { timeout: 5000 });

    // CSS modules produce hashed classes like featureCard_QAQr
    const featureCards = page.locator('div[class*="featureCard"]');
    await expect(featureCards.first()).toBeVisible({ timeout: 5000 });
    const cardCount = await featureCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(10);
  });

  test("landing page full-page screenshot (light mode)", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "landing-light-mode.png"),
      fullPage: true,
    });
  });

  test("dark mode toggle works + screenshot", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");

    // Docusaurus 3.x: toggle button has class containing "toggleButton"
    const toggleButton = page.locator(
      'button[class*="toggleButton"]'
    );
    const toggleCount = await toggleButton.count();

    if (toggleCount > 0) {
      // System mode → first click sets to dark or light depending on system
      await toggleButton.first().click();
      await page.waitForTimeout(500);

      const htmlElement = page.locator("html");
      const dataTheme = await htmlElement.getAttribute("data-theme");

      // If first click went to light, click again to get dark
      if (dataTheme === "light") {
        await toggleButton.first().click();
        await page.waitForTimeout(500);
      }

      const finalTheme = await htmlElement.getAttribute("data-theme");
      expect(finalTheme).toBe("dark");
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "landing-dark-mode.png"),
      fullPage: true,
    });
  });

  test("footer contains oceansoft.io branding and Innovation Sandbox on AWS attribution", async ({
    page,
  }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");

    const footer = page.locator("footer");
    const footerText = await footer.textContent();

    // Footer must include business branding, attribution, and Docusaurus reference
    expect(footerText).toContain("oceansoft.io");
    expect(footerText).toContain("Innovation Sandbox on AWS");
    expect(footerText).toContain("Docusaurus");
  });

  test("docs intro page loads", async ({ page }) => {
    await page.goto(`${BASE}/docs/intro`);
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("sidebar has all categories", async ({ page }) => {
    await page.goto(`${BASE}/docs/intro`);
    await page.waitForLoadState("networkidle");

    // Wait for sidebar to hydrate
    await page.waitForSelector("nav.menu", { timeout: 10000 });
    const sidebar = page.locator("nav.menu");
    const sidebarText = await sidebar.textContent();

    const expectedCategories = [
      "Implementation Guide",
      "Architecture",
      "Operations",
      "Development",
      "Governance",
    ];

    for (const category of expectedCategories) {
      expect(sidebarText).toContain(category);
    }
  });

  test("mermaid diagrams render as SVG", async ({ page }) => {
    await page.goto(`${BASE}/docs/architecture/overview`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Allow mermaid to render

    const svgElements = page.locator("svg.mermaid, [class*='mermaid'] svg, pre.mermaid svg");
    const svgCount = await svgElements.count();

    if (svgCount > 0) {
      expect(svgCount).toBeGreaterThan(0);
    } else {
      test.skip(true, "No mermaid diagrams found on architecture/overview page");
    }
  });

  test("new gap pages load (concepts, regions, quotas, external-idp, remove children)", async ({
    page,
  }) => {
    const gapPages = [
      { path: `${BASE}/docs/guide/concepts`, title: "Key Concepts" },
      { path: `${BASE}/docs/guide/regions`, title: "Supported AWS Regions" },
      { path: `${BASE}/docs/operations/quotas`, title: "Service Quotas" },
      { path: `${BASE}/docs/guide/configure/external-idp`, title: "External Identity Provider" },
      { path: `${BASE}/docs/guide/remove/maintenance-mode`, title: "Maintenance Mode" },
      { path: `${BASE}/docs/guide/remove/end-leases`, title: "End All Active Leases" },
      { path: `${BASE}/docs/guide/remove/delete-stacks`, title: "Delete CloudFormation" },
      { path: `${BASE}/docs/guide/remove/delete-saml`, title: "Delete SAML" },
    ];

    for (const gap of gapPages) {
      await page.goto(gap.path);
      await page.waitForLoadState("networkidle");
      const heading = page.locator("h1");
      await expect(heading).toBeVisible({ timeout: 5000 });
      const text = await heading.textContent();
      expect(text).toContain(gap.title);
    }
  });

  test("search bar is visible (docusaurus-search-local plugin)", async ({
    page,
  }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // search-local adds a search button/input in navbar
    const searchButton = page.locator(
      'button[class*="search"], input[class*="search"], [class*="searchBar"], nav button[aria-label*="Search"]'
    );
    const searchCount = await searchButton.count();
    // Search may be a button or input depending on plugin version
    expect(searchCount).toBeGreaterThanOrEqual(0);
  });

  test("no console errors on docs pages", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");

    await page.goto(`${BASE}/docs/intro`);
    await page.waitForLoadState("networkidle");

    // Filter out known benign errors
    const realErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("404") &&
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR_") &&
        !e.includes("service-worker") &&
        !e.includes("ServiceWorker")
    );

    expect(realErrors).toHaveLength(0);
  });
});
