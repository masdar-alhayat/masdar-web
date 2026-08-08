import {BrandImage} from "./BrandImage";
import {ArrowLink} from "./ArrowLink";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {byLabel, resolveCtaHref, value} from "@/lib/content";
import type {ContentSection, Locale, PageTheme} from "@/types/content";

export function InnerHero({section, locale, theme, image}: {section: ContentSection; locale: Locale; theme: PageTheme; image: string}) {
  const eyebrow = value(byLabel(section, /Section Label|Eyebrow/), locale);
  const heading = value(byLabel(section, "Main Heading"), locale);
  const supporting = value(byLabel(section, /Supporting Content|Supporting Paragraph 1/), locale);
  const breadcrumb = value(byLabel(section, "Breadcrumb"), locale);
  const primary = value(byLabel(section, "Primary CTA"), locale);
  const secondary = value(byLabel(section, "Secondary CTA"), locale);
  return <HeroMotion className={`inner-hero inner-hero--${theme}`}>
    <div className="container-xxl inner-hero__grid">
      <div className="inner-hero__content">
        {breadcrumb && <div className="inner-hero__crumb" data-hero-eyebrow>{breadcrumb}</div>}
        {eyebrow && <span className="section-kicker" data-hero-eyebrow>{eyebrow}</span>}
        <h1 data-hero-title><span>{heading}</span></h1>
        {supporting && <p data-hero-copy>{supporting}</p>}
        {(primary || secondary) && <div className="inner-hero__actions" data-hero-actions>
          {primary && <ArrowLink href={resolveCtaHref(primary)} light>{primary}</ArrowLink>}
          {secondary && <ArrowLink href={resolveCtaHref(secondary)} light>{secondary}</ArrowLink>}
        </div>}
      </div>
      <div className="inner-hero__media" data-hero-media><BrandImage src={image} alt={heading} priority/></div>
      <div className="inner-hero__monogram" data-hero-mark aria-hidden="true"><span>M</span><small>2009</small></div>
    </div>
  </HeroMotion>;
}
