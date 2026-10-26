import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} Fonte brand page presents the approved hero, products and film`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    const response = await page.goto(`/${locale}/brands-partnerships/brands`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Fonte|فونتي/);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "en" ? "ltr" : "rtl");
    await expect(page.locator("h1")).toContainText(locale === "en" ? "Every Occasion." : "لكل مناسبة");
    await expect(page.locator(".site-logo img")).toHaveAttribute("alt", "Masdar Al Hayat for Food Industries");
    const hero = page.locator("main > section").first();
    await expect(hero.locator("figure figcaption")).toHaveCount(0);
    await expect(hero).not.toContainText(locale === "en" ? "From our family to yours" : "من مائدتنا إلى مائدتكم");
    await expect(hero).not.toContainText(locale === "en" ? /Taste.*Quality.*Convenience/i : /المذاق.*الجودة.*السهولة/);
    const brandLogo = hero.locator('img[alt="Fonte — فونتي"]');
    const brandSignature = brandLogo.locator("..");
    const logoBox = await brandLogo.boundingBox();
    const signatureBox = await brandSignature.boundingBox();
    expect(logoBox!.width).toBeGreaterThanOrEqual(200);
    expect(Math.abs((logoBox!.x + logoBox!.width / 2) - (signatureBox!.x + signatureBox!.width / 2))).toBeLessThan(2);
    await expect(brandSignature.locator("span")).toContainText(locale === "en" ? "The flagship brand of Masdar Al Hayat" : "العلامة الرئيسية لمصدر الحياة");
    const signatureTextBox = await brandSignature.locator("span").boundingBox();
    expect(signatureTextBox!.y).toBeGreaterThanOrEqual(logoBox!.y + logoBox!.height);
    const collection = hero.locator('img[alt*="product collection"], img[alt*="مجموعة منتجات فونتي"]');
    await collection.evaluate(async image => {await (image as HTMLImageElement).decode();});
    await expect(collection).toHaveCSS("object-fit", "contain");
    await hero.screenshot({path: `.codex-temp/fonte-design/hero-${locale}-${test.info().project.name}.png`});

    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(6);
    const categories = locale === "en"
      ? ["Fonte Tortillas", "Sliced Breads", "Specialty Buns", "Pastries", "Tomato Paste", "Bread Crumbs"]
      : ["تورتيلا فونتي", "الخبز المقطّع", "خبز البرغر المتخصص", "المعجنات والحلويات", "معجون الطماطم", "فتات الخبز"];
    for (const [index, name] of categories.entries()) {
      await expect(tabs.nth(index)).toHaveText(name);
      await tabs.nth(index).click();
      await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
      const panel = page.getByRole("tabpanel");
      await expect(panel).toHaveCount(1);
      await expect(panel.getByRole("heading")).toHaveText(name);
      await panel.locator("img").evaluate(async image => {await (image as HTMLImageElement).decode();});
    }
    await tabs.last().press("Home");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await page.locator("#fonte-products").screenshot({path: `.codex-temp/fonte-design/products-${locale}-${test.info().project.name}.png`});
    const film = page.locator('#fonte-film video');
    await expect(film).toHaveAttribute("src", "/assets/videos/manufacturing-combined-enhanced-v2.mp4");
    expect(await film.getAttribute("controls")).toBeNull();
    if (test.info().project.name === "chromium") await film.hover();
    expect(await film.evaluate(video => (video as HTMLVideoElement).controls)).toBe(false);
    await expect(page.locator('#fonte-film .container-xxl > div:last-child > span')).toHaveCount(0);
    await expect(page.locator('#fonte-clients .logo-carousel__group:not([aria-hidden="true"]) .logo-carousel__card')).toHaveCount(14);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  });

  test(`${locale} Fonte is the first page in Our Brands and uses the corporate header`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}`);
    const brandLabel = locale === "en" ? "Our Brands" : "علاماتنا التجارية";
    const desktop = await page.locator(".desktop-nav").isVisible();
    let menu;
    if (desktop) {
      await page.locator(".desktop-nav .nav-group").filter({has: page.getByRole("button", {name: brandLabel, exact: true})}).hover();
      menu = page.locator(".mega-menu.is-open .mega-menu__links");
    } else {
      await page.locator(".mobile-trigger").click();
      const brands = page.locator(".mobile-menu details").filter({has: page.locator("summary", {hasText: brandLabel})});
      await brands.locator("summary").click();
      menu = brands;
    }
    const links = menu.locator("a");
    await expect(links).toHaveCount(5);
    const link = links.first();
    await expect(link).toHaveAttribute("href", `/${locale}/brands-partnerships/brands`);
    await expect(link.locator("img")).toHaveCount(1);
    await expect(link).toContainText(locale === "en" ? "Fonte" : "فونتي");
    await expect(menu.locator(`a[href="/${locale}/brands-partnerships/fonte-test"]`)).toHaveCount(0);
    await expect(menu).not.toContainText(/Fonte Test|تجريبي/);
    await link.click();
    await expect(page).toHaveURL(`/${locale}/brands-partnerships/brands`);
    await expect(page.locator(".site-logo img")).toHaveAttribute("alt", "Masdar Al Hayat for Food Industries");
    await expect(page.locator("#fonte-products")).toHaveCount(1);
  });

  test(`${locale} legacy Fonte Test route redirects to Fonte`, async ({page}) => {
    await page.goto(`/${locale}/brands-partnerships/fonte-test`);
    await expect(page).toHaveURL(`/${locale}/brands-partnerships/brands`);
  });
}
