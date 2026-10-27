"use client";

import Image from "next/image";
import {useId, useRef, useState} from "react";
import {ArrowUpRight, Check} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {ResearchCopy} from "@/content/research-innovation";
import type {Locale} from "@/types/content";
import styles from "@/components/pages/ResearchInnovationPage.module.css";

const IMG = "/assets/images/research-innovation";
type Style = React.CSSProperties & Record<`--${string}`, string | number>;

export function ResearchHeroStage({notes, locale}: {notes: ResearchCopy["heroNotes"]; locale: Locale}) {
  const stage = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !stage.current) return;
    const box = stage.current.getBoundingClientRect();
    stage.current.style.setProperty("--px", String((event.clientX - box.left) / box.width - .5));
    stage.current.style.setProperty("--py", String((event.clientY - box.top) / box.height - .5));
  };
  const reset = () => {
    stage.current?.style.setProperty("--px", "0");
    stage.current?.style.setProperty("--py", "0");
  };

  return <div ref={stage} className={styles.stage} dir="ltr" onPointerMove={move} onPointerLeave={reset}>
    <div className={styles.stageRings} aria-hidden="true"><span/><span/><span/></div>
    <svg className={styles.stageOrbit} viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="186"/><circle cx="200" cy="200" r="150"/></svg>
    <figure className={`${styles.specimen} ${styles.specimenProtein}`} style={{"--depth": 18} as Style}>
      <Image src={`${IMG}/tortilla-protein.webp`} alt={ar ? "تورتيلا فونتي بالبروتين" : "Fonte Protein Tortilla pack"} fill sizes="(max-width: 991px) 40vw, 22vw" priority/>
    </figure>
    <figure className={`${styles.specimen} ${styles.specimenBrioche}`} style={{"--depth": 26} as Style}>
      <Image src={`${IMG}/hanini-brioche-front-whole-v1.webp`} alt={ar ? "عبوة بريوش حنيني" : "Hanini Brioche pack"} fill sizes="(max-width: 991px) 24vw, 12vw" priority/>
    </figure>
    <figure className={`${styles.specimen} ${styles.specimenChocolate}`} style={{"--depth": 34} as Style}>
      <Image src={`${IMG}/pancake-single-chocolate.webp`} alt={ar ? "بان كيك فونتي بالشوكولاتة والبندق" : "Fonte Pan Cake Chocolate Hazelnut"} fill sizes="(max-width: 991px) 24vw, 12vw"/>
    </figure>
    <figure className={`${styles.specimen} ${styles.specimenBlueberry}`} style={{"--depth": 30} as Style}>
      <Image src={`${IMG}/pancake-single-blueberry.webp`} alt={ar ? "بان كيك فونتي بالتوت الأزرق" : "Fonte Pan Cake Blueberry"} fill sizes="(max-width: 991px) 24vw, 12vw"/>
    </figure>
    <figure className={`${styles.specimen} ${styles.specimenStrawberry}`} style={{"--depth": 42} as Style}>
      <Image src={`${IMG}/pancake-single-strawberry.webp`} alt={ar ? "بان كيك فونتي بالفراولة" : "Fonte Pan Cake Strawberry"} fill sizes="(max-width: 991px) 44vw, 22vw" priority/>
    </figure>
    <span className={`${styles.note} ${styles.noteProtein}`} dir={ar ? "rtl" : "ltr"}><i aria-hidden="true"/>{notes.protein}</span>
    <span className={`${styles.note} ${styles.noteSugar}`} dir={ar ? "rtl" : "ltr"}><i aria-hidden="true"/>{notes.sugar}</span>
    <span className={`${styles.note} ${styles.noteFlavours}`} dir={ar ? "rtl" : "ltr"}><i aria-hidden="true"/>{notes.flavours}</span>
  </div>;
}

const flavourImages = {
  strawberry: {box: `${IMG}/pancake-box-strawberry.webp`, single: `${IMG}/pancake-single-strawberry.webp`},
  blueberry: {box: `${IMG}/pancake-box-blueberry.webp`, single: `${IMG}/pancake-single-blueberry.webp`},
  chocolate: {box: `${IMG}/pancake-box-chocolate.webp`, single: `${IMG}/pancake-single-chocolate.webp`},
};
const briocheViews = {front: `${IMG}/hanini-brioche-front-whole-v1.webp`, side: `${IMG}/hanini-brioche-side.webp`, back: `${IMG}/hanini-brioche-back.webp`};

