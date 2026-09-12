import {chromium} from "playwright";

const browser = await chromium.launch({headless: true, channel: "chrome"});
const page = await browser.newPage({viewport: {width: 1440, height: 900}});
await page.goto("http://localhost:3001/brands-partnerships/brands", {waitUntil: "networkidle"});

await page.getByRole("button", {name: "Our Brands"}).hover();
await page.waitForTimeout(450);
await page.screenshot({path: ".tmp-brands-menu.png"});
const amrajMenuLogo = page.locator(".mega-menu__brand-logo--amraj");
await amrajMenuLogo.screenshot({path: ".tmp-amraj-menu-logo.png"});
console.log(JSON.stringify(await amrajMenuLogo.locator("img").evaluate((image) => ({
  objectFit: getComputedStyle(image).objectFit,
  objectPosition: getComputedStyle(image).objectPosition,
  rect: image.getBoundingClientRect().toJSON(),
  naturalWidth: image.naturalWidth,
  naturalHeight: image.naturalHeight,
}))));

const heading = page.getByRole("heading", {name: "Distinctive Brands for Evolving Food Moments"});
await heading.evaluate((element) => element.scrollIntoView({block: "start"}));
await page.waitForTimeout(450);
await page.screenshot({path: ".tmp-brand-cards.png"});

const geometry = await page.evaluate(() => Array.from(document.querySelectorAll(".brand-portfolio-card")).map((card) => {
  const rect = card.getBoundingClientRect();
  const image = card.querySelector(".brand-portfolio-card__logo img");
  const logoRect = card.querySelector(".brand-portfolio-card__logo")?.getBoundingClientRect();
  const contentRect = card.querySelector(".brand-portfolio-card__content")?.getBoundingClientRect();
  return {
    title: card.querySelector("h3")?.textContent?.trim(),
    top: Math.round(rect.top),
    bottom: Math.round(rect.bottom),
    height: Math.round(rect.height),
    logoTop: Math.round(logoRect?.top ?? 0),
    logoBottom: Math.round(logoRect?.bottom ?? 0),
    contentTop: Math.round(contentRect?.top ?? 0),
    objectFit: image ? getComputedStyle(image).objectFit : null,
    objectPosition: image ? getComputedStyle(image).objectPosition : null,
  };
}));
console.log(JSON.stringify(geometry, null, 2));

const tablet = await browser.newPage({viewport: {width: 900, height: 900}});
await tablet.goto("http://localhost:3001/brands-partnerships/brands", {waitUntil: "networkidle"});
const tabletHeading = tablet.getByRole("heading", {name: "Distinctive Brands for Evolving Food Moments"});
await tabletHeading.evaluate((element) => element.scrollIntoView({block: "start"}));
await tablet.waitForTimeout(450);
await tablet.screenshot({path: ".tmp-brand-cards-tablet.png"});
console.log(JSON.stringify(await tablet.evaluate(() => Array.from(document.querySelectorAll(".brand-portfolio-card")).map((card) => {
  const rect = card.getBoundingClientRect();
  return {title: card.querySelector("h3")?.textContent?.trim(), x: Math.round(rect.x), width: Math.round(rect.width), top: Math.round(rect.top)};
})), null, 2));
await browser.close();
