import Image from "next/image";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { ArrowLink } from "./ArrowLink";
import { BrandImage } from "./BrandImage";
import { CorporateForm } from "./CorporateForm";
import { ContactLocationMap } from "./ContactLocationMap";
import { FocusConnector } from "./FocusConnector";
import {
  ManufacturingCapabilitiesFlow,
  type ManufacturingCapabilityItem,
} from "./ManufacturingCapabilitiesFlow";
import {
  HeritageTimeline,
  type HeritageTimelineMilestone,
} from "./HeritageTimeline";
import contactLocationStyles from "./ContactLocationMap.module.css";
import {
  IndustryEngagementCarousel,
  type IndustryEngagementSlide,
} from "./IndustryEngagementCarousel";
import industryEngagementStyles from "./IndustryEngagementCarousel.module.css";
import {
  IndustryCompetitionEngine,
  type IndustryCompetitionFactor,
  type IndustryCompetitionPillar,
} from "./IndustryCompetitionEngine";
import industryCompetitionStyles from "./IndustryCompetitionEngine.module.css";
import competitiveFoundationsStyles from "./CompetitiveFoundationsFlow.module.css";
import {
  CompetitiveFoundationsFlow,
  type CompetitiveFoundationItem,
} from "./CompetitiveFoundationsFlow";

import {
  byLabel,
  isStructuralLabel,
  numberedGroups,
  paragraphs,
  resolveCtaHref,
  sectionDisplayTitle,
  value,
} from "@/lib/content";

import type {
  ContentItem,
  ContentSection,
  Locale,
  PageTheme,
} from "@/types/content";

import {
  Boxes,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  CircleCheckBig,
  Check,
  ChefHat,
  ChevronRight,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Gauge,
  Handshake,
  Hotel,
  Lightbulb,
  Mail,
  MapPin,
  MonitorCog,
  PackageCheck,
  PackageOpen,
  Phone,
  Radar,
  RefreshCw,
  ScanLine,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Soup,
  Sparkles,
  ShoppingCart,
  Sprout,
  UsersRound,
  Wheat,
  Warehouse,
  Truck,
  Zap,
} from "lucide-react";

interface SectionRendererProps {
  section: ContentSection;
  index: number;
  locale: Locale;
  theme: PageTheme;
  image: string;
}

function meaningful(item: ContentItem, locale: Locale): boolean {
  return Boolean(value(item, locale));
}

function visibleItemLabel(label: ContentItem["label"], locale: Locale): string {
  const rawLabel = String(label ?? "");

  if (locale === "ar" && rawLabel === "Key Focus Areas") {
    return "مجالات التركيز الرئيسية";
  }

  return rawLabel;
}

interface IndexedLocalizedValue {
  index: number;
  text: string;
}

interface IndexedLocalizedPair {
  index: number;
  label: string;
  value: string;
}

function localizedItemValue(
  section: ContentSection,
  label: string | RegExp,
  locale: Locale,
): string {
  return value(byLabel(section, label), locale);
}

function firstLocalizedItemValue(
  section: ContentSection,
  locale: Locale,
  labels: Array<string | RegExp>,
): string {
  for (const label of labels) {
    const localizedValue = localizedItemValue(
      section,
      label,
      locale,
    ).trim();

    if (localizedValue) {
      return localizedValue;
    }
  }

  return "";
}

function indexedLocalizedValues(
  section: ContentSection,
  locale: Locale,
  labelPattern: RegExp,
): IndexedLocalizedValue[] {
  return section.items
    .map((item) => {
      const match = String(item.label ?? "").match(labelPattern);
      const text = value(item, locale);

      if (!match || !text) {
        return null;
      }

      return {
        index: Number(match[1]),
        text,
      };
    })
    .filter(
      (item): item is IndexedLocalizedValue =>
        item !== null && Number.isFinite(item.index),
    )
    .sort((a, b) => a.index - b.index);
}

function indexedLocalizedPairs(
  section: ContentSection,
  locale: Locale,
  labelPattern: RegExp,
): IndexedLocalizedPair[] {
  const pairs = new Map<number, IndexedLocalizedPair>();

  section.items.forEach((item) => {
    const match = String(item.label ?? "").match(labelPattern);
    const localizedValue = value(item, locale);

    if (!match || !localizedValue) {
      return;
    }

    const pairIndex = Number(match[1]);
    const field = match[2]?.toLowerCase();

    if (!Number.isFinite(pairIndex)) {
      return;
    }

    const pair = pairs.get(pairIndex) ?? {
      index: pairIndex,
      label: "",
      value: "",
    };

    if (field === "label") {
      pair.label = localizedValue;
    }

    if (field === "value") {
      pair.value = localizedValue;
    }

    pairs.set(pairIndex, pair);
  });

  return Array.from(pairs.values())
    .filter((pair) => pair.label && pair.value)
    .sort((a, b) => a.index - b.index);
}

function indexedCarouselSlides(
  section: ContentSection,
  locale: Locale,
): IndustryEngagementSlide[] {
  const slides = new Map<number, Partial<IndustryEngagementSlide>>();

  section.items.forEach((item) => {
    const match = String(item.label ?? "").match(
      /^Carousel Slide (\d+) (Image|Alt|Label|Caption)$/i,
    );

    if (!match) {
      return;
    }

    const slideIndex = Number(match[1]);
    const field = match[2].toLowerCase();
    const localizedValue =
      value(item, locale).trim() || value(item, "en").trim();

    if (!Number.isFinite(slideIndex) || !localizedValue) {
      return;
    }

    const slide = slides.get(slideIndex) ?? { index: slideIndex };

    if (field === "image") slide.image = localizedValue;
    if (field === "alt") slide.alt = localizedValue;
    if (field === "label") slide.label = localizedValue;
    if (field === "caption") slide.caption = localizedValue;

    slides.set(slideIndex, slide);
  });

  return Array.from(slides.values())
    .filter(
      (slide): slide is IndustryEngagementSlide =>
        typeof slide.index === "number" &&
        Boolean(slide.image && slide.alt && slide.label && slide.caption),
    )
    .sort((a, b) => a.index - b.index);
}

function indexedCompetitionPillars(
  section: ContentSection,
  locale: Locale,
): IndustryCompetitionPillar[] {
  const pillars = new Map<number, Partial<IndustryCompetitionPillar>>();

  section.items.forEach((item) => {
    const match = String(item.label ?? "").match(
      /^Competition Pillar (\d+) (Title|Description)$/i,
    );

    if (!match) return;

    const pillarIndex = Number(match[1]);
    const field = match[2].toLowerCase();
    const localizedValue = value(item, locale).trim();

    if (!Number.isFinite(pillarIndex) || !localizedValue) return;

    const pillar = pillars.get(pillarIndex) ?? { index: pillarIndex };

    if (field === "title") pillar.title = localizedValue;
    if (field === "description") pillar.description = localizedValue;

    pillars.set(pillarIndex, pillar);
  });

  return Array.from(pillars.values())
    .filter(
      (pillar): pillar is IndustryCompetitionPillar =>
        typeof pillar.index === "number" &&
        Boolean(pillar.title && pillar.description),
    )
    .sort((a, b) => a.index - b.index);
}

function indexedCompetitionFactors(
  section: ContentSection,
  locale: Locale,
): IndustryCompetitionFactor[] {
  return section.items
    .map((item) => {
      const match = String(item.label ?? "").match(
        /^Competition Factor (\d+)$/i,
      );
      const text = value(item, locale).trim();

      if (!match || !text) return null;

      return {
        index: Number(match[1]),
        text,
      };
    })
    .filter(
      (factor): factor is IndustryCompetitionFactor =>
        factor !== null && Number.isFinite(factor.index),
    )
    .sort((a, b) => a.index - b.index);
}

