import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} home glance banners expand, and hidden sections stay hidden`, async ({page, isMobile}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}`);
    const banners = page.locator(".glance-banner");
    await expect(banners).toHaveCount(5);
    await page.locator(".glance-banners").evaluate(element => element.scrollIntoView({block: "center", behavior: "instant"}));
    const target = banners.nth(2);

    if (isMobile) {
      // Mobile shows one card per slide, with dots to move between them.
      await expect(banners.nth(0)).toBeInViewport({ratio: .95});
      await expect(banners.nth(1)).not.toBeInViewport({ratio: .5});
      const dots = page.locator(".glance-dots button");
      await expect(dots).toHaveCount(5);
      await dots.nth(2).click();
      await expect(target).toBeInViewport({ratio: .95});
      await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");
      await expect(target.locator(".glance-banner__body p")).toBeVisible();
    } else {
      for (const banner of await banners.all()) await expect(banner).toBeInViewport();
      await expect(page.locator(".glance-dots")).toBeHidden();
      await target.hover();
      await expect(target).toHaveAttribute("data-active", "true");
      await expect(target.locator(".glance-banner__body p")).toBeVisible();
      await expect(page.locator('.glance-banner[data-active="true"]')).toHaveCount(1);
    }

    await expect(page.locator(".portfolio-home")).toHaveCount(0);
    await expect(page.locator(".legacy-home")).toHaveCount(0);
    await expect(page.locator(".partnership-home header p")).toHaveCount(1);
    await expect(page.locator(".partnership-home h2")).toHaveText(locale === "en" ? "Partnerships Built for Shared Growth" : "شراكات تقوم على النمو المشترك");
    await expect(page.locator(".careers-home h2")).toHaveText(locale === "en" ? "Build a Career That Touches Everyday Life" : "مسيرة مهنية تلامس الحياة اليومية");
    await expect(page.locator(".careers-home__grid > div p")).toHaveCount(1);
    await expect(page.locator(".quality-home h2")).toHaveCSS("text-align", "start");
    await expect(page.locator(".home-final p")).toHaveCount(1);
    expect(await page.locator(".home-final h2").evaluate(h2 => parseFloat(getComputedStyle(h2).fontSize))).toBeLessThanOrEqual(56);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  });
}
