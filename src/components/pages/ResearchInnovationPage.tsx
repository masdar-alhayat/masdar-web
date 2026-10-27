import Image from "next/image";
import {ArrowDown, ArrowDownRight, Lightbulb, ScanSearch} from "lucide-react";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {ResearchHeroStage, ResearchProductShowcase} from "@/components/ui/ResearchInnovationInteractive";
import {researchCopy} from "@/content/research-innovation";
import type {Locale} from "@/types/content";
import styles from "./ResearchInnovationPage.module.css";

const pillarIcons = [ScanSearch, Lightbulb];

export function ResearchInnovationPage({locale}: {locale: Locale}) {
  const copy = researchCopy[locale];
  const number = (index: number) => new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en", {minimumIntegerDigits: 2}).format(index + 1);

  return <main id="main-content" className={styles.page}>
    <HeroMotion className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true"/>
      <div className={`container-xxl ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <div className={styles.breadcrumb} data-hero-eyebrow>{copy.breadcrumb}</div>
          <span className={styles.kicker} data-hero-eyebrow>{copy.kicker}</span>
          <h1 data-hero-title><span>{copy.heading[0]}</span><span><em>{copy.heading[1]}</em></span></h1>
          <p data-hero-copy>{copy.intro}</p>
          <div className={styles.heroActions} data-hero-actions>
            <a className={styles.primaryButton} href="#ri-products">{copy.productsCta}<ArrowDown size={18} aria-hidden="true"/></a>
            <a className={styles.ghostLink} href="#ri-focus">{copy.areasCta}<ArrowDownRight className="directional-icon" size={18} aria-hidden="true"/></a>
          </div>
          <ul className={styles.pillars} data-hero-copy>
            {copy.pillars.map((pillar, index) => {
              const Icon = pillarIcons[index];
              return <li key={pillar.title}><Icon size={22} strokeWidth={1.6} aria-hidden="true"/><div><strong>{pillar.title}</strong><span>{pillar.text}</span></div></li>;
            })}
          </ul>
        </div>
        <div data-hero-media className={styles.heroMedia}>
          <ResearchHeroStage notes={copy.heroNotes} locale={locale}/>
        </div>
      </div>
    </HeroMotion>

    <AnimatedSection id="ri-focus" className={styles.focus} variant="stagger">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className={styles.kicker}>{copy.areasKicker}</span><h2>{copy.areasHeading}</h2></div>
          <p>{copy.areasIntro}</p>
        </header>
        <div className={styles.focusGrid}>
          {copy.areas.map((area, index) => <article key={area.id} className={styles.focusCard} data-animate>
            <div className={styles.focusImage}><Image src={area.image} alt="" fill sizes="(max-width: 767px) 92vw, (max-width: 1199px) 46vw, 31vw"/></div>
            <div className={styles.focusTop}><span className={styles.focusIndex}>{number(index)}</span><span className={styles.focusLabel}>{area.label}</span></div>
            <div className={styles.focusBody}>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </div>
          </article>)}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="ri-products" className={styles.products} variant="rise">
      <div className="container-xxl">
        <header className={styles.productsHeader} data-animate>
          <span className={styles.kicker}>{copy.productsKicker}</span>
          <h2>{copy.productsHeading}</h2>
          <p>{copy.productsIntro}</p>
        </header>
        <div data-animate><ResearchProductShowcase copy={copy} locale={locale}/></div>
      </div>
    </AnimatedSection>
  </main>;
}
