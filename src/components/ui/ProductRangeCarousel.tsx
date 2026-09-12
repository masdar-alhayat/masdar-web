"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {ArrowLeft, ArrowRight, Boxes, ChefHat, PackageOpen, Soup, Sparkles, Wheat} from "lucide-react";
import type {Locale} from "@/types/content";

export interface ProductRangeItem {
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
}

const categoryIcons = [Wheat, PackageOpen, ChefHat, Sparkles, Soup, Boxes];

function visibleCards(width: number) {
  if (width < 768) return 1;
  if (width < 1100) return 2;
  return 3;
}

export function ProductRangeCarousel({items, locale}: {items: ProductRangeItem[]; locale: Locale}) {
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
    if ((directionalDelta < 0 && currentIndex === 0) || (directionalDelta > 0 && currentIndex === maxIndex)) delta *= .25;
    dragDeltaX.current = delta;
    setDragOffset(delta);
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const directionalDelta = dragDeltaX.current * (isRtl ? 1 : -1);
    const cardWidth = event.currentTarget.clientWidth / cardsPerView;
    const threshold = Math.min(90, Math.max(45, cardWidth * .18));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    resetDrag();
    if (directionalDelta > threshold) next();
    else if (directionalDelta < -threshold) previous();
  };

  return (
    <div
      className="product-range-slider"
      style={{"--product-range-visible": cardsPerView} as React.CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label={isRtl ? "مجموعة منتجات فونتي" : "Fonte product range"}
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
      <div className="product-range-slider__top">
        <div>
          <span>{isRtl ? "مجموعة المنتجات" : "Product range"}</span>
          <strong>{isRtl ? "حلول غذائية لمختلف الاحتياجات" : "Food solutions for different needs"}</strong>
        </div>
        <div className="product-range-slider__controls">
          <span aria-live="polite">{String(currentIndex + 1).padStart(2, "0")} / {String(maxIndex + 1).padStart(2, "0")}</span>
          <button type="button" onClick={previous} disabled={currentIndex === 0} aria-label={isRtl ? "المنتجات السابقة" : "Previous products"}>
            {isRtl ? <ArrowRight aria-hidden="true"/> : <ArrowLeft aria-hidden="true"/>}
          </button>
          <button type="button" onClick={next} disabled={currentIndex === maxIndex} aria-label={isRtl ? "المنتجات التالية" : "Next products"}>
            {isRtl ? <ArrowLeft aria-hidden="true"/> : <ArrowRight aria-hidden="true"/>}
          </button>
        </div>
      </div>

      <div className={`product-range-slider__viewport${isDragging ? " is-dragging" : ""}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={resetDrag}>
        <div className="product-range-slider__track" style={{transform: `translateX(calc(${(isRtl ? 1 : -1) * currentIndex * (100 / cardsPerView)}% + ${dragOffset}px))`}}>
          {items.map((item, index) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <article className={item.image ? "has-image" : undefined} key={item.title} aria-label={`${index + 1} / ${items.length}`}>
                {item.image && (
                  <figure className="product-range-slider__image">
                    <Image
                      className="product-range-slider__image-backdrop"
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 34vw"
                      aria-hidden="true"
                      draggable={false}
                    />
                    <Image
                      className="product-range-slider__image-foreground"
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 34vw"
                      draggable={false}
                    />
                  </figure>
                )}
                <div className="product-range-slider__meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i><Icon aria-hidden="true"/></i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="product-range-slider__progress" aria-hidden="true">
        <span style={{width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%`}}/>
      </div>
    </div>
  );
}
