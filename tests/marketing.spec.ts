import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} marketing page presents the brief in three sections`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    const response = await page.goto(`/${locale}/capabilities/marketing`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page.locator("h1")).toHaveText(locale === "ar" ? "التسويق" : "Marketing");
    await expect(page).toHaveTitle(locale === "ar" ? /التسويق/ : /Marketing/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${locale}/capabilities/marketing$`));
    await expect(page.locator("main > section")).toHaveCount(3);
    await expect(page.locator("[data-marketing-capability]")).toHaveCount(8);
    const expected = locale === "ar"
      ? ["إدارة العلامات التجارية", "أبحاث السوق ورؤى المستهلك", "ابتكار المنتجات وإطلاقها", "التسويق والاتصال المتكامل", "التسويق الرقمي والتجارة الإلكترونية", "التسويق التجاري وتنشيط التجزئة", "إدارة الفئات ومحفظة المنتجات", "الأداء التسويقي والتحليلات"]
      : ["Brand Management", "Market Research & Consumer Insights", "Product Innovation & Launches", "Integrated Marketing & Communications", "Digital Marketing & E-Commerce", "Trade Marketing & Retail Activation", "Category & Portfolio Management", "Marketing Performance & Analytics"];
    await expect(page.locator("[data-marketing-capability] h3")).toHaveText(expected);
    await expect(page.locator("main nav a")).toHaveCount(5);
    await expect(page.locator('main a[href$="/contact"]')).toHaveCount(1);
    await expect(page.locator('footer a[href$="/capabilities/marketing"]')).toBeVisible();
    await page.locator("main img").evaluate(async image => (image as HTMLImageElement).decode());
    await expect(page.locator("main")).not.toContainText(/Nature.?s Oven|نيتشرز/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.locator(".language-switch").click();
    await expect(page).toHaveURL(new RegExp(`/${locale === "ar" ? "en" : "ar"}/capabilities/marketing$`));
  });

  test(`${locale} marketing is available under Our Capabilities`, async ({page, isMobile}) => {
    if (!isMobile) await page.setViewportSize({width: 1440, height: 1000});
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}/capabilities/sales`);
    const label = locale === "ar" ? "قدراتنا" : "Our Capabilities";
    if (isMobile) {
      await page.locator(".mobile-trigger").click();
      await page.locator(".mobile-menu summary").filter({hasText: label}).click();
      await page.locator(`.mobile-menu a[href="/${locale}/capabilities/marketing"]`).click();
    } else {
      await page.locator(".desktop-nav").getByRole("button", {name: label, exact: true}).hover();
      await page.locator(`.mega-menu.is-open a[href="/${locale}/capabilities/marketing"]`).click();
    }
    await expect(page).toHaveURL(new RegExp(`/${locale}/capabilities/marketing$`));
    await expect(page.locator("h1")).toBeVisible();
  });
}
