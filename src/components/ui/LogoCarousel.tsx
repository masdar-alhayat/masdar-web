"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {Pause, Play} from "lucide-react";
import type {Locale} from "@/types/content";

interface LogoItem {
  src: string;
  name: {en: string; ar: string};
}

export function LogoCarousel({items, locale, label}: {items: LogoItem[]; locale: Locale; label: string}) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const isAr = locale === "ar";
  const midpoint = Math.ceil(items.length / 2);
  const rows = [items.slice(0, midpoint), items.slice(midpoint)];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="logo-carousel" ref={root} data-running={visible && !paused} role="region" aria-label={label}>
    <div className="logo-carousel__toolbar">
      <span>{isAr ? "علاقات تقوم على الثقة والجودة" : "Relationships built on trust and quality"}</span>
      <button type="button" className="logo-carousel__toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? (isAr ? "تشغيل حركة الشعارات" : "Play logo animation") : (isAr ? "إيقاف حركة الشعارات مؤقتاً" : "Pause logo animation")}>
        {paused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}
        {paused ? (isAr ? "تشغيل" : "Play") : (isAr ? "إيقاف مؤقت" : "Pause")}
      </button>
    </div>
    {rows.map((row, rowIndex) => <div className="logo-carousel__viewport" key={rowIndex} dir="ltr" tabIndex={0} aria-label={isAr ? `صف الشعارات ${rowIndex + 1}` : `Logo row ${rowIndex + 1}`}>
      <div className={`logo-carousel__track${rowIndex === 1 ? " logo-carousel__track--reverse" : ""}`}>
        {[false, true].map(duplicate => <ul className="logo-carousel__group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
          {row.map(item => <li className="logo-carousel__card" key={item.src} dir={isAr ? "rtl" : "ltr"}>
            <div className="logo-carousel__image"><Image src={item.src} alt={duplicate ? "" : item.name[locale]} fill sizes="200px" unoptimized draggable={false}/></div>
            <span>{item.name[locale]}</span>
          </li>)}
        </ul>)}
      </div>
    </div>)}
  </div>;
}
