import Image from "next/image";
import {BrandImage} from "./BrandImage";
import {ArrowLink} from "./ArrowLink";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {byLabel, resolveCtaHref, value} from "@/lib/content";
import type {ContentSection, Locale, PageTheme} from "@/types/content";

export function InnerHero({section, locale, theme, image, brandLogo, brandLogoAlt = "", additionalSupporting}: {section: ContentSection; locale: Locale; theme: PageTheme; image: string; brandLogo?: string; brandLogoAlt?: string; additionalSupporting?: string}) {
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
        {additionalSupporting && <p data-hero-copy>{additionalSupporting}</p>}
        {(primary || secondary) && <div className="inner-hero__actions" data-hero-actions>
          {primary && <ArrowLink href={resolveCtaHref(primary)} light>{primary}</ArrowLink>}
          {secondary && <ArrowLink href={resolveCtaHref(secondary)} light>{secondary}</ArrowLink>}
        </div>}
      </div>
      <div className="inner-hero__media" data-hero-media>
        {brandLogo ? <div className="inner-hero__brand-logo" data-hero-mark>
          <Image src={brandLogo} alt={brandLogoAlt} width={1254} height={1254} sizes="(max-width: 575px) 90vw, 512px" priority/>
        </div> : <BrandImage src={image} alt={value(byLabel(section, "Image Alt"), locale) || heading} priority/>}
      </div>
    </div>
  </HeroMotion>;
}
