"use client";

import Image from "next/image";
import {useRef, useState} from "react";
import {ArrowLeft, ArrowRight} from "lucide-react";

export interface ManufacturingCapabilityItem {
  title: string;
  description: string;
  image: string;
  objectPosition: string;
}

export function ManufacturingCapabilitiesFlow({
  kicker,
  heading,
  items,
  isRtl,
  variant = "manufacturing",
  intro,
}: {
  kicker: string;
  heading: string;
  items: ManufacturingCapabilityItem[];
  isRtl: boolean;
  variant?: "manufacturing" | "sectors";
  intro?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const settle = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const format = (value: number) => new Intl.NumberFormat(isRtl ? "ar" : "en", {minimumIntegerDigits: 2}).format(value);

  const cards = () => Array.from(stage.current?.querySelectorAll<HTMLElement>(".manufacturing-flow__card") ?? []);
  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    setActive(next);
    const card = cards()[next];
    const element = stage.current;
    if (!card || !element) return;
    // Scroll only the slider, never the page.
    const start = isRtl
      ? card.offsetLeft + card.offsetWidth - element.clientWidth
      : card.offsetLeft;
    element.scrollTo({left: start, behavior: "smooth"});
  };

  // Keep the active card in step with swipes, once scrolling has settled so a
  // smooth scroll in progress never pulls the slider back to a passing card.
  const syncActive = () => {
    const element = stage.current;
    if (!element) return;
    const box = element.getBoundingClientRect();
    const edge = isRtl ? box.right : box.left;
    let closest = 0;
    let distance = Infinity;
    cards().forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const gap = Math.abs((isRtl ? rect.right : rect.left) - edge);
      if (gap < distance) {
        distance = gap;
        closest = index;
      }
    });
    const atEnd = Math.abs(element.scrollLeft) + element.clientWidth >= element.scrollWidth - 4;
    setActive(atEnd && distance > 4 ? items.length - 1 : closest);
  };

  const Previous = isRtl ? ArrowRight : ArrowLeft;
  const Next = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      className={`mah-section manufacturing-flow content-section ${variant === "sectors" ? "content-section--heritage tamimi-sectors" : "content-section--industrial"}`}
    >
      <div className="container-xxl manufacturing-flow__container">
        {/* Slider buttons sit at the top end: right in English, left in Arabic. */}
        <div className="manufacturing-flow__top">
          <header className="manufacturing-flow__header">
            <span className="section-kicker">{kicker}</span>
            <h2>{heading}</h2>
            {intro && <p>{intro}</p>}
          </header>
          <div className="manufacturing-flow__buttons">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={isRtl ? "البطاقة السابقة" : "Previous card"}>
              <Previous size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === items.length - 1} aria-label={isRtl ? "البطاقة التالية" : "Next card"}>
              <Next size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={stage}
          className="manufacturing-flow__stage"
          aria-label={heading}
          aria-roledescription={isRtl ? "عرض شرائح" : "carousel"}
          role="region"
          tabIndex={0}
          onScroll={() => {
            window.clearTimeout(settle.current);
            settle.current = window.setTimeout(syncActive, 140);
          }}
          onKeyDown={event => {
            if (event.key === "ArrowRight") goTo(active + (isRtl ? -1 : 1));
            else if (event.key === "ArrowLeft") goTo(active + (isRtl ? 1 : -1));
            else return;
            event.preventDefault();
          }}
        >
          <div className="manufacturing-flow__track">
            {items.map((item, itemIndex) => (
              <article
                className={`manufacturing-flow__card${variant === "sectors" ? " tamimi-sector" : ""}${itemIndex === active ? " is-active" : ""}`}
                key={item.title}
                aria-label={`${format(itemIndex + 1)} / ${format(items.length)}`}
              >
                <figure className="manufacturing-flow__visual">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 991px) 100vw, 58vw"
                    style={{objectPosition: item.objectPosition}}
                  />
                  <span aria-hidden="true" />
                </figure>

                <div className="manufacturing-flow__copy">
                  <span className="manufacturing-flow__number">{format(itemIndex + 1)}</span>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="manufacturing-flow__controls">
          <div className="manufacturing-flow__progress" aria-hidden="true">
            <span>{format(active + 1)}</span>
            <div>
              <span style={{transform: `scaleX(${(active + 1) / items.length})`}} />
            </div>
            <span>{format(items.length)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
