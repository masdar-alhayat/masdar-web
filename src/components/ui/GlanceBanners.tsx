"use client";

import {useState} from "react";
import Image from "next/image";
import {Plus} from "lucide-react";
import type {Locale} from "@/types/content";

export interface GlanceBannerItem {
  value: string;
  title: string;
  description: string;
  image?: {src: string; alt: string};
}

// One Masdar Al Hayat brand colour per banner overlay, in item order.
const tints = ["var(--mah-green-900)", "var(--mah-copper)", "var(--mah-gold)", "var(--mah-green-700)", "var(--mah-charcoal-700)"];

export function GlanceBanners({items, locale}: {items: GlanceBannerItem[]; locale: Locale}) {
  const [active, setActive] = useState<number | null>(null);
  const number = (index: number) => new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en", {minimumIntegerDigits: 2}).format(index + 1);

  return <div className="glance-banners" data-has-active={active !== null}
    onMouseLeave={() => setActive(null)}
    onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
    }}>
    {items.map((item, index) => <article key={item.title} className="glance-banner" tabIndex={0}
      data-active={active === index}
      style={{"--glance-tint": tints[index % tints.length]} as React.CSSProperties}
      onMouseEnter={() => setActive(index)}
      onFocus={() => setActive(index)}
      onClick={() => setActive(index)}>
      {item.image && <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 991px) 100vw, 40vw" className="glance-banner__image"/>}
      <span className="glance-banner__tint" aria-hidden="true"/>
      <div className="glance-banner__top">
        <span className="glance-banner__index">{number(index)}</span>
        <Plus className="glance-banner__plus" aria-hidden="true"/>
      </div>
      <div className="glance-banner__content">
        <h3>{item.value}</h3>
        <div className="glance-banner__body">
          <div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </div>
        </div>
      </div>
    </article>)}
  </div>;
}