export function ResearchProductShowcase({copy, locale}: {copy: ResearchCopy; locale: Locale}) {
  const [active, setActive] = useState(0);
  const [flavour, setFlavour] = useState<keyof typeof flavourImages>("strawberry");
  const [view, setView] = useState<keyof typeof briocheViews>("front");
  const [pack, setPack] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const ar = locale === "ar";
  const flavourName = copy.flavours.find(item => item.id === flavour)!.name;

  const stages: Record<string, React.ReactNode> = {
    pancake: <div className={styles.stagePancake} data-flavour={flavour}>
      <div key={`box-${flavour}`} className={styles.pancakeBox}><Image src={flavourImages[flavour].box} alt={ar ? `علبة بان كيك فونتي ${flavourName}` : `Fonte Pan Cake ${flavourName} 12-piece display box`} fill sizes="(max-width: 991px) 60vw, 30vw"/></div>
      <div key={`single-${flavour}`} className={styles.pancakeSingle}><Image src={flavourImages[flavour].single} alt={ar ? `بان كيك فونتي ${flavourName} بتغليف فردي` : `Fonte Pan Cake ${flavourName} single pack`} fill sizes="(max-width: 991px) 40vw, 18vw"/></div>
    </div>,
    brioche: <div className={styles.stageBrioche}>
      <div key={view} className={styles.briochePack}><Image src={briocheViews[view]} alt={ar ? `بريوش حنيني - ${copy.views.find(item => item.id === view)!.name}` : `Hanini Brioche pack, ${view} view`} fill sizes="(max-width: 991px) 40vw, 16vw"/></div>
    </div>,
    protein: <div className={styles.stageProtein}>
      <div className={styles.proteinPack}><Image src={`${IMG}/tortilla-protein.webp`} alt={ar ? "عبوة تورتيلا فونتي بالبروتين" : "Fonte Protein Tortilla pack"} fill sizes="(max-width: 991px) 70vw, 30vw"/></div>
      {copy.products[2].facts.map((fact, index) => <span key={fact} className={styles.proteinBubble} data-index={index}>{fact}</span>)}
    </div>,
    tortillas: <div className={styles.stageRange} dir="ltr">
      {copy.range.map((item, index) => <button key={item.id} type="button" className={styles.rangePack} data-active={pack === index}
        style={{"--i": index, "--z": 10 - Math.abs(index - pack)} as Style} onClick={() => setPack(index)} onMouseEnter={() => setPack(index)} aria-pressed={pack === index}>
        <Image src={`${IMG}/tortilla-${item.id}.webp`} alt={ar ? `تورتيلا فونتي ${item.name}` : `Fonte ${item.name} tortilla pack`} fill sizes="(max-width: 991px) 30vw, 14vw"/>
      </button>)}
      <span className={styles.rangeLabel} aria-live="polite">{copy.range[pack].name}</span>
    </div>,
  };

  const controls: Record<string, React.ReactNode> = {
    pancake: <div className={styles.controls} role="group" aria-label={copy.flavourLabel}>
      <span>{copy.flavourLabel}</span>
      <div>{copy.flavours.map(item => <button key={item.id} type="button" data-swatch={item.id} aria-pressed={flavour === item.id} onClick={() => setFlavour(item.id)}>{item.name}</button>)}</div>
    </div>,
    brioche: <div className={styles.controls} role="group" aria-label={copy.viewLabel}>
      <span>{copy.viewLabel}</span>
      <div>{copy.views.map(item => <button key={item.id} type="button" aria-pressed={view === item.id} onClick={() => setView(item.id)}>{item.name}</button>)}</div>
    </div>,
    tortillas: <div className={styles.controls} role="group" aria-label={copy.products[3].name}>
      <span>{copy.products[3].tag}</span>
      <div>{copy.range.map((item, index) => <button key={item.id} type="button" aria-pressed={pack === index} onClick={() => setPack(index)}>{item.name}</button>)}</div>
    </div>,
  };

  return <div className={styles.showcase}>
    <div className={styles.productTabs} role="tablist" aria-label={copy.productsKicker}>
      {copy.products.map((product, index) => <button key={product.id} type="button" role="tab"
        ref={element => {tabs.current[index] = element;}}
        id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
        aria-selected={active === index} tabIndex={active === index ? 0 : -1}
        data-product={product.id}
        onClick={() => setActive(index)}
        onKeyDown={event => {
          let next = active;
          if (event.key === "ArrowRight") next = (active + (ar ? -1 : 1) + copy.products.length) % copy.products.length;
          else if (event.key === "ArrowLeft") next = (active + (ar ? 1 : -1) + copy.products.length) % copy.products.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = copy.products.length - 1;
          else return;
          event.preventDefault();
          setActive(next);
          tabs.current[next]?.focus({preventScroll: true});
        }}>
        <span className={styles.tabThumb}><Image src={product.thumb} alt="" fill sizes="56px"/></span>
        <span className={styles.tabText}><strong>{product.name}</strong><small>{product.tag}</small></span>
      </button>)}
    </div>

    {copy.products.map((product, index) => <div key={product.id} className={styles.productPanel} data-product={product.id}
      role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0} hidden={active !== index}>
      <div className={styles.productStage}>
        <span className={styles.stageTag}>{product.tag}</span>
        {active === index && stages[product.id]}
      </div>
      <div className={styles.productCopy}>
        <h3>{product.name}</h3>
        <dl>
          <div><dt>{copy.insightLabel}</dt><dd>{product.insight}</dd></div>
          <div><dt>{copy.innovationLabel}</dt><dd>{product.innovation}</dd></div>
        </dl>
        <ul className={styles.facts}>{product.facts.map(fact => <li key={fact}><Check size={16} aria-hidden="true"/>{fact}</li>)}</ul>
        {controls[product.id]}
      </div>
    </div>)}

    <div className={styles.closing}>
      <p>{copy.closing}</p>
      <Link href="/contact" className={styles.primaryButton}>{copy.cta}<ArrowUpRight className="directional-icon" size={18} aria-hidden="true"/></Link>
    </div>
  </div>;
}
