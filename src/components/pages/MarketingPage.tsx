import Image from "next/image";
import {ArrowDownRight, BadgeCheck, ChartNoAxesCombined, ChartPie, Cog, Factory, Lightbulb, Megaphone, MonitorSmartphone, ScanSearch, ShieldCheck, ShoppingCart, Truck} from "lucide-react";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {ArrowLink} from "@/components/ui/ArrowLink";
import {Link} from "@/i18n/navigation";
import {getMarketingCopy} from "@/content/marketing";
import type {Locale} from "@/types/content";
import styles from "./MarketingPage.module.css";

const capabilityIcons = [BadgeCheck, ScanSearch, Lightbulb, Megaphone, MonitorSmartphone, ShoppingCart, ChartPie, ChartNoAxesCombined];
const functionIcons = [Factory, Cog, ShieldCheck, Truck, ChartNoAxesCombined, Megaphone];
const functionPaths = ["/capabilities/manufacturing", "/capabilities/operations", "/capabilities/quality-compliance", "/capabilities/logistics-distribution", "/capabilities/sales"];

export function MarketingPage({locale}: {locale: Locale}) {
  const copy = getMarketingCopy(locale);
  const number = (index: number) => new Intl.NumberFormat(locale, {minimumIntegerDigits: 2}).format(index + 1);
  return <main id="main-content" className={styles.page}>
    <HeroMotion className={styles.hero}>
      <div className={`container-xxl ${styles.heroGrid}`}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb} data-hero-eyebrow>{copy.breadcrumb}</div>
          <span className="section-kicker" data-hero-eyebrow>{copy.kicker}</span>
          <h1 data-hero-title><span>{copy.title}</span></h1>
          <h2 data-hero-copy>{copy.heading}</h2>
          <p data-hero-copy>{copy.intro}</p>
          <a href="#marketing-capabilities" className="arrow-link arrow-link--light" data-hero-actions><span>{copy.heroCta}</span><ArrowDownRight size={19} className="directional-icon" aria-hidden="true"/></a>
          <div className={styles.pillars} data-hero-copy>{copy.pillars.map((pillar, index) => <span key={pillar}><small>{number(index)}</small>{pillar}</span>)}</div>
        </div>
        <figure className={styles.heroVisual} data-hero-media>
          <div className={styles.heroImage}><Image src="/assets/images/prod-range-03-clean.png" alt={copy.heroAlt} fill sizes="(max-width: 991px) 100vw, 44vw" priority/></div>
          <figcaption><Megaphone size={23} aria-hidden="true"/><span>{copy.heroCaption}</span></figcaption>
        </figure>
      </div>
    </HeroMotion>

    <AnimatedSection id="marketing-capabilities" className={styles.capabilities} variant="stagger">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className="section-kicker">{copy.capabilitiesKicker}</span><h2>{copy.capabilitiesHeading}</h2></div>
          <p>{copy.capabilitiesIntro}</p>
        </header>
        <div className={styles.cards}>
          {copy.capabilities.map((item, index) => {
            const Icon = capabilityIcons[index];
            return <article key={item.id} className={styles.card} data-marketing-capability={item.id} data-animate>
              <div className={styles.cardMeta}><Icon size={30} strokeWidth={1.5} aria-hidden="true"/><span>{number(index)}</span></div>
              <h3>{item.title}</h3><p>{item.description}</p>
            </article>;
          })}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection className={styles.growth} variant="rise">
      <div className="container-xxl">
        <div className={styles.growthIntro} data-animate>
          <div><span className="section-kicker">{copy.growthKicker}</span><h2>{copy.growthHeading}</h2></div>
          <div><p>{copy.growthIntro}</p><div className={styles.actions}><ArrowLink href="/brands-partnerships/brands" light>{copy.brandCta}</ArrowLink><ArrowLink href="/contact" light>{copy.contactCta}</ArrowLink></div></div>
        </div>
        <nav className={styles.functions} aria-label={copy.networkLabel} data-animate>
          {copy.functions.map((label, index) => {
            const Icon = functionIcons[index];
            const content = <><span className={styles.functionIcon}><Icon size={27} strokeWidth={1.5} aria-hidden="true"/></span><strong>{label}</strong></>;
            return functionPaths[index]
              ? <Link key={label} href={functionPaths[index]}>{content}</Link>
              : <span key={label} className={styles.currentFunction} aria-current="page">{content}</span>;
          })}
        </nav>
      </div>
    </AnimatedSection>
  </main>;
}
