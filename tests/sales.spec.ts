import {expect, test} from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`Sales page supports ${locale} navigation and enquiries`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/${locale}/capabilities/sales`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page.locator("main > section")).toHaveCount(3);
    await expect(page.locator(".sales-customers__grid article")).toHaveCount(3);
    await expect(page.locator(".sales-customers__grid")).toContainText(locale === "ar" ? "المتاجر المحلية ومتاجر المواد الغذائية" : "Local / Grocery Stores");
    await expect(page.locator(".inner-hero__media img")).toHaveAttribute("src", /masdar-18\.png/);
    await expect(page.locator(".sales-customers__image img")).toHaveAttribute("src", /masdar-19\.png/);
    await expect(page.locator("main")).not.toContainText(/baqala/i);

    if (await page.locator(".desktop-nav").isVisible()) {
      await page.locator(".desktop-nav .nav-group").filter({has: page.getByRole("button", {name: locale === "ar" ? "قدراتنا" : "Our Capabilities", exact: true})}).hover();
      await expect(page.locator(".mega-menu.is-open").getByRole("link", {name: /^05\s*(Sales|المبيعات)/})).toHaveAttribute("href", `/${locale}/capabilities/sales`);
    } else {
      await page.locator(".mobile-trigger").click();
      const capabilities = page.locator(".mobile-menu details").filter({has: page.locator("summary", {hasText: locale === "ar" ? "قدراتنا" : "Our Capabilities"})});
      await capabilities.locator("summary").click();
      await capabilities.getByRole("link", {name: locale === "ar" ? "المبيعات" : "Sales", exact: true}).click();
      await expect(page.locator(".mobile-menu")).not.toHaveClass(/is-open/);
    }

    await expect(page.locator(".inner-hero__actions a")).toHaveAttribute("href", `/${locale}/contact#contact-form`);
    await page.locator(".closing-section a").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact#contact-form$`));
    await expect(page.locator("#contact-form")).toBeAttached();

    await page.goto(`/${locale}/capabilities/sales`);
    await page.locator(".language-switch").click();
    const otherLocale = locale === "ar" ? "en" : "ar";
    await expect(page).toHaveURL(new RegExp(`/${otherLocale}/capabilities/sales$`));
    await expect(page.locator("html")).toHaveAttribute("lang", otherLocale);
  });
}
