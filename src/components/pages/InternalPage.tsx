import {InnerHero} from "@/components/ui/InnerHero";
import {SectionRenderer} from "@/components/ui/SectionRenderer";
import {DistributionNetworkMap} from "@/components/ui/DistributionNetworkMap";
import {BRAND_LOGOS, getSectionImage, PAGE_IMAGES} from "@/content/pages";
import {byLabel, value} from "@/lib/content";
import type {Locale, PageContent, PageTheme} from "@/types/content";

const VISION_VALUES_HIDDEN_SECTIONS = new Set([
  "Our Strategic Direction",
]);

const QUALITY_HIDDEN_SECTIONS = new Set([
  "Food Safety Approach",
  "Compliance & Traceability",
]);

const LOGISTICS_HIDDEN_SECTIONS = new Set([
  "Warehousing & Product Readiness",
  "Market Channels Served",
  "Delivery Coordination",
]);

const MANUFACTURING_HIDDEN_SECTIONS = new Set([
  "Quality-Led Manufacturing",
]);

const RESEARCH_HIDDEN_SECTIONS = new Set([
  "Process & Operational Innovation",
]);

const BRANDS_HIDDEN_SECTIONS = new Set([
  "Fonte HORECA",
]);

const PARTNERSHIPS_HIDDEN_SECTIONS = new Set([
  "Partnership Overview",
  "How Partnership Works",
]);

export function InternalPage({
  page,
  locale,
  theme,
  imageKey,
}: {
  page: PageContent;
  locale: Locale;
  theme: PageTheme;
  imageKey: keyof typeof PAGE_IMAGES;
}) {
  const [hero, ...sections] = page.sections;
  const heroImage = PAGE_IMAGES[imageKey];
  const leadingSections = imageKey === "partnerships" ? sections.filter(section => section.title === "Partnership Channels") : [];
  const featuredSections = [...leadingSections, ...sections.filter(section => section.items.some(item => item.label === "Render Variant" && /^(partner-logos|logistics-counters)$/.test(String(item.en))))];
  const orderedSections = sections.filter(section => !featuredSections.includes(section));

  return (
    <main
      id="main-content"
      className={`page-theme page-theme--${theme}`}
    >
      <InnerHero
        section={hero}
        locale={locale}
        theme={theme}
        image={heroImage}
        brandLogo={imageKey === "groupStory" ? BRAND_LOGOS.tamimiGroup : undefined}
        brandLogoAlt={locale === "ar" ? "شعار مجموعة التميمي" : "Tamimi Group logo"}
        additionalSupporting={imageKey === "groupStory" ? value(byLabel(hero, "Supporting Paragraph 2"), locale) : undefined}
      />

      {featuredSections.map(section => <SectionRenderer key={section.title} section={section} index={0} locale={locale} theme={theme} image=""/>)}

      {orderedSections.map((section, index) => {
        if (imageKey === "logistics" && section.title === "Distribution Overview") return <DistributionNetworkMap key={section.title} locale={locale}/>;
        if (imageKey === "visionValues" && VISION_VALUES_HIDDEN_SECTIONS.has(section.title)) return null;
        if (imageKey === "quality" && QUALITY_HIDDEN_SECTIONS.has(section.title)) return null;
        if (imageKey === "logistics" && LOGISTICS_HIDDEN_SECTIONS.has(section.title)) return null;
        if (imageKey === "manufacturing" && MANUFACTURING_HIDDEN_SECTIONS.has(section.title)) return null;
        if (imageKey === "research" && RESEARCH_HIDDEN_SECTIONS.has(section.title)) return null;
        if (imageKey === "brands" && BRANDS_HIDDEN_SECTIONS.has(section.title)) return null;
        if (imageKey === "partnerships" && PARTNERSHIPS_HIDDEN_SECTIONS.has(section.title)) return null;

        const sectionIndex = index + 2;

        return (
          <SectionRenderer
            key={section.title}
            section={section}
            index={sectionIndex}
            locale={locale}
            theme={theme}
            image={getSectionImage(imageKey, sectionIndex)}
          />
        );
      })}
    </main>
  );
}
