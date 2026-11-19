"use client";

import Image from "next/image";
import {useId, useRef, useState} from "react";
import {ArrowLeft, ArrowRight, ArrowUpRight, Boxes, ChefHat, PackageOpen, Soup, Sparkles, Wheat} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/types/content";
import styles from "@/components/pages/FontePage.module.css";

export interface FonteProduct {
  title: string;
  description: string;
  image: string;
  accent?: string;
}

const icons = [Wheat, PackageOpen, ChefHat, Sparkles, Soup, Boxes];

export function FonteProductExplorer({products, locale}: {products: FonteProduct[]; locale: Locale}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const ar = locale === "ar";
  const total = String(products.length).padStart(2, "0");
  const step = (delta: number) => setActive(current => (current + delta + products.length) % products.length);

  return <div className={styles.explorer} style={{"--accent": products[active].accent} as React.CSSProperties}>
    <div className={styles.tabs} role="tablist" aria-label={ar ? "فئات منتجات فونتي" : "Fonte product categories"}>
      {products.map((product, index) => {
        const Icon = icons[index];
        return <button key={product.title} type="button" role="tab"
          ref={element => {tabs.current[index] = element;}}
          id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
          aria-selected={active === index} tabIndex={active === index ? 0 : -1}
          style={{"--accent": product.accent} as React.CSSProperties}
          onClick={() => setActive(index)}
          onKeyDown={event => {
            let next = active;
            if (event.key === "ArrowRight") next = (active + (ar ? -1 : 1) + products.length) % products.length;
            else if (event.key === "ArrowLeft") next = (active + (ar ? 1 : -1) + products.length) % products.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = products.length - 1;
            else return;
            event.preventDefault();
            setActive(next);
            tabs.current[next]?.focus({preventScroll: true});
            tabs.current[next]?.scrollIntoView({block: "nearest", inline: "nearest"});
          }}>
          <span className={styles.tabIcon}><Icon size={18} aria-hidden="true"/></span><span>{product.title}</span>
        </button>;
      })}
    </div>
    {products.map((product, index) => <div key={product.title}
      className={styles.productPanel} role="tabpanel" tabIndex={0}
      id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`}
      hidden={active !== index}>
      <div className={styles.productStage}>
        <span className={styles.productGhostNumber} dir="ltr" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div className={styles.productImage}>
          {active === index && <Image src={product.image} alt={product.title} fill sizes="(max-width: 767px) 90vw, 46vw"/>}
        </div>
      </div>
      <div className={styles.productCopy}>
        <span className={styles.eyebrow}>{ar ? "من مجموعة فونتي" : "From the Fonte collection"}</span>
        <span className={styles.productNumber} dir="ltr" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {total}</span>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <Link href="/contact#contact-form" className={styles.textLink}>
          {ar ? "استفسر عن هذا المنتج" : "Enquire about this range"}<ArrowUpRight className="directional-icon" size={20} aria-hidden="true"/>
        </Link>
        <div className={styles.productControls}>
          <div className={styles.productDots} aria-hidden="true">{products.map((item, i) => <span key={item.title} data-active={i === index}/>)}</div>
          <div className={styles.productArrows}>
            <button type="button" onClick={() => step(-1)} aria-label={ar ? "الفئة السابقة" : "Previous category"}><ArrowLeft className="directional-icon" size={18} aria-hidden="true"/></button>
            <button type="button" onClick={() => step(1)} aria-label={ar ? "الفئة التالية" : "Next category"}><ArrowRight className="directional-icon" size={18} aria-hidden="true"/></button>
          </div>
        </div>
      </div>
    </div>)}
  </div>;
}
