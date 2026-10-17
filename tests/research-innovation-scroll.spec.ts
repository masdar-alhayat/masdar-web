import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"]) {
  test(`${locale} innovation tabs follow desktop scroll and stay manual on mobile`, async ({page, isMobile}) => {
    if (!isMobile) await page.setViewportSize({width: 1440, height: 1000});
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.goto(`/${locale}/research-innovation-2`);
    await page.evaluate(() => document.fonts.ready);
    const tabs = page.locator('#innovation-areas [role="tab"]');
    const panel = page.locator("#innovation-area-panel");
    const spacer = page.locator("#innovation-areas .pin-spacer");
    if (isMobile) {
      await expect(spacer).toHaveCount(0);
      await tabs.nth(3).click();
      await page.evaluate(() => window.scrollBy({top: 300, behavior: "instant"}));
      await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
      await expect(panel).toHaveAttribute("aria-labelledby", "innovation-tab-operations");
      return;
    }
    await expect(spacer).toHaveCount(1);
    const start = await spacer.evaluate(element => element.getBoundingClientRect().top + scrollY - document.querySelector(".site-header")!.getBoundingClientRect().height - 20);
    const distance = 5 * 650;
    for (const index of [0, 1, 2, 3, 4, 5, 2]) {
      await page.evaluate(top => window.scrollTo({top, behavior: "instant"}), start + distance * index / 5);
      await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
      await expect(panel).toHaveAttribute("aria-labelledby", await tabs.nth(index).getAttribute("id") as string);
    }
    await tabs.nth(4).click();
    await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");
    await expect(panel).toHaveAttribute("aria-labelledby", "innovation-tab-supply");
    const pinned = await panel.boundingBox();
    expect(pinned!.y).toBeGreaterThan(100);
    expect(pinned!.y + pinned!.height).toBeLessThan(1000);
  });
}
