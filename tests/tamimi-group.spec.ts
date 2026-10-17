import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} Tamimi Group is a concise overview with six sectors`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}/about/group-story-tamimi-group`);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page.locator("h1")).toHaveText(locale === "en" ? "Masdar Al Hayat is Part of Tamimi Group" : "مصدر الحياة جزء من مجموعة التميمي");
    await expect(page.locator("main > section")).toHaveCount(2);
    await expect(page.locator(".tamimi-sector")).toHaveCount(6);
    await expect(page.locator(".tamimi-sectors img")).toHaveCount(6);
    await expect(page.locator("[data-heritage-grid], [data-timeline], .closing-section")).toHaveCount(0);
    await expect(page.locator(".inner-hero__content")).toContainText(locale === "en" ? "21,000" : "٢١٬٠٠٠");
    await expect(page.locator(".inner-hero__content")).toContainText(locale === "en" ? "40 subsidiaries and joint ventures" : "٤٠ شركة تابعة ومشروعاً مشتركاً");
    const titles = locale === "en"
      ? ["Industrial, Construction & Infrastructure", "Food and Retail", "Real Estate", "Investments", "Transportation & Logistics", "Services, Catering & Facility Management"]
      : ["الصناعة والإنشاءات والبنية التحتية", "الأغذية والتجزئة", "العقارات", "الاستثمارات", "النقل والخدمات اللوجستية", "الخدمات والإعاشة وإدارة المرافق"];
    await expect(page.locator(".tamimi-sector h3")).toHaveText(titles);
    await expect(page.locator(".inner-hero__media img")).toHaveCount(1);
    await expect(page.locator(".inner-hero__media img")).toHaveAttribute("src", /tamimi-group-logo-2026/);
    await expect(page.locator(".inner-hero__media .brand-image")).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(7);
    // Lazy images can be outside the horizontal scroller until their card is reached.
    for (const image of await page.locator("main img").all()) {
      await image.evaluate(async element => {
        const img = element as HTMLImageElement;
        img.loading = "eager";
        await img.decode();
      });
    }
    await expect(page.locator("main")).not.toContainText(locale === "en" ? /Our Vision|Our Mission|The Beginning of the Journey|Growing with the Kingdom/ : /رؤيتنا|رسالتنا|بداية المسيرة|ننمو مع المملكة/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });

  test(`${locale} sector slider reaches the final sector`, async ({page, isMobile}) => {
    await page.emulateMedia({reducedMotion: isMobile ? "reduce" : "no-preference"});
    await page.goto(`/${locale}/about/group-story-tamimi-group`);
    const section = page.locator(".tamimi-sectors");
    const stage = section.locator(".manufacturing-flow__stage");
    const finalCard = section.locator(".tamimi-sector").last();
    if (isMobile) {
      await stage.scrollIntoViewIfNeeded();
      await stage.evaluate((element, rtl) => element.scrollTo({left: rtl ? -element.scrollWidth : element.scrollWidth}), locale === "ar");
    } else {
      await expect(section).toHaveClass(/is-enhanced/);
      const {start, distance} = await section.evaluate(element => {
        const spacer = element.parentElement!;
        return {start: spacer.getBoundingClientRect().top + scrollY, distance: spacer.offsetHeight - innerHeight};
      });
      await page.evaluate(y => window.scrollTo(0, y), start + distance * .4);
      await expect.poll(async () => section.locator(".tamimi-sector.is-active h3").textContent()).toBe(await section.locator(".tamimi-sector h3").nth(2).textContent());
      await page.evaluate(y => window.scrollTo(0, y), start + distance - 2);
      await expect.poll(async () => section.locator(".tamimi-sector.is-active").locator("h3").textContent()).toBe(await finalCard.locator("h3").textContent());
    }
    await expect.poll(async () => finalCard.evaluate(element => {
      const card = element.getBoundingClientRect();
      const viewport = element.closest(".manufacturing-flow__stage")!.getBoundingClientRect();
      return card.left >= viewport.left - 5 && card.right <= viewport.right + 5;
    })).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
