import {expect, test, type Page} from "@playwright/test";

async function openHeaderLink(page: Page, href: string, group?: string) {
  if (await page.locator(".desktop-nav").isVisible()) {
    if (group) {
      await page.locator(".desktop-nav .nav-group").filter({
        has: page.getByRole("button", {name: group, exact: true}),
      }).hover();
    }
    await page.locator(`.site-header a[href="${href}"]`).click();
  } else {
    await page.locator(".mobile-trigger").click();
    if (group) {
      await page.locator(".mobile-menu summary").filter({hasText: group}).click();
    }
    await page.locator(`.mobile-menu a[href="${href}"]`).click();
  }
}

async function expectNewPageStartsAtTop(page: Page, path: string, heading: string) {
  const target = {path, heading};
  const positions = () => page.evaluate(target => {
    const samples: Array<{path: string; y: number; heading: string}> = Reflect.get(window, "navigationSamples");
    return samples.filter(sample => sample.path === target.path && sample.heading.includes(target.heading)).map(sample => sample.y);
  }, target);
  await expect.poll(async () => (await positions()).length).toBeGreaterThan(10);
  expect(Math.max(...await positions())).toBeLessThanOrEqual(1);
}

for (const locale of ["en", "ar"] as const) {
  test(`${locale} header navigation opens new pages instantly at the top`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.addInitScript(() => {
      const samples: Array<{path: string; y: number; heading: string}> = [];
      Object.assign(window, {navigationSamples: samples, navigationDocument: Math.random()});
      function sample() {
        samples.push({path: location.pathname, y: scrollY, heading: document.querySelector("main h1")?.textContent || ""});
        requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    await page.goto(`/${locale}`);
    const documentId = await page.evaluate(() => Reflect.get(window, "navigationDocument"));
    await page.evaluate(() => window.scrollTo({top: document.documentElement.scrollHeight, behavior: "instant"}));
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);

    const aboutPath = `/${locale}/about/masdar-al-hayat`;
    await openHeaderLink(page, aboutPath, locale === "en" ? "About Us" : "من نحن");
    await expect(page).toHaveURL(aboutPath);
    await expect(page.locator("h1")).toContainText(locale === "en" ? "Built on Innovation" : "نرتكز على الابتكار");
    expect(await page.evaluate(() => Reflect.get(window, "navigationDocument"))).toBe(documentId);
    await expectNewPageStartsAtTop(page, aboutPath, locale === "en" ? "Built on Innovation" : "نرتكز على الابتكار");

    await page.evaluate(() => window.scrollTo({top: document.documentElement.scrollHeight / 2, behavior: "instant"}));
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(500);
    const partnerPath = `/${locale}/brands-partnerships/partnerships`;
    await openHeaderLink(page, partnerPath);
    await expect(page).toHaveURL(partnerPath);
    await expect(page.locator("h1")).toContainText(locale === "en" ? "Building Strong Client Partnerships" : "نبني شراكات قوية");
    expect(await page.evaluate(() => Reflect.get(window, "navigationDocument"))).toBe(documentId);
    await expectNewPageStartsAtTop(page, partnerPath, locale === "en" ? "Building Strong Client Partnerships" : "نبني شراكات قوية");
  });
}

test("Brands and Manufacturing use the same combined video", async ({page}) => {
  for (const path of ["/en/brands-partnerships/brands", "/en/capabilities/manufacturing"]) {
    await page.goto(path);
    const video = page.locator('video[src="/assets/videos/manufacturing-combined-enhanced-v1.mp4"]');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute("loop", "");
    await expect(page.locator('video[src$=".mov"]')).toHaveCount(0);
  }
});
