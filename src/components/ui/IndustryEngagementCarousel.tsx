"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

import styles from "./IndustryEngagementCarousel.module.css";

export interface IndustryEngagementSlide {
  index: number;
  image: string;
  alt: string;
  label: string;
  caption: string;
}

interface IndustryEngagementCarouselProps {
  slides: IndustryEngagementSlide[];
  locale: string;
  regionLabel: string;
  previousLabel: string;
  nextLabel: string;
  pauseLabel: string;
  playLabel: string;
}

const AUTOPLAY_DURATION = 5.2;

export function IndustryEngagementCarousel({
  slides,
  locale,
  regionLabel,
  previousLabel,
  nextLabel,
  pauseLabel,
  playLabel,
}: IndustryEngagementCarouselProps) {
  const isAr = locale.toLowerCase().startsWith("ar");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const autoplayTweenRef = useRef<gsap.core.Tween | null>(null);
  const pointerStartRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const total = slides.length;
  const isPaused =
    isHovering || isManuallyPaused || prefersReducedMotion || total <= 1;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((current) => (current + 1) % total);
  }, [total]);

  const goPrevious = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((current) => (current - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);


  useLayoutEffect(() => {
    const root = rootRef.current;
    const progress = progressRef.current;

    if (!root || !progress || total === 0) {
      return;
    }

    autoplayTweenRef.current?.kill();

    const direction = isAr ? -1 : 1;
    const duration = prefersReducedMotion ? 0 : 0.78;

    const context = gsap.context(() => {
      cardsRef.current.forEach((card, cardIndex) => {
        if (!card) return;

        const circularOffset =
          (cardIndex - activeIndex + total) % total;

        const isActive = circularOffset === 0;
        const isNext = circularOffset === 1;
        const isFollowing = circularOffset === 2;

        let targetX = direction * 110;
        let targetY = 52;
        let targetScale = 0.82;
        let targetRotation = direction * 5;
        let targetOpacity = 0;
        let targetZIndex = 0;

        if (isActive) {
          targetX = 0;
          targetY = 0;
          targetScale = 1;
          targetRotation = 0;
          targetOpacity = 1;
          targetZIndex = 30;
        } else if (isNext) {
          targetX = direction * 32;
          targetY = 20;
          targetScale = 0.94;
          targetRotation = direction * 1.7;
          targetOpacity = 0.72;
          targetZIndex = 20;
        } else if (isFollowing) {
          targetX = direction * 61;
          targetY = 39;
          targetScale = 0.88;
          targetRotation = direction * 3.1;
          targetOpacity = 0.34;
          targetZIndex = 10;
        }

        gsap.set(card, {
          zIndex: targetZIndex,
          pointerEvents: isActive ? "auto" : "none",
        });

        gsap.to(card, {
          x: targetX,
          y: targetY,
          scale: targetScale,
          rotation: targetRotation,
          opacity: targetOpacity,
          duration,
          ease: "power3.inOut",
          overwrite: "auto",
        });

        if (isActive && !prefersReducedMotion) {
          const image = card.querySelector("img");
          const revealItems = card.querySelectorAll(
            "[data-carousel-reveal]",
          );

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.09 },
              {
                scale: 1,
                duration: 1.35,
                ease: "power3.out",
              },
            );
          }

          gsap.fromTo(
            revealItems,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.62,
              stagger: 0.08,
              ease: "power3.out",
              delay: 0.14,
            },
          );
        }
      });

      gsap.set(progress, {
        scaleX: 0,
        transformOrigin: isAr ? "right center" : "left center",
      });

      if (!isPaused) {
        autoplayTweenRef.current = gsap.to(progress, {
          scaleX: 1,
          duration: AUTOPLAY_DURATION,
          ease: "none",
          onComplete: goNext,
        });
      }
    }, root);

    return () => {
      autoplayTweenRef.current?.kill();
      context.revert();
    };
  }, [
    activeIndex,
    goNext,
    isAr,
    isPaused,
    prefersReducedMotion,
    total,
  ]);

  if (total === 0) {
    return null;
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const pointerStart = pointerStartRef.current;
    pointerStartRef.current = null;

    if (pointerStart === null) return;

    const delta = event.clientX - pointerStart;

    if (Math.abs(delta) < 48) return;

    if (isAr) {
      if (delta > 0) goNext();
      else goPrevious();
    } else if (delta < 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (isAr) goPrevious();
      else goNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (isAr) goNext();
      else goPrevious();
    }
  };

  const PreviousIcon = isAr ? ArrowRight : ArrowLeft;
  const NextIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div
      ref={rootRef}
      className={styles.carousel}
      dir={isAr ? "rtl" : "ltr"}
      role="region"
      aria-roledescription="carousel"
      aria-label={regionLabel}
      tabIndex={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsHovering(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsHovering(false);
        }
      }}
      onKeyDown={handleKeyboard}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartRef.current = null;
      }}
    >
      <span className={styles.ambientGlow} aria-hidden="true" />
      <span className={styles.ambientGrid} aria-hidden="true" />

      <div className={styles.stage}>
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;

          return (
            <article
              key={`${slide.index}-${slide.image}`}
              ref={(element) => {
                cardsRef.current[slideIndex] = element;
              }}
              className={styles.card}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} / ${total}`}
            >
              <Image
                className={styles.image}
                src={slide.image}
                alt={isActive ? slide.alt : ""}
                fill
                sizes="(max-width: 991px) 90vw, 52vw"
                priority={slideIndex === 0}
                draggable={false}
              />

              <span className={styles.imageShade} aria-hidden="true" />
              <span className={styles.imageTexture} aria-hidden="true" />

              <div className={styles.cardTop} data-carousel-reveal>
                <span className={styles.slideLabel}>{slide.label}</span>
                <span className={styles.slideNumber}>
                  {String(slideIndex + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.cardBottom} data-carousel-reveal>
                <span className={styles.captionRule} aria-hidden="true" />
                <p>{slide.caption}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={goPrevious}
          aria-label={previousLabel}
          disabled={total <= 1}
        >
          <PreviousIcon size={19} strokeWidth={1.7} aria-hidden="true" />
        </button>

        <div className={styles.progressPanel}>
          <div className={styles.counter} aria-live="polite">
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span>/</span>
            <small>{String(total).padStart(2, "0")}</small>
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <span ref={progressRef} className={styles.progressFill} />
          </div>

          <div className={styles.dots}>
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.index}
                type="button"
                className={slideIndex === activeIndex ? styles.dotActive : styles.dot}
                onClick={() => setActiveIndex(slideIndex)}
                aria-label={`${slide.label}: ${slideIndex + 1} / ${total}`}
                aria-current={slideIndex === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.pauseButton}
          onClick={() => setIsManuallyPaused((current) => !current)}
          aria-label={isManuallyPaused ? playLabel : pauseLabel}
          aria-pressed={isManuallyPaused}
          disabled={prefersReducedMotion || total <= 1}
        >
          {isManuallyPaused ? (
            <Play size={16} strokeWidth={1.7} aria-hidden="true" />
          ) : (
            <Pause size={16} strokeWidth={1.7} aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          className={styles.arrowButton}
          onClick={goNext}
          aria-label={nextLabel}
          disabled={total <= 1}
        >
          <NextIcon size={19} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
