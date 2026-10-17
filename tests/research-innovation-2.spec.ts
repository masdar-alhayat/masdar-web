import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} company-wide innovation page has three sections and working interactions`, async ({page, isMobile}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    const response = await page.goto(`/${locale}/research-innovation-2`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page).toHaveTitle(locale === "en" ? /Research & Innovation 2/ : /البحث والابتكار ٢/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${locale}/research-innovation-2$`));
    await expect(page.locator("main > section")).toHaveCount(3);
    await expect(page.locator("main h1")).toHaveText(locale === "en" ? "Connected Thinking. Progress Across Our Business." : "فكر متكامل. تقدّم يشمل أعمالنا.");
    await page.locator("main img").evaluate(async image => (image as HTMLImageElement).decode());
    const tabs = page.locator('#innovation-areas [role="tab"]');
    const panel = page.locator("#innovation-area-panel");
    await expect(tabs).toHaveCount(6);
    if (isMobile) {
      const first = (await tabs.nth(0).boundingBox())!;
      const second = (await tabs.nth(1).boundingBox())!;
      expect(locale === "ar" ? first.x > second.x : first.x < second.x).toBeTruthy();
    }
    const expectedHeadings = locale === "en"
      ? ["Understanding People and Markets", "Developing What We Offer", "Building Confidence Through Improvement", "Improving How Work Gets Done", "Connecting Supply with Market Needs", "Growing Through Shared Knowledge"]
      : ["نفهم الناس والأسواق", "نطوّر ما نقدّمه", "نعزّز الثقة عبر التحسين", "نحسّن أساليب العمل", "نربط الإمداد باحتياجات السوق", "ننمو بالمعرفة المشتركة"];
    for (let index = 0; index < expectedHeadings.length; index++) {
      await tabs.nth(index).click();
      await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
      await expect(panel.locator("h3")).toHaveText(expectedHeadings[index]);
      await expect(panel.locator("li")).toHaveCount(3);
      await expect(panel).toHaveAttribute("aria-labelledby", await tabs.nth(index).getAttribute("id") as string);
    }
    await tabs.nth(0).focus();
    await tabs.nth(0).press(locale === "ar" ? "ArrowLeft" : "ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(panel.locator("h3")).toHaveText(expectedHeadings[1]);
    const steps = page.locator('[id^="journey-tab-"]');
    await expect(steps).toHaveCount(4);
    for (let index = 0; index < 4; index++) {
      await steps.nth(index).click();
      await expect(page.locator("#innovation-journey-panel")).toHaveAttribute("aria-labelledby", `journey-tab-${index}`);
      await expect(steps.nth(index)).toHaveAttribute("aria-selected", "true");
    }
    await expect(page.locator('main a[href$="/contact"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.locator(".language-switch").click();
    await expect(page).toHaveURL(new RegExp(`/${locale === "en" ? "ar" : "en"}/research-innovation-2$`));
  });

  test(`${locale} Research & Innovation submenu links to both versions`, async ({page, isMobile}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    if (!isMobile) await page.setViewportSize({width: 1440, height: 1000});
    await page.goto(`/${locale}/research-innovation`);
    await expect(page.locator("h1")).toHaveText(locale === "en" ? "Creating Food Solutions for a Changing Market" : "نطوّر حلولاً غذائية لسوق متغير");
    const name = locale === "en" ? "Research & Innovation" : "البحث والابتكار";
    const newName = locale === "en" ? "Research & Innovation 2" : "البحث والابتكار ٢";
    if (isMobile) {
      await page.locator(".mobile-trigger").click();
      const menu = page.locator(".mobile-menu");
      await menu.locator("summary").filter({hasText: name}).click();
      await expect(menu.getByRole("link", {name, exact: true})).toHaveAttribute("href", `/${locale}/research-innovation`);
      await menu.getByRole("link", {name: newName, exact: true}).click();
    } else {
      await page.locator(".desktop-nav").getByRole("button", {name, exact: true}).hover();
      const menu = page.locator(".mega-menu.is-open");
      await expect(menu.locator(`a[href="/${locale}/research-innovation"]`)).toBeVisible();
      await menu.locator(`a[href="/${locale}/research-innovation-2"]`).click();
    }
    await expect(page).toHaveURL(new RegExp(`/${locale}/research-innovation-2$`));
    await expect(page.locator("h1")).toBeVisible();
  });
}
