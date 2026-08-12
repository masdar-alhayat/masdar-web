"use client";

import Image from "next/image";
import {useCallback, useRef, useState} from "react";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import styles from "./ManufacturingGallery.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const galleryImages = [
  "/assets/images/masdar-enhanced/masdar_al_hayat_28.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_29.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_30.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_31.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_32.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_34.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_35.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_36.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_37.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_38.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_39.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat_40.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat-45.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat-46.png",
  "/assets/images/masdar-enhanced/masdar_al_hayat-47.png",
];

export function ManufacturingGallery({isRtl}: {isRtl: boolean}) {
  const scope = useRef<HTMLElement>(null);
  const cards = useRef<Array<HTMLElement | null>>([]);
  const progress = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % galleryImages.length);
  }, []);

  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const header = section.querySelector<HTMLElement>(`.${styles.header}`);
      const stage = section.querySelector<HTMLElement>(`.${styles.stage}`);
      const pagination = section.querySelector<HTMLElement>(`.${styles.pagination}`);

      if (!header || !stage || !pagination) return;

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        intro
          .from(header.children, {
            y: 26,
            opacity: 0,
            duration: .72,
            stagger: .1,
            ease: "power3.out",
          })
          .from(
            stage,
            {
              y: 36,
              opacity: 0,
              scale: .985,
              duration: .9,
              ease: "power3.out",
            },
            "-=.42",
          )
          .from(
            pagination,
            {opacity: 0, duration: .5, ease: "power2.out"},
            "-=.3",
          );

        return () => intro.kill();
      });

      return () => mediaQuery.revert();
    },
    {scope},
  );

  useGSAP(
    () => {
      const direction = isRtl ? -1 : 1;
      const total = galleryImages.length;

      cards.current.forEach((card, cardIndex) => {
        if (!card) return;

        const relativeIndex = (cardIndex - activeIndex + total) % total;
        const image = card.querySelector("img");
        const isActive = relativeIndex === 0;
        const isNext = relativeIndex === 1;
        const isPrevious = relativeIndex === total - 1;

        let xPercent = direction * 112;
        let opacity = 0;
        let scale = .9;
        let zIndex = 0;

        if (isActive) {
          xPercent = 0;
          opacity = 1;
          scale = 1;
          zIndex = 3;
        } else if (isNext) {
          xPercent = direction * 87;
          opacity = .72;
          scale = .94;
          zIndex = 2;
        } else if (isPrevious) {
          xPercent = direction * -24;
          opacity = 0;
          scale = .96;
          zIndex = 1;
        }

        card.dataset.active = String(isActive);

        gsap.to(card, {
          xPercent,
          opacity,
          scale,
          zIndex,
          duration: .9,
          ease: "power3.inOut",
          overwrite: true,
        });

        if (image) {
          gsap.to(image, {
            scale: isActive ? 1 : 1.055,
            duration: 1.05,
            ease: "power3.out",
            overwrite: true,
          });
        }
      });

      if (progress.current) {
        gsap.to(progress.current, {
          scaleX: (activeIndex + 1) / galleryImages.length,
          transformOrigin: isRtl ? "right center" : "left center",
          duration: .65,
          ease: "power3.out",
        });
      }
    },
    {scope, dependencies: [activeIndex, isRtl]},
  );

  const PreviousIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const currentNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(galleryImages.length).padStart(2, "0");

  return (
    <section ref={scope} className={styles.section}>
      <div className={`container-xxl ${styles.container}`}>
        <header className={styles.header}>
          <div>
            <span className="section-kicker">
              {isRtl ? "داخل التصنيع" : "Inside Manufacturing"}
            </span>
            <h2>
              {isRtl
                ? "لمحة من داخل عملياتنا التصنيعية"
                : "A Glimpse Into Our Manufacturing"}
            </h2>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label={isRtl ? "الصورة السابقة" : "Previous image"}
            >
              <PreviousIcon aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label={isRtl ? "الصورة التالية" : "Next image"}
            >
              <NextIcon aria-hidden="true" />
            </button>
          </div>
        </header>

        <div
          className={styles.stage}
          dir={isRtl ? "rtl" : "ltr"}
          role="region"
          aria-roledescription="carousel"
          aria-label={isRtl ? "معرض التصنيع" : "Manufacturing gallery"}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              if (isRtl) {
                goToNext();
              } else {
                goToPrevious();
              }
            }

            if (event.key === "ArrowRight") {
              if (isRtl) {
                goToPrevious();
              } else {
                goToNext();
              }
            }
          }}
        >
          {galleryImages.map((src, imageIndex) => (
            <figure
              ref={(node) => {
                cards.current[imageIndex] = node;
              }}
              className={styles.card}
              key={src}
              aria-hidden={imageIndex !== activeIndex}
            >
              <Image
                src={src}
                alt={
                  isRtl
                    ? `مشهد من عمليات التصنيع ${imageIndex + 1}`
                    : `Manufacturing operations view ${imageIndex + 1}`
                }
                fill
                sizes="(max-width: 767px) 86vw, 76vw"
              />
              <span className={styles.veil} aria-hidden="true" />
              <figcaption>
                <span>{isRtl ? "من داخل المصنع" : "Inside the factory"}</span>
                <strong>{String(imageIndex + 1).padStart(2, "0")}</strong>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.pagination} aria-hidden="true">
          <span>{currentNumber}</span>
          <div>
            <span ref={progress} />
          </div>
          <span>{totalNumber}</span>
        </div>

        <div className={styles.dots} role="group" aria-label={isRtl ? "اختيار الصورة" : "Choose image"}>
          {galleryImages.map((src, imageIndex) => (
            <button
              type="button"
              key={src}
              className={imageIndex === activeIndex ? styles.activeDot : undefined}
              onClick={() => setActiveIndex(imageIndex)}
              aria-label={
                isRtl
                  ? `عرض الصورة ${imageIndex + 1}`
                  : `Show image ${imageIndex + 1}`
              }
              aria-current={imageIndex === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
