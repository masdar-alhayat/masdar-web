import {expect, test} from "@playwright/test";

const routes = [
  "/",
  "/about/masdar-al-hayat",
  "/about/group-story-tamimi-group",
  "/about/vision-mission-values",
  "/research-innovation",
  "/capabilities/manufacturing",
  "/capabilities/operations",
  "/capabilities/quality-compliance",
  "/capabilities/logistics-distribution",
  "/brands-partnerships/brands",
  "/brands-partnerships/partnerships",
  "/careers",
  "/contact",
];

for (const route of routes) {
  test(`loads ${route}`, async ({page}) => {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/Masdar|مصدر/);
  });

  test(`loads Arabic ${route}`, async ({page}) => {
    const ar = route === "/" ? "/ar" : `/ar${route}`;
    await page.goto(ar);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });
}

test("homepage CTA opens an internal page", async ({page}) => {
  await page.goto("/");
  await Promise.all([
    page.waitForURL("**/about/masdar-al-hayat"),
    page.getByRole("link", {name: "Discover Masdar Al Hayat", exact: true}).click(),
  ]);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page).toHaveTitle(/About Masdar Al Hayat/);
});

test("removed pages are absent from normal navigation", async ({page}) => {
  await page.goto("/");
  await expect(page.locator('header a[href*="sustainability"], footer a[href*="sustainability"]')).toHaveCount(0);
  await expect(page.locator('a[href*="market-presence"]')).toHaveCount(0);
  await expect(page.locator(".site-header")).not.toContainText(/Leadership\s*&\s*Governance/i);
  await expect(page.locator(".site-footer")).not.toContainText(/Leadership\s*&\s*Governance/i);
});

test("removed Market Presence routes return 404", async ({page}) => {
  for (const route of [
    "/market-presence/exhibitions",
    "/market-presence/industry-landscape",
    "/market-presence/market-landscape",
    "/ar/market-presence/exhibitions",
    "/ar/market-presence/industry-landscape",
    "/ar/market-presence/market-landscape",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
  }
});

test("career CTAs target the preserved application form", async ({page}) => {
  await page.goto("/careers");
  await expect(page.locator("#career-application")).toBeVisible();
  await expect(page.getByRole("heading", {name: "Career Application"})).toBeVisible();
});
