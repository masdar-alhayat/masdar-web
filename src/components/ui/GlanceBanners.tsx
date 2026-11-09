"use client";

import {useRef, useState} from "react";
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
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";
  const number = (index: number) => new Intl.NumberFormat(ar ? "ar-SA" : "en", {minimumIntegerDigits: 2}).format(index + 1);

  // On mobile the banners become a swipeable slider; keep the dots in step with the scroll position.
  const syncSlide = () => {
    const element = track.current;
    const first = element?.firstElementChild as HTMLElement | null;
    if (!element || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(element).columnGap || "0");
    setSlide(Math.min(items.length - 1, Math.round(Math.abs(element.scrollLeft) / step)));
  };
  const goTo = (index: number) => {
    (track.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
  };

  return <div className="glance-slider">
    <div ref={track} className="glance-banners" data-has-active={active !== null}
      onScroll={syncSlide}
      onMouseLeave={() => setActive(null)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
      }}>
      {items.map((item, index) => <article key={item.title} className="glance-banner" tabIndex={0}
        data-active={active === index}
        aria-label={`${number(index)} / ${number(items.length - 1)}`}
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
    </div>
    <div className="glance-dots">
      {items.map((item, index) => <button key={item.title} type="button" aria-current={slide === index}
        aria-label={ar ? `الانتقال إلى البطاقة ${number(index)}` : `Go to card ${index + 1}`}
        onClick={() => goTo(index)}/>)}
    </div>
  </div>;
}
