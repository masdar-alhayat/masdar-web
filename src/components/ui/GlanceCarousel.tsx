"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {ArrowLeft, ArrowRight} from "lucide-react";
import type {Locale} from "@/types/content";

export interface GlanceCarouselItem {
  value: string;
  title: string;
  description: string;
  image?: {src: string; alt: string; kind?: "logo" | "photo" | "product"};
}

function visibleCards(width: number) {
  if (width < 768) return 1;
  if (width < 1200) return 2;
  return 3;
}

export function GlanceCarousel({items, locale}: {items: GlanceCarouselItem[]; locale: Locale}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);
  const isRtl = locale === "ar";
  const maxIndex = Math.max(0, items.length - cardsPerView);
  const currentIndex = Math.min(activeIndex, maxIndex);

  useEffect(() => {
    const update = () => setCardsPerView(visibleCards(window.innerWidth));
    update();
    window.addEventListener("resize", update, {passive: true});
    return () => window.removeEventListener("resize", update);
  }, []);

  const previous = () => setActiveIndex(Math.max(0, currentIndex - 1));
  const next = () => setActiveIndex(Math.min(maxIndex, currentIndex + 1));
  const resetDrag = () => {
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStartX.current = event.clientX;
    dragDeltaX.current = 0;
    setDragOffset(0);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    let delta = event.clientX - dragStartX.current;
    const directionalDelta = delta * (isRtl ? 1 : -1);
    if ((directionalDelta < 0 && currentIndex === 0) || (directionalDelta > 0 && currentIndex === maxIndex)) {
      delta *= .25;
    }
    dragDeltaX.current = delta;
    setDragOffset(delta);
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const directionalDelta = dragDeltaX.current * (isRtl ? 1 : -1);
    const cardWidth = event.currentTarget.clientWidth / cardsPerView;
    const threshold = Math.min(90, Math.max(45, cardWidth * .18));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetDrag();
    if (directionalDelta > threshold) next();
    else if (directionalDelta < -threshold) previous();
  };

  return (
    <div
      className="glance-carousel"
      style={{"--glance-visible": cardsPerView} as React.CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label={isRtl ? "مصدر الحياة في لمحة" : "Masdar Al Hayat at a glance"}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          if (isRtl) next();
          else previous();
        }
        if (event.key === "ArrowRight") {
          if (isRtl) previous();
          else next();
        }
      }}
    >
      <div className="glance-carousel__top">
        <span className="glance-carousel__count" aria-live="polite">
          {String(currentIndex + 1).padStart(2, "0")} / {String(maxIndex + 1).padStart(2, "0")}
        </span>
        <div className="glance-carousel__controls">
          <button type="button" onClick={previous} disabled={currentIndex === 0} aria-label={isRtl ? "العناصر السابقة" : "Previous items"}>
            {isRtl ? <ArrowRight aria-hidden="true"/> : <ArrowLeft aria-hidden="true"/>}
          </button>
          <button type="button" onClick={next} disabled={currentIndex === maxIndex} aria-label={isRtl ? "العناصر التالية" : "Next items"}>
            {isRtl ? <ArrowLeft aria-hidden="true"/> : <ArrowRight aria-hidden="true"/>}
          </button>
        </div>
      </div>

      <div
        className={`glance-carousel__viewport${isDragging ? " is-dragging" : ""}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={resetDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className="glance-carousel__track"
          style={{transform: `translateX(calc(${(isRtl ? 1 : -1) * currentIndex * (100 / cardsPerView)}% + ${dragOffset}px))`}}
        >
          {items.map((item, index) => (
            <article key={item.title} aria-label={`${index + 1} / ${items.length}`}>
              <span className="glance-carousel__value">{item.value}</span>
              {item.image && (
                <div className={`glance-carousel__image${item.image.kind ? ` glance-carousel__image--${item.image.kind}` : ""}`}>
                  <Image src={item.image.src} alt={item.image.alt} width={1536} height={1024} sizes="(max-width: 767px) 85vw, (max-width: 1199px) 42vw, 28vw" draggable={false}/>
                </div>
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="glance-carousel__line" aria-hidden="true"/>
            </article>
          ))}
        </div>
      </div>

      <div className="glance-carousel__progress" aria-hidden="true">
        <span style={{width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%`}}/>
      </div>
    </div>
  );
}
