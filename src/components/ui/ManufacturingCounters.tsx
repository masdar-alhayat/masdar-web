"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import type {Locale} from "@/types/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ManufacturingCounterItem {
  value: number;
  label: string;
}

function formatCounter(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    useGrouping: false,
  }).format(value);
}

export function ManufacturingCounters({
  items,
  locale,
}: {
  items: ManufacturingCounterItem[];
  locale: Locale;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counters = gsap.utils.toArray<HTMLElement>("[data-manufacturing-count]", root);
    const cards = gsap.utils.toArray<HTMLElement>(".manufacturing-metrics__item", root);

    counters.forEach((counter) => {
      counter.textContent = formatCounter(0, locale);
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 84%",
        once: true,
      },
    });

    timeline.from(cards, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
    });

    counters.forEach((counter, index) => {
      const target = Number(counter.dataset.manufacturingCount ?? 0);
      const state = {value: 0};

      timeline.to(state, {
        value: target,
        duration: 1.45,
        ease: "power2.out",
        snap: {value: 1},
        onUpdate: () => {
          counter.textContent = formatCounter(Math.round(state.value), locale);
        },
      }, 0.12 + index * 0.08);
    });
  }, {scope});

  return <div
    ref={scope}
    className="manufacturing-home__metrics"
    aria-label={locale === "ar" ? "قوة مصدر الحياة بالأرقام" : "Masdar Al Hayat strength in numbers"}
  >
    <div className="manufacturing-metrics__grid">
      {items.map((item) => <div className="manufacturing-metrics__item" key={item.label}>
        <strong data-manufacturing-count={item.value}>{formatCounter(item.value, locale)}</strong>
        <span>{item.label}</span>
      </div>)}
    </div>
  </div>;
}
