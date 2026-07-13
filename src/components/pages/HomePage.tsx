import {ArrowDown, ArrowRight, ShieldCheck, Wheat, Factory, Globe2, Users, Leaf, BriefcaseBusiness} from "lucide-react";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {ArrowLink} from "@/components/ui/ArrowLink";
import {BrandImage} from "@/components/ui/BrandImage";
import {PAGE_IMAGES} from "@/content/pages";
import {byLabel, numberedGroups, paragraphs, value} from "@/lib/content";
import type {Locale, PageContent} from "@/types/content";

const iconSet = [Factory, ShieldCheck, Wheat, Globe2, Leaf, Users];

export function HomePage({page, locale}: {page: PageContent; locale: Locale}) {
  const ar = locale === "ar";
  const [hero, intro, glance, manufacturing, portfolio, fonte, quality, tamimi, partnerships, sustainability, market, careers, finalCta] = page.sections;
  const heroHeading = value(byLabel(hero,"Main Heading"),locale);
  const heroWords = heroHeading.split(/(?<=[.!؟])\s+/).filter(Boolean);
  return <main id="main-content">
    <HeroMotion className="home-hero">
      <div className="home-hero__media" data-hero-media><BrandImage src={PAGE_IMAGES.home} alt={heroHeading} priority/></div>
      <div className="home-hero__wash" aria-hidden="true"/>
      <div className="container-xxl home-hero__content">
        <span className="home-hero__eyebrow" data-hero-eyebrow>{value(byLabel(hero,"Eyebrow"),locale)}</span>
        <h1 data-hero-title>{heroWords.map((word,i)=><span key={i}>{word}</span>)}</h1>
        <div className="home-hero__bottom"><div data-hero-copy>{paragraphs(hero,locale).map((p,i)=><p key={i}>{p}</p>)}</div><div className="home-hero__actions" data-hero-actions><ArrowLink href="/about/masdar-al-hayat" light>{value(byLabel(hero,"Primary CTA"),locale)}</ArrowLink><ArrowLink href="/brands-partnerships/business-partnerships" light>{value(byLabel(hero,"Secondary CTA"),locale)}</ArrowLink></div></div>
      </div>
      <div className="home-hero__mark" data-hero-mark aria-hidden="true"><span>M</span><small>{ar ? "منذ ٢٠٠٩" : "SINCE 2009"}</small></div>
      <a className="home-hero__scroll" href="#who-we-are"><ArrowDown/>{ar ? "اكتشف" : "Discover"}</a>
    </HeroMotion>

    <AnimatedSection id="who-we-are" className="home-intro" variant="rise"><div className="container-xxl home-intro__grid"><div data-animate><span className="section-kicker">{value(byLabel(intro,"Section Label"),locale)}</span><h2>{value(byLabel(intro,"Main Heading"),locale)}</h2></div><div data-animate>{paragraphs(intro,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/about/masdar-al-hayat">{value(byLabel(intro,"CTA"),locale)}</ArrowLink></div></div></AnimatedSection>

    <AnimatedSection className="glance-section" variant="stagger"><div className="container-xxl"><header className="section-heading" data-animate><span className="section-kicker">{value(byLabel(glance,"Section Label"),locale)}</span><h2>{value(byLabel(glance,"Main Heading"),locale)}</h2><p>{value(byLabel(glance,"Introduction"),locale)}</p></header><div className="glance-grid">{numberedGroups(glance).map((group)=><article key={group.key} data-animate><span className="glance-grid__value">{value(group.parts.Value,locale)}</span><h3>{value(group.parts.Title,locale)}</h3><p>{value(group.parts.Description,locale)}</p><span className="glance-grid__line"/></article>)}</div></div></AnimatedSection>

    <AnimatedSection className="manufacturing-home" variant="mask"><div className="container-xxl manufacturing-home__grid"><div className="manufacturing-home__content" data-animate><span className="section-kicker">{value(byLabel(manufacturing,"Section Label"),locale)}</span><h2>{value(byLabel(manufacturing,"Main Heading"),locale)}</h2>{paragraphs(manufacturing,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/operations-quality/manufacturing-operations">{value(byLabel(manufacturing,"CTA"),locale)}</ArrowLink></div><BrandImage src={PAGE_IMAGES.industrial} alt={value(byLabel(manufacturing,"Main Heading"),locale)}/><div className="manufacturing-home__rail">{numberedGroups(manufacturing).map((g,i)=>{const Icon=iconSet[i%iconSet.length];return <div key={g.key} data-animate><Icon/><span>0{i+1}</span><h3>{value((locale === "ar" ? g.parts["Arabic Title"] : undefined) || g.parts.Title,locale)}</h3></div>})}</div></div></AnimatedSection>

    <AnimatedSection className="portfolio-home" variant="stagger"><div className="container-xxl"><header className="portfolio-home__header" data-animate><div><span className="section-kicker">{value(byLabel(portfolio,"Section Label"),locale)}</span><h2>{value(byLabel(portfolio,"Main Heading"),locale)}</h2></div><div>{paragraphs(portfolio,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/brands-partnerships/brands-portfolio">{value(byLabel(portfolio,"CTA"),locale)}</ArrowLink></div></header><div className="portfolio-orbit">{numberedGroups(portfolio).map((g,i)=><article key={g.key} data-animate><span>0{i+1}</span><h3>{value(g.parts.Title,locale)}</h3><p>{value(g.parts.Description,locale)}</p></article>)}</div></div></AnimatedSection>

    <AnimatedSection className="fonte-home" variant="slide"><div className="fonte-home__background"><BrandImage src={PAGE_IMAGES.portfolio} alt="Fonte flagship food portfolio"/></div><div className="container-xxl fonte-home__content" data-animate><span className="section-kicker">{value(byLabel(fonte,"Section Label"),locale)}</span><h2>{value(byLabel(fonte,"Main Heading"),locale)}</h2>{paragraphs(fonte,locale).map((p,i)=><p key={i}>{p}</p>)}<div className="fonte-home__categories">{numberedGroups(fonte).map((g)=><span key={g.key}>{value(g.parts.Title || g.parts.Text,locale) || value(Object.values(g.parts)[0],locale)}</span>)}</div><ArrowLink href="/brands-partnerships/brands-portfolio" light>{value(byLabel(fonte,/CTA/),locale)}</ArrowLink></div></AnimatedSection>

    <AnimatedSection className="quality-home" variant="line"><div className="container-xxl quality-home__grid"><header data-animate><ShieldCheck/><span className="section-kicker">{value(byLabel(quality,"Section Label"),locale)}</span><h2>{value(byLabel(quality,"Main Heading"),locale)}</h2></header><div data-animate>{paragraphs(quality,locale).map((p,i)=><p key={i}>{p}</p>)}<div className="quality-home__steps">{numberedGroups(quality).map((g,i)=><div key={g.key}><span>{String(i+1).padStart(2,"0")}</span><h3>{value(g.parts.Title,locale)}</h3><p>{value(g.parts.Description,locale)}</p></div>)}</div><ArrowLink href="/operations-quality/quality-food-safety-compliance">{value(byLabel(quality,"CTA"),locale)}</ArrowLink></div></div></AnimatedSection>

    <AnimatedSection className="legacy-home" variant="mask"><div className="container-xxl legacy-home__grid"><BrandImage src={PAGE_IMAGES.heritage} alt={value(byLabel(tamimi,"Main Heading"),locale)}/><div data-animate><span className="legacy-home__year">2009</span><span className="section-kicker">{value(byLabel(tamimi,"Section Label"),locale)}</span><h2>{value(byLabel(tamimi,"Main Heading"),locale)}</h2>{paragraphs(tamimi,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/about/group-story-tamimi-group">{value(byLabel(tamimi,"CTA"),locale)}</ArrowLink></div></div></AnimatedSection>

    <AnimatedSection className="partnership-home" variant="stagger"><div className="container-xxl"><header className="section-heading section-heading--wide" data-animate><div><BriefcaseBusiness/><span className="section-kicker">{value(byLabel(partnerships,"Section Label"),locale)}</span><h2>{value(byLabel(partnerships,"Main Heading"),locale)}</h2></div><div>{paragraphs(partnerships,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/brands-partnerships/business-partnerships">{value(byLabel(partnerships,"CTA"),locale)}</ArrowLink></div></header><div className="partnership-home__channels">{numberedGroups(partnerships).map((g,i)=><article data-animate key={g.key}><span>0{i+1}</span><h3>{value(g.parts.Title,locale)}</h3><p>{value(g.parts.Description,locale)}</p><ArrowRight/></article>)}</div></div></AnimatedSection>

    <AnimatedSection className="sustainability-home" variant="scale"><div className="container-xxl sustainability-home__grid"><div className="sustainability-home__visual"><BrandImage src={PAGE_IMAGES.sustainability} alt={value(byLabel(sustainability,"Main Heading"),locale)}/><Leaf/></div><div data-animate><span className="section-kicker">{value(byLabel(sustainability,"Section Label"),locale)}</span><h2>{value(byLabel(sustainability,"Main Heading"),locale)}</h2>{paragraphs(sustainability,locale).map((p,i)=><p key={i}>{p}</p>)}<div className="sustainability-home__pillars">{numberedGroups(sustainability).map(g=><span key={g.key}>{value(g.parts.Title || g.parts.Text,locale) || value(Object.values(g.parts)[0],locale)}</span>)}</div><ArrowLink href="/sustainability-responsibility">{value(byLabel(sustainability,"CTA"),locale)}</ArrowLink></div></div></AnimatedSection>

    <AnimatedSection className="market-home" variant="slide"><div className="market-home__media"><BrandImage src={PAGE_IMAGES.market} alt={value(byLabel(market,"Main Heading"),locale)}/></div><div className="container-xxl market-home__overlay" data-animate><Globe2/><span className="section-kicker">{value(byLabel(market,"Section Label"),locale)}</span><h2>{value(byLabel(market,"Main Heading"),locale)}</h2>{paragraphs(market,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/market-presence/exhibitions" light>{value(byLabel(market,"CTA"),locale)}</ArrowLink></div></AnimatedSection>

    <AnimatedSection className="careers-home" variant="rise"><div className="container-xxl careers-home__grid"><div data-animate><Users/><span className="section-kicker">{value(byLabel(careers,"Section Label"),locale)}</span><h2>{value(byLabel(careers,"Main Heading"),locale)}</h2>{paragraphs(careers,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/careers">{value(byLabel(careers,"CTA"),locale)}</ArrowLink></div><BrandImage src={PAGE_IMAGES.careers} alt={value(byLabel(careers,"Main Heading"),locale)}/></div></AnimatedSection>

    <AnimatedSection className="home-final" variant="mask"><div className="container-xxl home-final__inner" data-animate><span className="section-kicker">{value(byLabel(finalCta,"Section Label"),locale)}</span><h2>{value(byLabel(finalCta,"Main Heading"),locale)}</h2>{paragraphs(finalCta,locale).map((p,i)=><p key={i}>{p}</p>)}<div><ArrowLink href="/contact" light>{value(byLabel(finalCta,/Primary CTA|CTA/),locale)}</ArrowLink><ArrowLink href="/brands-partnerships/business-partnerships" light>{value(byLabel(finalCta,"Secondary CTA"),locale)}</ArrowLink></div></div></AnimatedSection>
  </main>;
}
