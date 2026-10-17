"use client";

import Image from "next/image";
import {useRef, useState, type KeyboardEvent} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {ArrowDownRight, ArrowUpRight, Lightbulb, MessagesSquare, Network, Package, RotateCcw, ShieldCheck, Truck, UsersRound, Workflow} from "lucide-react";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {ArrowLink} from "@/components/ui/ArrowLink";
import {innovationCopy} from "@/content/research-innovation-2";
import type {Locale} from "@/types/content";
import styles from "./ResearchInnovationExperience.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const areaIcons = [MessagesSquare, Package, ShieldCheck, Workflow, Truck, UsersRound];
const nodePositions = [{left: "50%", top: "9%"}, {left: "84%", top: "29%"}, {left: "84%", top: "71%"}, {left: "50%", top: "91%"}, {left: "16%", top: "71%"}, {left: "16%", top: "29%"}];
const connections = ["M320 280 L320 50", "M320 280 L538 162", "M320 280 L538 398", "M320 280 L320 510", "M320 280 L102 398", "M320 280 L102 162"];

export function ResearchInnovationExperience({locale}: {locale: Locale}) {
  const copy = innovationCopy[locale];
  const [activeArea, setActiveArea] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const areaRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pageRef = useRef<HTMLElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);
  const areaScrollRef = useRef<ScrollTrigger | null>(null);
  const area = copy.areas[activeArea];
  const step = copy.steps[activeStep];
  const AreaIcon = areaIcons[activeArea];
  const number = (index: number) => new Intl.NumberFormat(locale, {minimumIntegerDigits: 2}).format(index + 1);

  useGSAP(() => {
    const explorer = explorerRef.current;
    if (!explorer) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: explorer,
        start: () => `top ${(document.querySelector(".site-header")?.getBoundingClientRect().height ?? 104) + 20}px`,
        end: () => `+=${(copy.areas.length - 1) * Math.max(350, window.innerHeight * .65)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => setActiveArea(Math.round(self.progress * (copy.areas.length - 1))),
      });
      areaScrollRef.current = trigger;
      return () => {trigger.kill(); areaScrollRef.current = null;};
    });
    return () => media.revert();
  }, {scope: pageRef, dependencies: [copy.areas.length]});

  function selectArea(index: number) {
    setActiveArea(index);
    const trigger = areaScrollRef.current;
    if (trigger?.isActive) {
      window.scrollTo({top: trigger.start + (trigger.end - trigger.start) * index / (copy.areas.length - 1), behavior: "instant"});
    }
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, current: number, length: number, select: (index: number) => void, refs: (HTMLButtonElement | null)[]) {
    let next = current;
    const forward = locale === "ar" ? "ArrowLeft" : "ArrowRight";
    const backward = locale === "ar" ? "ArrowRight" : "ArrowLeft";
    if (event.key === forward || event.key === "ArrowDown") next = (current + 1) % length;
    else if (event.key === backward || event.key === "ArrowUp") next = (current - 1 + length) % length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = length - 1;
    else return;
    event.preventDefault();
    select(next);
    refs[next]?.focus();
  }

  return <main ref={pageRef} id="main-content" className={styles.page}>
    <HeroMotion className={styles.hero}>
      <div className={`container-xxl ${styles.heroGrid}`}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb} data-hero-eyebrow>{copy.breadcrumb}</div>
          <span className="section-kicker" data-hero-eyebrow>{copy.eyebrow}</span>
          <h1 data-hero-title><span>{copy.heading}</span></h1>
          <p data-hero-copy>{copy.intro}</p>
          <a href="#innovation-areas" className="arrow-link arrow-link--light" data-hero-actions><span>{copy.explore}</span><ArrowDownRight className="directional-icon" size={20}/></a>
        </div>
        <figure className={styles.heroVisual} data-hero-media>
          <div className={styles.heroImage}>
            <Image src="/assets/images/research-innovation-2/connected-thinking.webp" alt={copy.imageAlt} fill sizes="(max-width: 991px) 100vw, 50vw" priority/>
          </div>
          <figcaption><Network size={22} aria-hidden="true"/><span>{copy.imageCaption}</span></figcaption>
        </figure>
        <div className={styles.pillars} data-hero-copy>
          {copy.pillars.map((pillar, index) => <div key={pillar.title}>
            <span className={styles.pillarNumber}>{number(index)}</span>
            <div><strong>{pillar.title}</strong><span>{pillar.text}</span></div>
          </div>)}
        </div>
      </div>
    </HeroMotion>

    <AnimatedSection id="innovation-areas" className={styles.areas} variant="rise">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className="section-kicker">{copy.areasKicker}</span><h2>{copy.areasHeading}</h2></div>
          <p>{copy.areasIntro}</p>
        </header>
        <div ref={explorerRef} className={styles.explorer}>
          <div className={styles.networkWrap} data-animate>
            <div className={styles.network} role="tablist" aria-label={copy.mapLabel}>
              <svg className={styles.connections} viewBox="0 0 640 560" aria-hidden="true">
                <circle cx="320" cy="280" r="192"/>
                {connections.map((path, index) => <path key={path} d={path} className={activeArea === index ? styles.activeConnection : undefined}/>)}
              </svg>
              <div className={styles.hub} aria-hidden="true"><Network size={28}/><strong>{copy.mapCenter}</strong><span>{locale === "ar" ? "بحث · ابتكار · تطوير" : "R · I · D"}</span></div>
              {copy.areas.map((item, index) => {
                const Icon = areaIcons[index];
                return <button
                  key={item.id}
                  ref={element => {areaRefs.current[index] = element;}}
                  type="button"
                  role="tab"
                  id={`innovation-tab-${item.id}`}
                  aria-controls="innovation-area-panel"
                  aria-selected={activeArea === index}
                  tabIndex={activeArea === index ? 0 : -1}
                  className={`${styles.node} ${activeArea === index ? styles.activeNode : ""}`}
                  style={nodePositions[index]}
                  onClick={() => selectArea(index)}
                  onKeyDown={event => navigateTabs(event, index, copy.areas.length, selectArea, areaRefs.current)}
                ><Icon size={24} aria-hidden="true"/><span>{item.label}</span></button>;
              })}
            </div>
            <p className={styles.mapHint}>{copy.mapHint}</p>
          </div>
          <div id="innovation-area-panel" className={styles.areaPanel} role="tabpanel" aria-labelledby={`innovation-tab-${area.id}`} tabIndex={0}>
            <div key={area.id} className={styles.panelContent}>
              <div className={styles.panelMeta}><span dir="ltr">{number(activeArea)} / {number(copy.areas.length - 1)}</span><AreaIcon size={30} aria-hidden="true"/></div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <span className={styles.detailLabel}>{copy.focusLabel}</span>
              <ul>{area.focus.map(item => <li key={item}>{item}</li>)}</ul>
              <div className={styles.valueBox}><Lightbulb size={22} aria-hidden="true"/><div><span>{copy.valueLabel}</span><strong>{area.value}</strong></div></div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection className={styles.journey} variant="rise">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className="section-kicker">{copy.journeyKicker}</span><h2>{copy.journeyHeading}</h2></div>
          <p>{copy.journeyIntro}</p>
        </header>
        <div className={styles.journeyTabs} role="tablist" aria-label={copy.journeyHeading}>
          {copy.steps.map((item, index) => <button
            key={item.title}
            ref={element => {stepRefs.current[index] = element;}}
            type="button"
            role="tab"
            id={`journey-tab-${index}`}
            aria-controls="innovation-journey-panel"
            aria-selected={activeStep === index}
            tabIndex={activeStep === index ? 0 : -1}
            className={activeStep === index ? styles.activeStep : undefined}
            onClick={() => setActiveStep(index)}
            onKeyDown={event => navigateTabs(event, index, copy.steps.length, setActiveStep, stepRefs.current)}
          ><span>{number(index)}</span><strong>{item.title}</strong></button>)}
        </div>
        <div id="innovation-journey-panel" className={styles.journeyPanel} role="tabpanel" aria-labelledby={`journey-tab-${activeStep}`} tabIndex={0}>
          <div key={activeStep} className={styles.journeyDetail}>
            <p>{step.text}</p>
            <div><ArrowUpRight size={25} className="directional-icon" aria-hidden="true"/><strong>{step.outcome}</strong></div>
          </div>
          <div className={styles.journeyFooter}><span><RotateCcw size={20} aria-hidden="true"/>{copy.feedback}</span><ArrowLink href="/contact">{copy.cta}</ArrowLink></div>
        </div>
      </div>
    </AnimatedSection>
  </main>;
}
