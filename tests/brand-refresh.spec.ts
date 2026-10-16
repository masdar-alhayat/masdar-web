import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} brand profiles, logos and navigation`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}/brands-partnerships/brands-portfolio`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/brands-partnerships/brands-portfolio$`));
    await expect(page.locator(".brand-profile")).toHaveCount(4);
    await expect(page.locator(".brand-profile#fonte")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/Nature.s Oven|نيتشر/);
    for (const id of ["fonte-horeca", "paneto", "amraj", "demirco"]) {
      const row = page.locator(`.brand-profile#${id}`);
      await row.scrollIntoViewIfNeeded();
      await row.locator("img").evaluate(async image => { await (image as HTMLImageElement).decode(); });
      if (page.viewportSize()!.width > 767) {
        const logo = await row.locator(".brand-profile__logo").boundingBox();
        const copy = await row.locator(".brand-profile__copy").boundingBox();
        expect(locale === "en" ? logo!.x < copy!.x : logo!.x > copy!.x).toBeTruthy();
      }
    }
    await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));
    const desktop = await page.locator(".desktop-nav").isVisible();
    let links;
    if (desktop) {
      await page.locator(".desktop-nav .nav-group").filter({hasText: locale === "en" ? "Our Brands" : "علاماتنا التجارية"}).hover();
      links = page.locator(".mega-menu.is-open .mega-menu__links");
    } else {
      await page.locator(".mobile-trigger").click();
      const brands = page.locator(".mobile-menu details").filter({has: page.locator("summary", {hasText: locale === "en" ? "Our Brands" : "علاماتنا التجارية"})});
      await brands.locator("summary").click();
      links = brands;
    }
    await expect(links.locator("a")).toHaveCount(5);
    await expect(links.locator("a").nth(0)).toHaveAttribute("href", `/${locale}/brands-partnerships/brands`);
    for (const [index, id] of ["fonte-horeca", "paneto", "amraj", "demirco"].entries()) {
      await expect(links.locator("a").nth(index + 1)).toHaveAttribute("href", `/${locale}/brands-partnerships/brands-portfolio#${id}`);
    }
    await links.locator("a").nth(4).click();
    await expect(page).toHaveURL(/brands-portfolio#demirco$/);
    await expect(page.locator("#demirco h2")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });

  test(`${locale} document clients, mission and logistics figures`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}/brands-partnerships/brands`);
    await expect(page.locator(".brand-profiles, .brand-portfolio-section")).toHaveCount(0);
    await expect(page.locator(".horeca-brand")).toHaveCount(0);
    await expect(page.locator('.logo-carousel__group:not([aria-hidden="true"]) .logo-carousel__card')).toHaveCount(14);
    await page.goto(`/${locale}/brands-partnerships/partnerships`);
    await expect(page.locator("main")).not.toContainText(locale === "en" ? "Our Partnership Approach" : "نهجنا في الشراكات");
    await expect(page.locator(".partnership-journey-section")).toHaveCount(0);
    await expect(page.locator('.logo-carousel__group:not([aria-hidden="true"]) .logo-carousel__card')).toHaveCount(23);
    for (const image of await page.locator('.logo-carousel__group:not([aria-hidden="true"]) img').all()) {
      await image.evaluate(async image => { const img = image as HTMLImageElement; img.loading = "eager"; await img.decode(); });
    }
    await page.goto(`/${locale}/research-innovation`);
    await expect(page.locator("main")).not.toContainText(locale === "en" ? "Smarter Operations" : "عمليات أكثر ذكاءً");
    await page.goto(`/${locale}/about/vision-mission-values`);
    await expect(page.locator(".vision-statement-feature-section")).toContainText(locale === "en" ? "government sectors, institutions and individuals efficiently and sustainably" : "القطاعات الحكومية والمؤسسات والأفراد بكفاءة واستدامة");
    await expect(page.locator(".mission-statement-section")).toContainText(locale === "en" ? "a modern distribution network and tailored solutions for hospitality" : "وشبكة توزيع حديثة، وحلول مخصصة لقطاع الضيافة");
    await page.goto(`/${locale}/capabilities/logistics-distribution`);
    await expect(page.locator(".logistics-strength")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const values = page.locator(".logistics-strength [data-manufacturing-count]");
    await expect(values).toHaveCount(4);
    for (const [index, number] of [16, 500, 4, 10].entries()) await expect(values.nth(index)).toHaveAttribute("data-manufacturing-count", String(number));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("client logo loop moves and can be paused", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en/brands-partnerships/partnerships");
  const carousel = page.locator(".logo-carousel");
  await carousel.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(carousel).toHaveAttribute("data-running", "true");
  const track = carousel.locator(".logo-carousel__track").first();
  const initial = await track.evaluate(element => getComputedStyle(element).transform);
  await expect.poll(() => track.evaluate(element => getComputedStyle(element).transform)).not.toBe(initial);
  await carousel.getByRole("button", {name: "Pause logo animation"}).click();
  await expect(carousel).toHaveAttribute("data-running", "false");
  await carousel.getByRole("button", {name: "Play logo animation"}).click();
  await expect(carousel).toHaveAttribute("data-running", "true");
});
