"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Plus} from "lucide-react";
import type {Locale} from "@/types/content";

export interface GlanceBannerItem {
  value: string;
  title: string;
  description: string;
  // `logo` shows the image whole on a white card (e.g. the Tamimi Group logo) instead of as a full-bleed photo.
  image?: {src: string; alt: string; logo?: boolean};
}

// One Masdar Al Hayat brand colour per banner overlay, in item order.
const tints = ["var(--mah-green-900)", "var(--mah-copper)", "var(--mah-gold)", "var(--mah-green-700)", "var(--mah-charcoal-700)"];

export function GlanceBanners({items, locale}: {items: GlanceBannerItem[]; locale: Locale}) {
  const [active, setActive] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [perView, setPerView] = useState(1);
  const track = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";
  const number = (index: number) => new Intl.NumberFormat(ar ? "ar-SA" : "en", {minimumIntegerDigits: 2}).format(index + 1);
  // One dot per reachable slider position: 5 on phones (one card in view), 4 on tablets (two cards in view).
  const positions = Math.max(1, items.length - perView + 1);

  // On tablet and mobile the banners become a swipeable slider; keep the dots in step with the scroll position.
  const syncSlide = useCallback(() => {
    const element = track.current;
    const first = element?.firstElementChild as HTMLElement | null;
    if (!element || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(element).columnGap || "0");
    const visible = Math.max(1, Math.round(element.clientWidth / step));
    setPerView(visible);
    setSlide(Math.min(items.length - visible, Math.round(Math.abs(element.scrollLeft) / step)));
  }, [items.length]);
  const goTo = (index: number) => {
    const element = track.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (!element || !card) return;
    // Align the card with the slider's inline start (left in English, right in Arabic), respecting scroll padding.
    const start = parseFloat(getComputedStyle(element).scrollPaddingInlineStart || "0") || 0;
    const cardBox = card.getBoundingClientRect();
    const trackBox = element.getBoundingClientRect();
    const delta = ar ? cardBox.right - trackBox.right + start : cardBox.left - trackBox.left - start;
    element.scrollBy({left: delta, behavior: "smooth"});
  };

  useEffect(() => {
    syncSlide();
    window.addEventListener("resize", syncSlide);
    return () => window.removeEventListener("resize", syncSlide);
  }, [syncSlide]);

  return <div className="glance-slider">
    <div ref={track} className="glance-banners" data-has-active={active !== null}
      onScroll={syncSlide}
      onMouseLeave={() => setActive(null)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
      }}>
      {items.map((item, index) => <article key={item.title} className={`glance-banner${item.image?.logo ? " glance-banner--logo" : ""}`} tabIndex={0}
        data-active={active === index}
        aria-label={`${number(index)} / ${number(items.length - 1)}`}
        style={{"--glance-tint": tints[index % tints.length]} as React.CSSProperties}
        onMouseEnter={() => setActive(index)}
        onFocus={() => setActive(index)}
        onClick={() => setActive(index)}>
        {item.image && <Image src={item.image.src} alt={item.image.alt} fill sizes={item.image.logo ? "(max-width: 991px) 60vw, 24vw" : "(max-width: 991px) 100vw, 40vw"} className="glance-banner__image"/>}
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
      {items.slice(0, positions).map((item, index) => <button key={item.title} type="button" aria-current={slide === index}
        aria-label={ar ? `الانتقال إلى البطاقة ${number(index)}` : `Go to card ${index + 1}`}
        onClick={() => goTo(index)}/>)}
    </div>
  </div>;
}