function indexedCompetitiveFoundations(
  section: ContentSection,
  locale: Locale,
): CompetitiveFoundationItem[] {
  const foundations = new Map<number, Partial<CompetitiveFoundationItem>>();

  section.items.forEach((item) => {
    const match = String(item.label ?? "").match(
      /^Differentiator (\d+) (Title|Description)$/i,
    );

    if (!match) return;

    const foundationIndex = Number(match[1]);
    const field = match[2].toLowerCase();
    const localizedValue = value(item, locale).trim();

    if (!Number.isFinite(foundationIndex) || !localizedValue) return;

    const foundation = foundations.get(foundationIndex) ?? {
      index: foundationIndex,
    };

    if (field === "title") foundation.title = localizedValue;
    if (field === "description") foundation.description = localizedValue;

    foundations.set(foundationIndex, foundation);
  });

  return Array.from(foundations.values())
    .filter(
      (foundation): foundation is CompetitiveFoundationItem =>
        typeof foundation.index === "number" &&
        Boolean(foundation.title && foundation.description),
    )
    .sort((a, b) => a.index - b.index);
}

export function SectionRenderer({
  section,
  index,
  locale,
  theme,
  image,
}: SectionRendererProps) {
  const isAr = String(locale).toLowerCase().startsWith("ar");

  const sectionName = sectionDisplayTitle(section);

  const renderVariant = localizedItemValue(
    section,
    "Render Variant",
    locale,
  )
    .trim()
    .toLowerCase();

  const kicker = value(
    byLabel(section, "Section Label"),
    locale,
  ).trim();

  /*
   * Visible headings must come from bilingual content fields.
   * `section.title` is an English schema identifier and is used
   * only as a final English-side fallback for legacy sections.
   */
  const heading =
    firstLocalizedItemValue(section, locale, [
      "Display Heading",
      "Main Heading",
      "Value Title",
      "Short Heading",
    ]) ||
    kicker ||
    (!isAr ? sectionName : "");

  const visibleKicker =
    kicker && kicker !== heading ? kicker : "";

  const statementLabel = localizedItemValue(
    section,
    "Statement Label",
    locale,
  );

  const copy = paragraphs(section, locale);
  const groups = numberedGroups(section);

  const title = section.title.toLowerCase();

  const isForm =
    /form/.test(title) &&
    section.items.some((item) =>
      /^Field \d+$/.test(String(item.label)),
    );

  const formKind =
    theme === "partnership"
      ? "partnership"
      : theme === "careers"
        ? "careers"
        : "contact";

  const groupText = (
    group: (typeof groups)[number],
    part: string,
  ): string => {
    const localized =
      locale === "ar"
        ? group.parts[`Arabic ${part}`]
        : group.parts[`English ${part}`];

    return value(
      localized ||
      group.parts[part] ||
      group.parts.Text ||
      Object.values(group.parts)[0],
      locale,
    );
  };

  /*
   * ========================================================
   * Forms
   * ========================================================
   */

  if (isForm) {
    return (
      <AnimatedSection
        id={`${formKind === "careers" ? "career-application" : formKind === "partnership" ? "partnership-enquiry" : "contact-form"}`}
        className={`content-section content-section--form content-section--${theme}`}
        variant="rise"
      >
        <div className="container-xxl form-section-layout">
          <div
            className="form-section-copy"
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            <h2>{heading}</h2>

            <p>
              {isAr
                ? "أرسل معلوماتك من خلال النموذج الآمن، وسيتم توجيهها إلى الفريق المختص."
                : "Share your information through the secure form and it will be directed to the relevant team."}
            </p>
          </div>

          <CorporateForm
            section={section}
            locale={locale}
            kind={formKind}
          />
        </div>
      </AnimatedSection>
    );
  }

  /*
   * Content that has not already been classified as structural,
   * paragraph, numbered or form content.
   */

  const remaining = section.items.filter((item) => {
    const label = String(item.label ?? "");

    if (!meaningful(item, locale)) {
      return false;
    }

    if (isStructuralLabel(label)) {
      return false;
    }

    if (
      /^(Render Variant|Display Heading|Statement Label|Value Title|Commitment Crown|Commitment Layer|Commitment Foundation|Carousel Region Label|Carousel Previous Label|Carousel Next Label|Carousel Pause Label|Carousel Play Label|Carousel Slide|Competition Region Label|Competition Eyebrow|Competition Core Label|Competition Core Title|Competition Dimensions Label|Competition Pause Label|Competition Play Label|Competition Pillar|Competition Factor)/i.test(
        label,
      )
    ) {
      return false;
    }

    if (
      /Paragraph|Supporting Content|Introductory Content|Introduction|Statement|Closing Content/i.test(
        label,
      )
    ) {
      return false;
    }

    if (/\d+/.test(label)) {
      return false;
    }

    if (
      /Form Field|Submit Button|Success Message|Error Message|Consent Checkbox/i.test(
        label,
      )
    ) {
      return false;
    }

    return true;
  });

  if (theme === "careers" && title === "current opportunities") {
    const applicationCta = localizedItemValue(section, "CTA Text", locale);

    return (
      <AnimatedSection
        id="current-opportunities"
        className={`content-section career-opportunities-section content-section--${theme}`}
        variant="rise"
      >
        <div className="container-xxl">
          <header className="section-heading" data-animate>
            {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
            <h2>{heading}</h2>
            {copy.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
            {applicationCta && (
              <ArrowLink href="#career-application">{applicationCta}</ArrowLink>
            )}
          </header>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Contact Page — Embedded Corporate Location Map
   * ========================================================
   */

  if (renderVariant === "contact-location-map") {
    const locationName = localizedItemValue(
      section,
      "Location Name",
      locale,
    );

    const address = localizedItemValue(
      section,
      "Address",
      locale,
    );

    const locationDescription = localizedItemValue(
      section,
      "Location Description",
      locale,
    );

    const mapSrc = localizedItemValue(
      section,
      "Map Embed URL",
      locale,
    );

    const directionsHref =
      localizedItemValue(section, "Map Directions URL", locale) || mapSrc;

    const directionsLabel = localizedItemValue(
      section,
      "Map CTA",
      locale,
    );

    const mapRegionLabel = localizedItemValue(
      section,
      "Map Region Label",
      locale,
    );

    const badgeLabel = localizedItemValue(
      section,
      "Map Badge Label",
      locale,
    );

    const badgeValue = localizedItemValue(
      section,
      "Map Badge Value",
      locale,
    );

    return (
      <AnimatedSection
        className={`${contactLocationStyles.section} content-section content-section--${theme}`}
        variant="stagger"
      >
        <div
          className={`container-xxl ${contactLocationStyles.layout}`}
          dir={isAr ? "rtl" : "ltr"}
        >
          <div
            className={contactLocationStyles.copy}
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {locationDescription && (
              <p className={contactLocationStyles.copyDescription}>
                {locationDescription}
              </p>
            )}

            {(locationName || address) && (
              <div className={contactLocationStyles.addressBlock}>
                {locationName && <span>{locationName}</span>}
                {address && <p>{address}</p>}
              </div>
            )}
          </div>

          {mapSrc && (
            <div
              className={contactLocationStyles.visual}
              data-animate
            >
              <ContactLocationMap
                locale={locale}
                regionLabel={mapRegionLabel}
                title={heading}
                locationName={locationName}
                address={address}
                description={locationDescription}
                mapSrc={mapSrc}
                directionsHref={directionsHref}
                directionsLabel={directionsLabel}
                badgeLabel={badgeLabel}
                badgeValue={badgeValue}
              />
            </div>
          )}
        </div>
      </AnimatedSection>
    );
  }

  if (/Contact Information/i.test(section.title)) {
    const phone = localizedItemValue(section, "Phone", locale);
    const email = localizedItemValue(section, "Email", locale);
    const address = localizedItemValue(section, "Address", locale);
    const contactCards = [
      {label: isAr ? "الهاتف" : "Phone", value: phone, href: "tel:+966112656000", Icon: Phone},
      {label: isAr ? "البريد الإلكتروني" : "Email", value: email, href: `mailto:${email}`, Icon: Mail},
      {label: isAr ? "العنوان" : "Address", value: address, href: "https://www.google.com/maps/search/?api=1&query=Masdar%20Al-Hayat%20Food%20Industries%20Riyadh", Icon: MapPin},
    ].filter((card) => card.value);

    return (
      <AnimatedSection className={`content-section contact-card-section content-section--${theme}`} variant="stagger">
        <div className="container-xxl">
          <header className="section-heading" data-animate>
            {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
            <h2>{heading}</h2>
            {copy.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          </header>
          <div className="contact-card-grid">
            {contactCards.map(({label, value: cardValue, href, Icon}) => <a key={label} href={href} data-animate>
              <Icon aria-hidden="true"/>
              <span>{label}</span>
              <strong dir={label === "Phone" || label === "الهاتف" ? "ltr" : undefined}>{cardValue}</strong>
            </a>)}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (/Enquiry Categories/i.test(section.title)) {
    const enquiryIcons = [Lightbulb, Handshake, Radar, Factory, ShieldCheck, Sprout];

    return (
      <AnimatedSection className={`content-section enquiry-card-section content-section--${theme}`} variant="stagger">
        <div className="container-xxl">
          <header className="section-heading" data-animate>
            {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
            <h2>{heading}</h2>
          </header>
          <div className="enquiry-card-grid">
            {groups.map((group, groupIndex) => {
              const Icon = enquiryIcons[groupIndex % enquiryIcons.length];
              return <article key={group.key} data-animate>
                <span><Icon aria-hidden="true"/></span>
                <h3>{groupText(group, "Title")}</h3>
                <p>{value(group.parts.Description, locale)}</p>
              </article>;
            })}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (/Certifications & Standards/i.test(section.title)) {
    return (
      <AnimatedSection className={`content-section certificate-card-section content-section--${theme}`} variant="stagger">
        <div className="container-xxl">
          <header className="section-heading" data-animate>
            {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
            <h2>{heading}</h2>
            {copy.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          </header>
          <div className="certificate-card-grid">
            {groups.map((group) => <article key={group.key} data-animate>
              <ShieldCheck aria-hidden="true"/>
              <h3>{groupText(group, "Title")}</h3>
              <p>{value(group.parts.Description, locale)}</p>
            </article>)}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (/Our Brand Portfolio/i.test(section.title)) {
    const portfolioBrands = groups.filter((group) => group.prefix === "Brand").slice(0, 3);
    const brandAssets = [
      {key: "amraj", src: "/brand/amraj-logo.jpg"},
      {key: "paneto", src: "/brand/paneto-logo.png"},
      {key: "natures-oven", src: "/brand/natures-oven-logo.png"},
    ];

    return (
      <AnimatedSection className={`content-section brand-portfolio-section content-section--${theme}`} variant="stagger">
        <div className="container-xxl">
          <header className="brand-portfolio__header" data-animate>
            <div>
              {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
              <h2>{heading}</h2>
            </div>
            <div className="brand-portfolio__intro">
              {copy.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            </div>
          </header>

          <div className="brand-portfolio__grid">
            {portfolioBrands.map((brand, brandIndex) => {
              const asset = brandAssets[brandIndex];
              const brandTitle = groupText(brand, "Title");

              return (
                <article className={`brand-portfolio-card brand-portfolio-card--${asset.key}`} key={brand.key} data-animate>
                  <div className="brand-portfolio-card__logo">
                    <Image
                      src={asset.src}
                      alt={`${brandTitle} ${isAr ? "شعار" : "logo"}`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    />
                  </div>
                  <div className="brand-portfolio-card__content">
                    <span aria-hidden="true" />
                    <h3>{brandTitle}</h3>
                    <p>{value(brand.parts.Description, locale)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (/Flagship Brand/i.test(section.title)) {
    const productCategories = groups.filter((group) => group.prefix === "Product Category");
    const categoryIcons = [Wheat, PackageOpen, ChefHat, Sparkles, Soup, Boxes];
    const primary = localizedItemValue(section, "Primary CTA", locale);
    const secondary = localizedItemValue(section, "Secondary CTA", locale);

    return (
      <AnimatedSection className={`content-section flagship-brand-section content-section--${theme}`} variant="mask">
        <div className="container-xxl flagship-brand__grid">
          <div className="flagship-brand__mark" data-animate>
            <span className="flagship-brand__halo" aria-hidden="true" />
            <Image
              src="/brand/fonte-logo-full.png"
              alt={isAr ? "شعار فونتي الكامل" : "Fonte full logo"}
              width={640}
              height={500}
              className="flagship-brand__logo"
            />
            <small>{isAr ? "العلامة الرئيسية لمصدر الحياة" : "The flagship brand of Masdar Al Hayat"}</small>
          </div>
          <div className="flagship-brand__copy" data-animate>
            {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
            <h2>{heading}</h2>
            {copy.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            <div className="flagship-brand__range-heading">
              <span>{isAr ? "مجموعة المنتجات" : "Product range"}</span>
              <i aria-hidden="true" />
            </div>
            <div className="flagship-brand__categories">
              {productCategories.map((category, categoryIndex) => {
                const Icon = categoryIcons[categoryIndex % categoryIcons.length];
                return (
                  <article key={category.key}>
                    <span><Icon aria-hidden="true" /></span>
                    <div>
                      <h3>{groupText(category, "Title")}</h3>
                      <p>{value(category.parts.Description, locale)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="flagship-brand__actions">
              {primary && <ArrowLink href={resolveCtaHref(primary)}>{primary}</ArrowLink>}
              {secondary && <ArrowLink href={resolveCtaHref(secondary)}>{secondary}</ArrowLink>}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (/Beginning of the Journey/i.test(section.title)) {
    const beginningImageAlt = isAr
      ? "صورة أرشيفية لبدايات مجموعة التميمي"
      : "An archival photograph from the early history of Tamimi Group";

    return (
      <AnimatedSection className={`content-section heritage-beginning-section content-section--${theme}`} variant="mask">
        <div className="container-xxl heritage-beginning__layout">
          <div className="heritage-beginning__feature">
            <figure className="heritage-beginning__visual" data-animate>
              <BrandImage
                src={image}
                alt={beginningImageAlt}
                className="heritage-beginning__image"
              />
              <figcaption>
                <span>{isAr ? "بداية المسيرة" : "The journey begins"}</span>
                <strong>1942</strong>
              </figcaption>
            </figure>
            <header className="heritage-beginning__intro" data-animate>
              {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
              <h2>{heading}</h2>
              {copy[0] && <p>{copy[0]}</p>}
            </header>
          </div>

          {copy.length > 1 && (
            <div className="heritage-beginning__narrative">
              {copy.slice(1).map((paragraph, paragraphIndex, paragraphs) => (
                <p
                  key={paragraphIndex}
                  className={paragraphIndex === paragraphs.length - 1 ? "is-closing" : undefined}
                  data-animate
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    );
  }

  if (/Our Strategic Direction/i.test(section.title)) {
    const strategicImageAlt = isAr
      ? "فريق مصدر الحياة يناقش التوجه الاستراتيجي داخل منشأة الإنتاج"
      : "Masdar Al Hayat team discussing strategic direction inside the production facility";

    return (
      <AnimatedSection
        className={`content-section strategic-direction-section content-section--${theme}`}
        variant="mask"
      >
        <div className="container-xxl strategic-direction__grid">
          <div className="strategic-direction__content" data-animate>
            {visibleKicker && <span className="section-kicker">{visibleKicker}</span>}
            <h2>{heading}</h2>
            <div className="strategic-direction__copy">
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          </div>

          <figure className="strategic-direction__visual" data-animate>
            <BrandImage
              src={image}
              alt={strategicImageAlt}
              className="strategic-direction__image"
            />
            <span className="strategic-direction__corner" aria-hidden="true" />
          </figure>
        </div>
      </AnimatedSection>
    );
  }

  if (/Group Development Timeline/i.test(section.title)) {
    const years = indexedLocalizedValues(
      section,
      locale,
      /^Timeline Year (\d+)$/,
    );
    const titles = new Map(
      indexedLocalizedValues(
        section,
        locale,
        /^Timeline Title (\d+)$/,
      ).map((item) => [item.index, item.text]),
    );
    const descriptions = new Map(
      indexedLocalizedValues(
        section,
        locale,
        /^Timeline Description (\d+)$/,
      ).map((item) => [item.index, item.text]),
    );
    const milestones: HeritageTimelineMilestone[] = years
      .map(({index: milestoneIndex, text: year}) => ({
        year,
        title: titles.get(milestoneIndex) ?? "",
        description: descriptions.get(milestoneIndex) ?? "",
      }))
      .filter((milestone) => milestone.title && milestone.description);

    return (
      <HeritageTimeline
        kicker={visibleKicker}
        heading={heading}
        introduction={copy[0] ?? ""}
        milestones={milestones}
      />
    );
  }

  /*
   * ========================================================
   * Market Presence & Exhibitions — Industry Engagement
   * ========================================================
   */

  if (renderVariant === "industry-engagement-carousel") {
    const engagementSlides = indexedCarouselSlides(section, locale);

    const regionLabel = localizedItemValue(
      section,
      "Carousel Region Label",
      locale,
    );

    const previousLabel = localizedItemValue(
      section,
      "Carousel Previous Label",
      locale,
    );

    const nextLabel = localizedItemValue(
      section,
      "Carousel Next Label",
      locale,
    );

    const pauseLabel = localizedItemValue(
      section,
      "Carousel Pause Label",
      locale,
    );

    const playLabel = localizedItemValue(
      section,
      "Carousel Play Label",
      locale,
    );

    return (
      <AnimatedSection
        className={`${industryEngagementStyles.section} content-section content-section--${theme}`}
        variant="stagger"
      >
        <div
          className={`container-xxl ${industryEngagementStyles.grid}`}
          dir={isAr ? "rtl" : "ltr"}
        >
          <div
            className={industryEngagementStyles.copy}
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>

          <div
            className={industryEngagementStyles.visual}
            data-animate
          >
            <IndustryEngagementCarousel
              slides={engagementSlides}
              locale={locale}
              regionLabel={regionLabel}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              pauseLabel={pauseLabel}
              playLabel={playLabel}
            />
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Market Landscape — Industry Competition
   * ========================================================
   */

  if (renderVariant === "industry-competition-engine") {
    const competitionPillars = indexedCompetitionPillars(section, locale);
    const competitionFactors = indexedCompetitionFactors(section, locale);

    const regionLabel = localizedItemValue(
      section,
      "Competition Region Label",
      locale,
    );

    const eyebrow = localizedItemValue(
      section,
      "Competition Eyebrow",
      locale,
    );

    const coreLabel = localizedItemValue(
      section,
      "Competition Core Label",
      locale,
    );

    const coreTitle = localizedItemValue(
      section,
      "Competition Core Title",
      locale,
    );

    const dimensionsLabel = localizedItemValue(
      section,
      "Competition Dimensions Label",
      locale,
    );

    const pauseLabel = localizedItemValue(
      section,
      "Competition Pause Label",
      locale,
    );

    const playLabel = localizedItemValue(
      section,
      "Competition Play Label",
      locale,
    );

    return (
      <AnimatedSection
        className={`${industryCompetitionStyles.section} content-section content-section--${theme}`}
        variant="stagger"
      >
        <div
          className={`container-xxl ${industryCompetitionStyles.gridLayout}`}
          dir={isAr ? "rtl" : "ltr"}
        >
          <div
            className={industryCompetitionStyles.copy}
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>

          <div
            className={industryCompetitionStyles.visual}
            data-animate
          >
            <IndustryCompetitionEngine
              locale={locale}
              regionLabel={regionLabel}
              eyebrow={eyebrow}
              coreLabel={coreLabel}
              coreTitle={coreTitle}
              dimensionsLabel={dimensionsLabel}
              pauseLabel={pauseLabel}
              playLabel={playLabel}
              pillars={competitionPillars}
              factors={competitionFactors}
            />
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Market Landscape — Our Competitive Foundations
   * ========================================================
   */

  if (renderVariant === "competitive-foundations-flow") {
    const foundationItems = indexedCompetitiveFoundations(section, locale);

    const regionLabel = localizedItemValue(
      section,
      "Foundation Visual Region Label",
      locale,
    );

    const visualEyebrow = localizedItemValue(
      section,
      "Foundation Visual Eyebrow",
      locale,
    );

    const startLabel = localizedItemValue(
      section,
      "Foundation Flow Start Label",
      locale,
    );

    const endLabel = localizedItemValue(
      section,
      "Foundation Flow End Label",
      locale,
    );

    const countLabel = localizedItemValue(
      section,
      "Foundation Count Label",
      locale,
    );

    return (
      <AnimatedSection
        className={`${competitiveFoundationsStyles.section} content-section content-section--${theme}`}
        variant="stagger"
      >
        <div
          className={`container-xxl ${competitiveFoundationsStyles.layout}`}
          dir={isAr ? "rtl" : "ltr"}
        >
          <div
            className={competitiveFoundationsStyles.copy}
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>

          <div
            className={competitiveFoundationsStyles.visual}
            data-animate
          >
            <CompetitiveFoundationsFlow
              locale={locale}
              regionLabel={regionLabel}
              eyebrow={visualEyebrow}
              startLabel={startLabel}
              endLabel={endLabel}
              countLabel={countLabel}
              items={foundationItems}
            />
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Closing CTA sections
   * ========================================================
   */

  if (/Closing|Call to Action/i.test(section.title)) {
    const primary = value(
      byLabel(section, /Primary CTA|CTA 1|CTA$/),
      locale,
    );

    const secondary = value(
      byLabel(section, /Secondary CTA|CTA 2/),
      locale,
    );

    return (
      <AnimatedSection
        className={`content-section closing-section content-section--${theme}`}
        variant="mask"
      >
        <div
          className="container-xxl closing-section__inner"
          data-animate
        >
          <span className="section-index">
            {String(index).padStart(2, "0")}
          </span>

          {visibleKicker && (
            <span className="section-kicker">
              {visibleKicker}
            </span>
          )}

          <h2>{heading}</h2>

          {copy.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>
              {paragraph}
            </p>
          ))}

          <div className="closing-section__actions">
            {primary && (
              <ArrowLink
                href={resolveCtaHref(primary)}
                light
              >
                {primary}
              </ArrowLink>
            )}

            {secondary && (
              <ArrowLink
                href={resolveCtaHref(secondary)}
                light
              >
                {secondary}
              </ArrowLink>
            )}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  const layout = index % 6;

  if (theme === "industrial" && index === 3 && groups.length >= 4) {
    const capabilityImages = [
      {
        image: "/assets/images/masdar-enhanced/masdar_al_hayat_01.png",
        objectPosition: "62% center",
      },
      {
        image: "/assets/images/masdar-enhanced/masdar_al_hayat_03.png",
        objectPosition: "64% center",
      },
      {
        image: "/assets/images/masdar-enhanced/masdar_al_hayat_18.png",
        objectPosition: "64% center",
      },
      {
        image: "/assets/images/masdar-enhanced/masdar_al_hayat_14.png",
        objectPosition: "center center",
      },
    ] as const;

    const capabilityItems: ManufacturingCapabilityItem[] = groups
      .slice(0, 4)
      .map((group, groupIndex) => ({
        title:
          groupText(group, "Title") ||
          groupText(group, "Value"),
        description: value(group.parts.Description, locale),
        ...capabilityImages[groupIndex],
      }));

    return (
      <ManufacturingCapabilitiesFlow
        kicker={visibleKicker}
        heading={heading}
        items={capabilityItems}
        isRtl={isAr}
      />
    );
  }

  if (theme === "industrial" && index === 4 && groups.length >= 4) {
    const categoryIcons = [Wheat, ChefHat, Soup, Snowflake] as const;
    const categories = groups.slice(0, 4).map((group, categoryIndex) => ({
      title: groupText(group, "Title") || groupText(group, "Value"),
      Icon: categoryIcons[categoryIndex],
    }));

    return (
      <AnimatedSection
        className="content-section product-categories-showcase content-section--industrial"
        variant="stagger"
      >
        <div className="container-xxl">
          <header className="product-categories-showcase__header" data-animate>
            <div>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}
              <h2>{heading}</h2>
            </div>

            {copy.length > 0 && <p>{copy[0]}</p>}
          </header>

          <div className="product-categories-showcase__body">
            <figure className="product-categories-showcase__visual" data-animate>
              <BrandImage
                src="/assets/images/masdar-enhanced/masdar_al_hayat_19.png"
                alt={heading}
                className="product-categories-showcase__image"
              />
              <span aria-hidden="true" />
              <figcaption aria-hidden="true">
                <strong>04</strong>
                <span>{visibleKicker}</span>
              </figcaption>
            </figure>

            <div className="product-categories-showcase__list">
              {categories.map(({title: categoryTitle, Icon}, categoryIndex) => (
                <article key={categoryTitle} data-animate>
                  <div className="product-categories-showcase__icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
                  <h3>{categoryTitle}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (theme === "operations" && index === 3 && groups.length >= 5) {
    const planningIcons = [
      ChartNoAxesCombined,
      CalendarClock,
      Boxes,
      UsersRound,
      Check,
    ] as const;

    const planningSteps = groups.slice(0, 5).map((group, stepIndex) => ({
      title: groupText(group, "Title") || groupText(group, "Value"),
      Icon: planningIcons[stepIndex],
    }));

    return (
      <AnimatedSection
        className="content-section planning-coordination-showcase content-section--operations"
        variant="stagger"
      >
        <div className="container-xxl">
          <header className="planning-coordination-showcase__header">
            <div data-animate>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}
              <h2>{heading}</h2>
            </div>

            <div className="planning-coordination-showcase__copy" data-animate>
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          </header>

          <div className="planning-coordination-showcase__flow">
            <span className="planning-coordination-showcase__rail" aria-hidden="true" />

            {planningSteps.map(({title: stepTitle, Icon}, stepIndex) => (
              <article key={stepTitle} data-animate>
                <div className="planning-coordination-showcase__marker">
                  <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                </div>

                <div className="planning-coordination-showcase__tile">
                  <Icon aria-hidden="true" />
                  <h3>{stepTitle}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (theme === "operations" && index === 4 && groups.length >= 5) {
    const smartIcons = [ScanLine, MonitorCog, Gauge, RefreshCw, Zap] as const;
    const improvements = groups.slice(0, 5).map((group, improvementIndex) => ({
      title: groupText(group, "Title") || groupText(group, "Value"),
      Icon: smartIcons[improvementIndex],
    }));

    return (
      <AnimatedSection
        className="content-section smart-operations-showcase content-section--operations"
        variant="stagger"
      >
        <div className="container-xxl">
          <header className="smart-operations-showcase__header">
            <div data-animate>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}
              <h2>{heading}</h2>
            </div>

            <div className="smart-operations-showcase__copy" data-animate>
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          </header>

          <div className="smart-operations-showcase__body">
            <div className="smart-operations-showcase__core" data-animate aria-hidden="true">
              <span className="smart-operations-showcase__orbit smart-operations-showcase__orbit--outer" />
              <span className="smart-operations-showcase__orbit smart-operations-showcase__orbit--inner" />
              <div>
                <MonitorCog />
                <span>01 — 05</span>
              </div>
            </div>

            <div className="smart-operations-showcase__grid">
              {improvements.map(({title: improvementTitle, Icon}, improvementIndex) => (
                <article key={improvementTitle} data-animate>
                  <span>{String(improvementIndex + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" />
                  <h3>{improvementTitle}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (theme === "quality" && index === 3 && groups.length >= 5) {
    const safetyIcons = [
      PackageCheck,
      SlidersHorizontal,
      Sparkles,
      Warehouse,
      FileCheck2,
    ] as const;

    const safetyFocuses = groups.slice(0, 5).map((group, focusIndex) => ({
      title: groupText(group, "Title") || groupText(group, "Value"),
      Icon: safetyIcons[focusIndex],
    }));

    return (
      <AnimatedSection
        className="content-section food-safety-showcase content-section--quality"
        variant="stagger"
      >
        <div className="container-xxl">
          <header className="food-safety-showcase__header">
            <div data-animate>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}
              <h2>{heading}</h2>
            </div>

            <div className="food-safety-showcase__copy" data-animate>
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          </header>

          <div className="food-safety-showcase__system">
            <div className="food-safety-showcase__assurance" data-animate aria-hidden="true">
              <span className="food-safety-showcase__ring food-safety-showcase__ring--outer" />
              <span className="food-safety-showcase__ring food-safety-showcase__ring--inner" />

              <div className="food-safety-showcase__shield">
                <div>
                  <ShieldCheck />
                  <span>01 — 05</span>
                </div>
              </div>
            </div>

            <div className="food-safety-showcase__checkpoints">
              {safetyFocuses.map(({title: focusTitle, Icon}, focusIndex) => (
                <article key={focusTitle} data-animate>
                  <span>{String(focusIndex + 1).padStart(2, "0")}</span>
                  <div className="food-safety-showcase__checkpoint-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{focusTitle}</h3>
                  <Check aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (theme === "logistics" && index === 3 && groups.length >= 5) {
    const warehousingIcons = [
      PackageOpen,
      Warehouse,
      ScanSearch,
      ClipboardCheck,
      CircleCheckBig,
    ] as const;

    const warehousingFocuses = groups.slice(0, 5).map((group, focusIndex) => ({
      title: groupText(group, "Title") || groupText(group, "Value"),
      Icon: warehousingIcons[focusIndex],
    }));

    return (
      <AnimatedSection
        className="content-section warehousing-showcase content-section--logistics"
        variant="stagger"
      >
        <div className="container-xxl">
          <header className="warehousing-showcase__header">
            <div data-animate>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}
              <h2>{heading}</h2>
            </div>

            <div className="warehousing-showcase__copy" data-animate>
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          </header>

          <div className="warehousing-showcase__system">
            <div className="warehousing-showcase__hub" data-animate aria-hidden="true">
              <span className="warehousing-showcase__frame warehousing-showcase__frame--outer" />
              <span className="warehousing-showcase__frame warehousing-showcase__frame--inner" />
              <div>
                <Warehouse />
                <span>01 — 05</span>
              </div>
            </div>

            <div className="warehousing-showcase__rack">
              {warehousingFocuses.map(({title: focusTitle, Icon}, focusIndex) => (
                <article key={focusTitle} data-animate>
                  <span>{String(focusIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{focusTitle}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (theme === "logistics" && index === 4 && groups.length >= 4) {
    const channelIcons = [ShoppingCart, Truck, Hotel, Building2] as const;
    const channels = groups.slice(0, 4).map((group, channelIndex) => ({
      title: groupText(group, "Title") || groupText(group, "Value"),
      description: value(group.parts.Description, locale),
      Icon: channelIcons[channelIndex],
    }));

    return (
      <AnimatedSection
        className="content-section market-channels-showcase content-section--logistics"
        variant="stagger"
      >
        <div className="container-xxl">
          <header className="market-channels-showcase__header">
            <div data-animate>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}
              <h2>{heading}</h2>
            </div>

            {copy.length > 0 && <p data-animate>{copy[0]}</p>}
          </header>

          <figure className="market-channels-showcase__media" data-animate>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              title={heading}
            >
              <source
                src="/assets/videos/masdar_logistics-video-1.mp4"
                type="video/mp4"
              />
            </video>
            <span aria-hidden="true" />
            <figcaption aria-hidden="true">
              <Truck />
              <span>{visibleKicker}</span>
            </figcaption>
          </figure>

          <div className="market-channels-showcase__grid">
            {channels.map(({title: channelTitle, description, Icon}, channelIndex) => (
              <article key={channelTitle} data-animate>
                <div className="market-channels-showcase__meta">
                  <Icon aria-hidden="true" />
                  <span>{String(channelIndex + 1).padStart(2, "0")}</span>
                </div>
                <h3>{channelTitle}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (theme === "innovation" && index === 4 && image) {
    const focusItem = remaining.find(
      (item) => String(item.label ?? "") === "Key Focus Areas",
    );
    const focusAreas = value(focusItem, locale)
      .split(/[,،]/)
      .map((area) => area.trim())
      .filter(Boolean);

    return (
      <AnimatedSection
        className="content-section smarter-operations-section content-section--innovation"
        variant="slide"
      >
        <div className="container-xxl">
          <div className="smarter-operations__grid">
            <div className="smarter-operations__content" data-animate>
              {visibleKicker && (
                <span className="section-kicker">{visibleKicker}</span>
              )}

              <h2>{heading}</h2>

              <div className="smarter-operations__copy">
                {copy.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </div>

            <figure className="smarter-operations__visual" data-animate>
              <BrandImage
                src={image}
                alt={heading}
                className="smarter-operations__image"
              />

              <figcaption>
                <Radar aria-hidden="true" />
                <span>{visibleKicker}</span>
              </figcaption>
            </figure>
          </div>

          {focusAreas.length > 0 && (
            <FocusConnector
              label={visibleItemLabel(
                focusItem?.label ?? "Key Focus Areas",
                locale,
              )}
              areas={focusAreas}
            />
          )}
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Timeline, process and journey sections
   * ========================================================
   */

  const processSearchText =
    section.title +
    groups.map((group) => group.prefix).join(" ");

  if (
    groups.length >= 3 &&
    /Journey|Timeline|Process|Stage|Step/i.test(
      processSearchText,
    )
  ) {
    return (
      <AnimatedSection
        className={`content-section process-section content-section--${theme}`}
        variant="line"
      >
        <div className="container-xxl">
          <header
            className="section-heading"
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy[0] && <p>{copy[0]}</p>}
          </header>

          <div className="process-rail">
            {groups.map((group, groupIndex) => (
              <article
                key={group.key}
                data-animate
              >
                <span className="process-rail__number">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>

                <small>
                  {value(
                    group.parts.Label ||
                    group.parts.Number,
                    locale,
                  )}
                </small>

                <h3>
                  {groupText(group, "Title")}
                </h3>

                <p>
                  {value(
                    group.parts.Description,
                    locale,
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Vision Pillars — custom constellation layout
   * ========================================================
   *
   * This condition must stay above the generic Vision and
   * Mission statement renderer.
   */

  const isVisionPillarSection =
    groups.length >= 6 &&
    (
      /What Our Vision Represents/i.test(
        section.title,
      ) ||
      groups.some((group) =>
        /Vision Pillar/i.test(group.prefix),
      )
    );

  if (isVisionPillarSection) {
    const visionIcons = [
      ShieldCheck,
      Factory,
      Radar,
      Lightbulb,
      Handshake,
      Sprout,
    ] as const;

    return (
      <AnimatedSection
        className={`content-section vision-constellation-section content-section--${theme}`}
        variant="stagger"
      >
        <div className="container-xxl">
          <header
            className="vision-constellation__header"
            data-animate
          >
            <div className="vision-constellation__header-copy">
              <span className="section-index">
                {String(index).padStart(2, "0")}
              </span>

              {visibleKicker && (
                <span className="section-kicker">
                  {visibleKicker}
                </span>
              )}

              <h2>{heading}</h2>

              {copy.length > 0 && (
                <div className="vision-constellation__introduction">
                  {copy.map(
                    (
                      paragraph,
                      paragraphIndex,
                    ) => (
                      <p key={paragraphIndex}>
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              )}
            </div>

            <figure className="vision-constellation__visual">
              <BrandImage
                src={image}
                alt={isAr
                  ? "طفل يختار منتجات فونتي في متجر"
                  : "A child choosing Fonte products in a retail store"}
                className="vision-constellation__image"
              />
              <span className="vision-constellation__visual-mark" aria-hidden="true" />
            </figure>
          </header>

          <div className="vision-constellation__stage">
            <div
              className="vision-constellation__core"
              data-animate
              aria-hidden="true"
            >
              <span>
                {isAr
                  ? "رؤيتنا"
                  : "Our Vision"}
              </span>

              <strong>
                {String(
                  groups.slice(0, 6).length,
                ).padStart(2, "0")}
              </strong>

              <small>
                {isAr
                  ? "مرتكزات"
                  : "Pillars"}
              </small>

              <i className="vision-constellation__core-dot" />
            </div>

            {groups
              .slice(0, 6)
              .map(
                (
                  group,
                  groupIndex,
                ) => {
                  const VisionIcon =
                    visionIcons[
                    groupIndex %
                    visionIcons.length
                    ];

                  /*
                   * The first three nodes appear on one side
                   * and the remaining three on the opposite side.
                   * Arabic reverses the horizontal flow.
                   */

                  const side =
                    groupIndex < 3
                      ? isAr
                        ? "right"
                        : "left"
                      : isAr
                        ? "left"
                        : "right";

                  const row =
                    (groupIndex % 3) + 1;

                  const pillarTitle =
                    groupText(
                      group,
                      "Title",
                    );

                  const pillarDescription =
                    value(
                      group.parts
                        .Description,
                      locale,
                    );

                  return (
                    <article
                      key={group.key}
                      className={[
                        "vision-constellation__node",
                        `vision-constellation__node--${side}`,
                        `vision-constellation__node--row-${row}`,
                      ].join(" ")}
                      data-animate
                    >
                      <div className="vision-constellation__node-icon">
                        <VisionIcon
                          size={24}
                          strokeWidth={1.6}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="vision-constellation__node-copy">
                        <span className="vision-constellation__node-number">
                          {String(
                            groupIndex + 1,
                          ).padStart(2, "0")}
                        </span>

                        <h3>
                          {pillarTitle}
                        </h3>

                        {pillarDescription && (
                          <p>
                            {
                              pillarDescription
                            }
                          </p>
                        )}
                      </div>
                    </article>
                  );
                },
              )}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * About page — Looking Ahead
   * ========================================================
   */

  if (/Looking Ahead/i.test(section.title)) {
    const futureThemes = isAr
      ? [
        "تعزيز القدرات التشغيلية",
        "تطوير محفظتنا",
        "دعم كوادرنا",
        "شراكات طويلة المدى",
      ]
      : [
        "Operational Capabilities",
        "Portfolio Development",
        "Supporting Our People",
        "Long-Term Partnerships",
      ];

    return (
      <AnimatedSection
        className={`content-section future-section content-section--${theme}`}
        variant="slide"
      >
        <div className="container-xxl future-section__grid">
          <div
            className="future-section__copy"
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy.map(
              (
                paragraph,
                paragraphIndex,
              ) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ),
            )}
          </div>

          <div className="future-section__visual">
            <BrandImage
              src={image}
              alt={heading}
              className="future-section__image"
            />

            <span
              className="future-section__corner"
              aria-hidden="true"
            />

            <div
              className="future-section__themes"
              data-animate
            >
              {futureThemes.map(
                (
                  themeItem,
                  themeIndex,
                ) => (
                  <article key={themeItem}>
                    <span>
                      {String(
                        themeIndex + 1,
                      ).padStart(2, "0")}
                    </span>

                    <strong>
                      {themeItem}
                    </strong>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Vision, Mission & Values — Our Commitment
   * ========================================================
   *
   * All visible copy for this component is read from the
   * generated content file. The render variant is also data-
   * driven, avoiding English-title checks as the primary path.
   */

  const isOurCommitmentSection =
    renderVariant === "commitment-value" ||
    /Our Long-Term Commitment|Our Commitment/i.test(section.title);

  if (isOurCommitmentSection) {
    const crownLabel = localizedItemValue(
      section,
      "Commitment Crown Label",
      locale,
    );

    const crownTitle = localizedItemValue(
      section,
      "Commitment Crown Title",
      locale,
    );

    const commitmentLayers = indexedLocalizedValues(
      section,
      locale,
      /^Commitment Layer (\d+) Title$/i,
    );

    const directionFramework = indexedLocalizedPairs(
      section,
      locale,
      /^Commitment Foundation (\d+) (Label|Value)$/i,
    );

    const hasVisualContent =
      Boolean(crownLabel || crownTitle) ||
      commitmentLayers.length > 0 ||
      directionFramework.length > 0;

    return (
      <AnimatedSection
        className={`content-section commitment-value-section content-section--${theme}`}
        variant="stagger"
      >
        <div className="container-xxl commitment-value__grid">
          <div
            className="commitment-value__copy"
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            <div className="commitment-value__paragraphs">
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {hasVisualContent && (
            <div className="commitment-value__visual">
              <div className="value-architecture">
                <span
                  className="value-architecture__outline value-architecture__outline--one"
                  aria-hidden="true"
                />

                <span
                  className="value-architecture__outline value-architecture__outline--two"
                  aria-hidden="true"
                />

                <span
                  className="value-architecture__spine"
                  aria-hidden="true"
                />

                {(crownLabel || crownTitle) && (
                  <div
                    className="value-architecture__crown"
                    data-animate
                  >
                    {crownLabel && <small>{crownLabel}</small>}
                    {crownTitle && <strong>{crownTitle}</strong>}
                    <span aria-hidden="true" />
                  </div>
                )}

                {commitmentLayers.length > 0 && (
                  <div className="value-architecture__layers">
                    {commitmentLayers.map((layer) => (
                      <article
                        key={layer.index}
                        className={`value-architecture__layer value-architecture__layer--${layer.index}`}
                        data-animate
                      >
                        <span className="value-architecture__number">
                          {String(layer.index).padStart(2, "0")}
                        </span>

                        <strong>{layer.text}</strong>

                        <i aria-hidden="true" />
                      </article>
                    ))}
                  </div>
                )}

                {directionFramework.length > 0 && (
                  <div
                    className="value-architecture__foundation"
                    data-animate
                  >
                    {directionFramework.map((item) => (
                      <div key={item.index}>
                        <small>{visibleItemLabel(item.label, locale)}</small>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Statement, Vision and Mission sections
   * ========================================================
   */

  if (
    layout === 0 ||
    /Statement|Vision|Mission/i.test(
      section.title,
    )
  ) {
    const isMissionStatementSection = /Mission Statement/i.test(section.title);

    return (
      <AnimatedSection
        className={`content-section statement-section content-section--${theme} ${isMissionStatementSection ? "mission-statement-section" : ""}`}
        variant="mask"
      >
        <div className="container-xxl statement-section__grid">
          <div className="statement-section__heading" data-animate>
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {isMissionStatementSection && image && (
              <figure className="mission-statement__visual">
                <BrandImage
                  src={image}
                  alt={isAr
                    ? "فريق مصدر الحياة يراجع خطط التشغيل داخل المنشأة"
                    : "Masdar Al Hayat team reviewing operational plans inside the facility"}
                  className="mission-statement__image"
                />
                <span className="mission-statement__accent" aria-hidden="true" />
              </figure>
            )}
          </div>

          <div
            className="statement-section__copy"
            data-animate
          >
            {copy.map(
              (
                paragraph,
                paragraphIndex,
              ) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ),
            )}

            {remaining.map(
              (
                item,
                itemIndex,
              ) => (
                <blockquote key={itemIndex}>
                  {statementLabel &&
                    itemIndex === 0 && (
                      <small>{statementLabel}</small>
                    )}

                  {value(item, locale)}
                </blockquote>
              ),
            )}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  

  /*
   * ========================================================
   * Matrix layout
   * ========================================================
   */

  if (
    layout === 1 ||
    groups.length >= 4
  ) {
    return (
      <AnimatedSection
        className={`content-section matrix-section content-section--${theme}`}
        variant="stagger"
      >
        <div className="container-xxl">
          <header
            className="section-heading section-heading--wide"
            data-animate
          >
            <div>
              <span className="section-index">
                {String(index).padStart(2, "0")}
              </span>

              {visibleKicker && (
                <span className="section-kicker">
                  {visibleKicker}
                </span>
              )}

              <h2>{heading}</h2>
            </div>

            <div>
              {copy.map(
                (
                  paragraph,
                  paragraphIndex,
                ) => (
                  <p key={paragraphIndex}>
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </header>

          <div className="matrix-grid">
            {groups.map(
              (
                group,
                groupIndex,
              ) => (
                <article
                  key={group.key}
                  data-animate
                >
                  <span>
                    {String(
                      groupIndex + 1,
                    ).padStart(2, "0")}
                  </span>

                  <h3>
                    {groupText(
                      group,
                      "Title",
                    ) ||
                      groupText(
                        group,
                        "Value",
                      )}
                  </h3>

                  <p>
                    {value(
                      group.parts
                        .Description,
                      locale,
                    )}
                  </p>
                </article>
              ),
            )}

            {remaining.map(
              (
                item,
                itemIndex,
              ) => (
                <article
                  key={`remaining-${itemIndex}`}
                  data-animate
                >
                  <Check
                    aria-hidden="true"
                  />

                  <h3>
                    {value(
                      item,
                      locale,
                    )}
                  </h3>

                  <small>{visibleItemLabel(item.label, locale)}</small>
                </article>
              ),
            )}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Image and content layout
   * ========================================================
   */

  if (layout === 2) {
    return (
      <AnimatedSection
        className={`content-section media-section content-section--${theme}`}
        variant="slide"
      >
        <div className="container-xxl media-section__grid">
          {image ? <BrandImage src={image} alt={heading}/> : <div className="section-visual-placeholder" data-animate aria-hidden="true"><Lightbulb/><span/><span/></div>}

          <div
            className="media-section__content"
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy.map(
              (
                paragraph,
                paragraphIndex,
              ) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ),
            )}

            <div className="media-section__list">
              {groups
                .slice(0, 6)
                .map((group) => (
                  <div key={group.key}>
                    <ChevronRight
                      aria-hidden="true"
                    />

                    <span>
                      {groupText(
                        group,
                        "Title",
                      ) ||
                        groupText(
                          group,
                          "Value",
                        )}
                    </span>
                  </div>
                ))}

              {remaining.map(
                (
                  item,
                  itemIndex,
                ) => (
                  <div key={itemIndex}>
                    <ChevronRight
                      aria-hidden="true"
                    />

                    <span>
                      {value(
                        item,
                        locale,
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Dark content layout
   * ========================================================
   */

  if (layout === 3) {
    return (
      <AnimatedSection
        className={`content-section dark-section content-section--${theme}`}
        variant="scale"
      >
        <div className="container-xxl dark-section__grid">
          <div data-animate>
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>
          </div>

          <div data-animate>
            {copy.map(
              (
                paragraph,
                paragraphIndex,
              ) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ),
            )}

            <div className="dark-section__items">
              {groups.map((group) => (
                <div key={group.key}>
                  <h3>
                    {groupText(
                      group,
                      "Title",
                    ) ||
                      groupText(
                        group,
                        "Value",
                      )}
                  </h3>

                  <p>
                    {value(
                      group.parts
                        .Description,
                      locale,
                    )}
                  </p>
                </div>
              ))}

              {remaining.map(
                (
                  item,
                  itemIndex,
                ) => (
                  <div key={itemIndex}>
                    <h3>
                      {value(
                        item,
                        locale,
                      )}
                    </h3>

                    <small>{visibleItemLabel(item.label, locale)}</small>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Accordion layout
   * ========================================================
   */

  /*
 * ========================================================
 * Legacy governance philosophy visual
 * ========================================================
 */

  const isGovernancePhilosophy =
    /Governance Philosophy/i.test(section.title);

  if (isGovernancePhilosophy) {
    const governancePrinciples = isAr
      ? [
        "تحديد المسؤوليات",
        "الرقابة على الأداء",
        "إدارة المخاطر",
        "الحفاظ على المساءلة",
      ]
      : [
        "Defining Responsibilities",
        "Performance Oversight",
        "Risk Management",
        "Maintaining Accountability",
      ];

    const governanceFoundations = isAr
      ? [
        "الشفافية",
        "السلوك الأخلاقي",
        "الامتثال",
        "الاستخدام المسؤول للموارد",
      ]
      : [
        "Transparency",
        "Ethical Conduct",
        "Compliance",
        "Responsible Use of Resources",
      ];

    return (
      <AnimatedSection
        className={`content-section governance-philosophy-section content-section--${theme}`}
        variant="stagger"
      >
        <div className="container-xxl governance-philosophy__grid">
          <div
            className="governance-philosophy__copy"
            data-animate
          >
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            <div className="governance-philosophy__paragraphs">
              {copy.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div
            className="governance-philosophy__visual"
            data-animate
          >
            <div
              className="governance-orbit"
              aria-hidden="true"
            >
              <span className="governance-orbit__halo governance-orbit__halo--outer" />
              <span className="governance-orbit__halo governance-orbit__halo--inner" />

              <span className="governance-orbit__axis governance-orbit__axis--horizontal" />
              <span className="governance-orbit__axis governance-orbit__axis--vertical" />

              <div className="governance-orbit__core">
                <small>
                  {isAr ? "الحوكمة" : "Governance"}
                </small>

                <strong>
                  {isAr ? (
                    <>
                      توجيه مسؤول
                      <br />
                      ومتسق
                    </>
                  ) : (
                    <>
                      Responsible
                      <br />
                      Direction
                    </>
                  )}
                </strong>

                <span className="governance-orbit__core-mark" />
              </div>

              {governancePrinciples.map(
                (principle, principleIndex) => (
                  <article
                    key={principle}
                    className={`governance-orbit__node governance-orbit__node--${principleIndex + 1
                      }`}
                  >
                    <span>
                      {String(principleIndex + 1).padStart(2, "0")}
                    </span>

                    <strong>{principle}</strong>
                  </article>
                ),
              )}
            </div>

            <div className="governance-philosophy__foundation">
              <small>
                {isAr
                  ? "أسس الحوكمة"
                  : "Governance Foundations"}
              </small>

              <div>
                {governanceFoundations.map((foundation) => (
                  <span key={foundation}>
                    {foundation}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (layout === 4) {
    return (
      <AnimatedSection
        className={`content-section accordion-section content-section--${theme}`}
        variant="rise"
      >
        <div className="container-xxl accordion-section__grid">
          <header data-animate>
            <span className="section-index">
              {String(index).padStart(2, "0")}
            </span>

            {visibleKicker && (
              <span className="section-kicker">
                {visibleKicker}
              </span>
            )}

            <h2>{heading}</h2>

            {copy.map(
              (
                paragraph,
                paragraphIndex,
              ) => (
                <p key={paragraphIndex}>
                  {paragraph}
                </p>
              ),
            )}
          </header>

          <div
            className="native-accordion"
            data-animate
          >
            {groups.map(
              (
                group,
                groupIndex,
              ) => (
                <details
                  key={group.key}
                  open={
                    groupIndex === 0
                  }
                >
                  <summary>
                    <span>
                      {String(
                        groupIndex + 1,
                      ).padStart(2, "0")}
                    </span>

                    {groupText(
                      group,
                      "Title",
                    ) ||
                      groupText(
                        group,
                        "Value",
                      )}
                  </summary>

                  <p>
                    {value(
                      group.parts
                        .Description,
                      locale,
                    )}
                  </p>
                </details>
              ),
            )}

            {remaining.map(
              (
                item,
                itemIndex,
              ) => (
                <details key={itemIndex}>
                  <summary>
                    <span>
                      {String(
                        itemIndex +
                        1 +
                        groups.length,
                      ).padStart(2, "0")}
                    </span>

                    {visibleItemLabel(item.label, locale)}
                  </summary>

                  <p>
                    {value(
                      item,
                      locale,
                    )}
                  </p>
                </details>
              ),
            )}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  /*
   * ========================================================
   * Default closing-style layout
   * ========================================================
   */

  const cta = value(
    byLabel(
      section,
      /CTA|Primary CTA/,
    ),
    locale,
  );

  return (
    <AnimatedSection
      className={`content-section closing-section content-section--${theme}`}
      variant="rise"
    >
      <div
        className="container-xxl closing-section__inner"
        data-animate
      >
        <span className="section-index">
          {String(index).padStart(2, "0")}
        </span>

        {visibleKicker && (
          <span className="section-kicker">
            {visibleKicker}
          </span>
        )}

        <h2>{heading}</h2>

        {copy.map(
          (
            paragraph,
            paragraphIndex,
          ) => (
            <p key={paragraphIndex}>
              {paragraph}
            </p>
          ),
        )}

        {cta && (
          <ArrowLink href={resolveCtaHref(cta)}>
            {cta}
          </ArrowLink>
        )}
      </div>
    </AnimatedSection>
  );
}
