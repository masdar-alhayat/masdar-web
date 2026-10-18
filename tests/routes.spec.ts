import {expect, test} from "@playwright/test";

const routes = [
  "/",
  "/about/masdar-al-hayat",
  "/about/group-story-tamimi-group",
  "/about/vision-mission-values",
  "/research-innovation",
  "/research-innovation-2",
  "/capabilities/manufacturing",
  "/capabilities/operations",
  "/capabilities/quality-compliance",
  "/capabilities/logistics-distribution",
  "/capabilities/sales",
  "/capabilities/marketing",
  "/brands-partnerships/brands",
  "/brands-partnerships/brands-portfolio",
  "/brands-partnerships/partnerships",
  "/careers",
  "/contact",
];

for (const route of routes) {
  test(`loads English ${route}`, async ({page}) => {
    await page.goto(route === "/" ? "/en" : `/en${route}`);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/Masdar|مصدر/);
  });

  test(`loads Arabic ${route}`, async ({page}) => {
    await page.goto(route === "/" ? "/ar" : `/ar${route}`);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });
}

test("homepage CTA opens an internal page", async ({page}) => {
  await page.goto("/en");
  await Promise.all([
    page.waitForURL("**/en/about/masdar-al-hayat"),
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
  await page.goto("/en/careers");
  await expect(page.locator("#career-application")).toBeVisible();
  await expect(page.getByRole("heading", {name: "Career Application"})).toBeVisible();
});

test("main URL defaults to Arabic despite English browser preferences", async ({page, context, baseURL}) => {
  await context.setExtraHTTPHeaders({"Accept-Language": "en-US,en;q=0.9"});
  await context.addCookies([{name: "NEXT_LOCALE", value: "en", url: baseURL!}]);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator(".language-switch").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});

test("header and logo backgrounds match before and after scrolling", async ({page}) => {
  await page.goto("/");
  const background = async (selector: string) => page.locator(selector).evaluate(element => getComputedStyle(element).backgroundColor);
  const initialBackground = await background(".site-header");
  expect(initialBackground).toBe("rgb(247, 243, 234)");
  expect(await background(".site-logo")).toBe(initialBackground);
  await page.evaluate(() => window.scrollTo({top: 700, behavior: "instant"}));
  expect(await background(".site-header")).toBe(initialBackground);
  expect(await background(".site-logo")).toBe(initialBackground);
});
