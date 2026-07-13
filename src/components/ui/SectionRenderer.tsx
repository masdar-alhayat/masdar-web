import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { ArrowLink } from "./ArrowLink";
import { BrandImage } from "./BrandImage";
import { CorporateForm } from "./CorporateForm";
import { ContactLocationMap } from "./ContactLocationMap";
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
  Check,
  ChevronRight,
  Factory,
  Handshake,
  Lightbulb,
  Radar,
  ShieldCheck,
  Sprout,
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
                href="/contact"
                light
              >
                {primary}
              </ArrowLink>
            )}

            {secondary && (
              <ArrowLink
                href="/brands-partnerships/business-partnerships"
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
                   * Arabic reverses the visual direction.
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
                        <small>{item.label}</small>
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
    return (
      <AnimatedSection
        className={`content-section statement-section content-section--${theme}`}
        variant="mask"
      >
        <div className="container-xxl statement-section__grid">
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

                  <small>
                    {String(
                      item.label,
                    )}
                  </small>
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
          <BrandImage
            src={image}
            alt={heading}
          />

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

                    <small>
                      {String(
                        item.label,
                      )}
                    </small>
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
 * Leadership & Governance — Governance Philosophy
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

                    {String(
                      item.label,
                    )}
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
          <ArrowLink href="/contact">
            {cta}
          </ArrowLink>
        )}
      </div>
    </AnimatedSection>
  );
}