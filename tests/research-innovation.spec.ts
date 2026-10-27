import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} Research & Innovation page shows hero, focus cards and product innovations`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    const response = await page.goto(`/${locale}/research-innovation`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page).toHaveTitle(locale === "en" ? /Research & Innovation/ : /البحث والابتكار/);
    await expect(page.locator("main > section")).toHaveCount(3);
    await expect(page.locator("main h1")).toContainText(locale === "en" ? "From insight" : "من الفكرة");
    await expect(page.locator("main")).not.toContainText(locale === "en" ? /Development/ : /التطوير/);
    await expect(page.locator("#ri-focus article")).toHaveCount(6);

    const tabs = page.locator('#ri-products [role="tab"]');
    await expect(tabs).toHaveCount(4);
    const names = locale === "en" ? ["Fonte Pan Cake", "Hanini Brioche", "Protein Tortilla", "Tortilla Range"] : ["بان كيك فونتي", "بريوش حنيني", "تورتيلا بالبروتين", "مجموعة التورتيلا"];
    for (const [index, name] of names.entries()) {
      await tabs.nth(index).click();
      await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
      const panel = page.locator('#ri-products [role="tabpanel"]:not([hidden])');
      await expect(panel).toHaveCount(1);
      await expect(panel.locator("h3")).toHaveText(name);
      await expect(panel.locator("img").first()).toBeVisible();
    }

    await tabs.nth(0).click();
    const panel = page.locator('#ri-products [role="tabpanel"]:not([hidden])');
    await panel.getByRole("button", {name: locale === "en" ? "Blueberry" : "توت أزرق"}).click();
    await expect(panel.locator('img[src*="pancake-box-blueberry"]')).toHaveCount(1);
    await tabs.nth(1).click();
    await page.locator('#ri-products [role="tabpanel"]:not([hidden])').getByRole("button", {name: locale === "en" ? "Back" : "الخلف"}).click();
    await expect(page.locator('#ri-products img[src*="hanini-brioche-back"]')).toHaveCount(1);

    await tabs.nth(1).focus();
    await tabs.nth(1).press(locale === "ar" ? "ArrowLeft" : "ArrowRight");
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('main a[href$="/contact"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  });

  test(`${locale} Research & Innovation is a direct menu link and the old version redirects`, async ({page, isMobile}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    if (!isMobile) await page.setViewportSize({width: 1440, height: 1000});
    await page.goto(`/${locale}`);
    const name = locale === "en" ? "Research & Innovation" : "البحث والابتكار";
    if (isMobile) {
      await page.locator(".mobile-trigger").click();
      await page.locator(".mobile-menu").getByRole("link", {name, exact: true}).click();
    } else {
      await expect(page.locator(".desktop-nav").getByRole("button", {name, exact: true})).toHaveCount(0);
      await page.locator(".desktop-nav").getByRole("link", {name, exact: true}).click();
    }
    await expect(page).toHaveURL(new RegExp(`/${locale}/research-innovation$`));
    await page.goto(`/${locale}/research-innovation-2`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/research-innovation$`));
  });
}
