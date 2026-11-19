import Image from "next/image";
import {ArrowDownRight, ChartNoAxesCombined, Cog, Factory, Megaphone, ShieldCheck, Truck} from "lucide-react";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {ArrowLink} from "@/components/ui/ArrowLink";
import {Link} from "@/i18n/navigation";
import {capabilityVisuals, getMarketingCopy, heroFeed, MARKETING_IMAGES} from "@/content/marketing";
import type {Locale} from "@/types/content";
import styles from "./MarketingPage.module.css";

const functionIcons = [Factory, Cog, ShieldCheck, Truck, ChartNoAxesCombined, Megaphone];
const functionPaths = ["/capabilities/manufacturing", "/capabilities/operations", "/capabilities/quality-compliance", "/capabilities/logistics-distribution", "/capabilities/sales"];

export function MarketingPage({locale}: {locale: Locale}) {
  const copy = getMarketingCopy(locale);
  const partners = copy.functions.slice(0, functionPaths.length);

  return <main id="main-content" className={styles.page}>
    <HeroMotion className={styles.hero}>
      <div className={`container-xxl ${styles.heroGrid}`}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb} data-hero-eyebrow>{copy.breadcrumb}</div>
          <span className="section-kicker" data-hero-eyebrow>{copy.kicker}</span>
          <h1 data-hero-title><span>{copy.title}</span></h1>
          <h2 data-hero-copy>{copy.heading}</h2>
          <p data-hero-copy>{copy.intro}</p>
          <a href="#marketing-capabilities" className={styles.heroCta} data-hero-actions><span>{copy.heroCta}</span><ArrowDownRight size={19} className="directional-icon" aria-hidden="true"/></a>
        </div>

        <div className={styles.feed} data-hero-media role="group" aria-label={copy.feedLabel}>
          {heroFeed.map((column, columnIndex) => <div key={columnIndex} className={styles.feedColumn} dir="ltr">
            <div className={styles.feedTrack}>
              {[false, true].map(duplicate => column.map(image => <figure key={`${image}-${duplicate}`} className={styles.feedPost} aria-hidden={duplicate || undefined}>
                <Image src={`${MARKETING_IMAGES}/${image}.webp`} alt="" fill sizes="(max-width: 991px) 45vw, 20vw" priority={!duplicate && columnIndex === 0}/>
              </figure>))}
            </div>
          </div>)}
        </div>
      </div>
    </HeroMotion>

    <AnimatedSection id="marketing-capabilities" className={styles.capabilities} variant="stagger">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className="section-kicker">{copy.capabilitiesKicker}</span><h2>{copy.capabilitiesHeading}</h2></div>
          <p>{copy.capabilitiesIntro}</p>
        </header>
        <div className={styles.cards}>
          {copy.capabilities.map(item => {
            const visual = capabilityVisuals[item.id];
            return <article key={item.id} className={styles.card} data-marketing-capability={item.id} data-animate>
              <div className={`${styles.cardVisual}${visual?.shape === "reel" ? ` ${styles.cardVisualReel}` : ""}`}>
                {visual
                  ? <Image src={`${MARKETING_IMAGES}/${visual.image}.webp`} alt={visual.alt[locale]} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 45vw, 23vw"/>
                  : <svg className={styles.chart} viewBox="0 0 200 250" aria-hidden="true">
                      <g className={styles.chartBars}>{[70, 110, 90, 150, 130, 190].map((height, bar) => <rect key={bar} x={18 + bar * 29} y={230 - height} width="18" height={height} rx="4"/>)}</g>
                      <path className={styles.chartLine} d="M27 150 L56 118 L85 132 L114 86 L143 98 L172 44"/>
                      <circle className={styles.chartDot} cx="172" cy="44" r="7"/>
                    </svg>}
              </div>
              <div className={styles.cardCopy}><h3>{item.title}</h3><p>{item.description}</p></div>
            </article>;
          })}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection className={styles.campaigns} variant="rise">
      <div className={`container-xxl ${styles.campaignsGrid}`}>
        <header className={styles.campaignsHeader} data-animate>
          <span className="section-kicker">{copy.campaignsKicker}</span>
          <h2>{copy.campaignsHeading}</h2>
          <p>{copy.campaignsIntro}</p>
        </header>
        <div className={styles.phones} data-animate>
          {copy.reels.map(reel => <figure key={reel.image} className={styles.phone}>
            <div className={styles.phoneScreen}>
              <Image src={`${MARKETING_IMAGES}/${reel.image}.webp`} alt={reel.alt} fill sizes="(max-width: 767px) 60vw, 18vw"/>
            </div>
            <figcaption>{reel.title}</figcaption>
          </figure>)}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection className={styles.growth} variant="rise">
      <div className={`container-xxl ${styles.growthGrid}`}>
        <div className={styles.growthIntro} data-animate>
          <span className="section-kicker">{copy.growthKicker}</span>
          <h2>{copy.growthHeading}</h2>
          <p>{copy.growthIntro}</p>
          <div className={styles.actions}><ArrowLink href="/brands-partnerships/brands">{copy.brandCta}</ArrowLink><ArrowLink href="/contact">{copy.contactCta}</ArrowLink></div>
        </div>
        <nav className={styles.network} aria-label={copy.networkLabel} data-animate>
          <svg className={styles.networkLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {partners.map((label, index) => {
              const angle = (index / partners.length) * Math.PI * 2 - Math.PI / 2;
              return <line key={label} x1="50" y1="50" x2={50 + Math.cos(angle) * 38} y2={50 + Math.sin(angle) * 38}/>;
            })}
            <circle cx="50" cy="50" r="38"/>
          </svg>
          <span className={styles.networkCenter} aria-current="page"><Megaphone size={28} strokeWidth={1.5} aria-hidden="true"/><strong>{copy.networkCenter}</strong></span>
          {partners.map((label, index) => {
            const Icon = functionIcons[index];
            const angle = (index / partners.length) * Math.PI * 2 - Math.PI / 2;
            return <Link key={label} href={functionPaths[index]} className={styles.networkNode}
              style={{"--x": `${50 + Math.cos(angle) * 38}%`, "--y": `${50 + Math.sin(angle) * 38}%`} as React.CSSProperties}>
              <span><Icon size={22} strokeWidth={1.6} aria-hidden="true"/></span><strong>{label}</strong>
            </Link>;
          })}
        </nav>
      </div>
    </AnimatedSection>
  </main>;
}
