"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { Pause, Play } from "lucide-react";

import styles from "./IndustryCompetitionEngine.module.css";

export interface IndustryCompetitionPillar {
  index: number;
  title: string;
  description: string;
}

export interface IndustryCompetitionFactor {
  index: number;
  text: string;
}

interface IndustryCompetitionEngineProps {
  locale: string;
  regionLabel: string;
  eyebrow: string;
  coreLabel: string;
  coreTitle: string;
  dimensionsLabel: string;
  pauseLabel: string;
  playLabel: string;
  pillars: IndustryCompetitionPillar[];
  factors: IndustryCompetitionFactor[];
}

const AUTOPLAY_SECONDS = 4.2;

export function IndustryCompetitionEngine({
  locale,
  regionLabel,
  eyebrow,
  coreLabel,
  coreTitle,
  dimensionsLabel,
  pauseLabel,
  playLabel,
  pillars,
  factors,
}: IndustryCompetitionEngineProps) {
  const isAr = locale.toLowerCase().startsWith("ar");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef<HTMLSpanElement | null>(null);
  const reverseOrbitRef = useRef<HTMLSpanElement | null>(null);
  const scanRef = useRef<HTMLSpanElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<gsap.core.Tween | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const totalPillars = pillars.length;
  const activePillar = pillars[activeIndex] ?? pillars[0];

  const selectPillar = useCallback(
    (nextIndex: number) => {
      if (!totalPillars) return;
      setActiveIndex(
        ((nextIndex % totalPillars) + totalPillars) % totalPillars,
      );
    },
    [totalPillars],
  );

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

    if (!root) return;

    const context = gsap.context(() => {
      const revealTargets = root.querySelectorAll("[data-competition-reveal]");

      gsap.fromTo(
        revealTargets,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0 : 0.78,
          stagger: prefersReducedMotion ? 0 : 0.08,
          ease: "power3.out",
        },
      );

      if (!prefersReducedMotion) {
        if (orbitRef.current) {
          gsap.to(orbitRef.current, {
            rotation: isAr ? -360 : 360,
            duration: 34,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
          });
        }

        if (reverseOrbitRef.current) {
          gsap.to(reverseOrbitRef.current, {
            rotation: isAr ? 360 : -360,
            duration: 22,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
          });
        }

        if (scanRef.current) {
          gsap.fromTo(
            scanRef.current,
            { rotation: isAr ? 24 : -24, opacity: 0.2 },
            {
              rotation: isAr ? -24 : 24,
              opacity: 0.62,
              duration: 3.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              transformOrigin: "50% 100%",
            },
          );
        }
      }
    }, root);

    return () => context.revert();
  }, [isAr, prefersReducedMotion]);

  useLayoutEffect(() => {
    const detail = detailRef.current;

    if (!detail || !activePillar) return;

    const context = gsap.context(() => {
      const revealTargets = detail.querySelectorAll("[data-detail-reveal]");

      gsap.fromTo(
        revealTargets,
        { y: prefersReducedMotion ? 0 : 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0 : 0.52,
          stagger: prefersReducedMotion ? 0 : 0.06,
          ease: "power3.out",
        },
      );

      const activeNode = rootRef.current?.querySelector(
        `[data-pillar-index="${activeIndex}"]`,
      );

      if (activeNode && !prefersReducedMotion) {
        gsap.fromTo(
          activeNode,
          { scale: 0.94 },
          {
            scale: 1,
            duration: 0.58,
            ease: "back.out(1.8)",
          },
        );
      }
    }, detail);

    return () => context.revert();
  }, [activeIndex, activePillar, prefersReducedMotion]);

  useEffect(() => {
    autoplayRef.current?.kill();

    if (
      isPaused ||
      prefersReducedMotion ||
      totalPillars <= 1
    ) {
      return;
    }

    autoplayRef.current = gsap.delayedCall(AUTOPLAY_SECONDS, () => {
      selectPillar(activeIndex + 1);
    });

    return () => {
      autoplayRef.current?.kill();
    };
  }, [activeIndex, isPaused, prefersReducedMotion, selectPillar, totalPillars]);

  if (!activePillar || totalPillars === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={styles.engine}
      role="region"
      aria-label={regionLabel}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className={styles.topbar} data-competition-reveal>
        <div>
          <span className={styles.liveDot} aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>

        <button
          type="button"
          className={styles.pauseButton}
          onClick={() => setIsPaused((current) => !current)}
          aria-label={isPaused ? playLabel : pauseLabel}
          title={isPaused ? playLabel : pauseLabel}
        >
          {isPaused ? (
            <Play size={15} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Pause size={15} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className={styles.stage} data-competition-reveal>
        <span className={styles.grid} aria-hidden="true" />
        <span className={styles.axisHorizontal} aria-hidden="true" />
        <span className={styles.axisVertical} aria-hidden="true" />
        <span className={styles.ringOuter} aria-hidden="true" />
        <span className={styles.ringMiddle} aria-hidden="true" />
        <span className={styles.ringInner} aria-hidden="true" />
        <span ref={orbitRef} className={styles.orbitArc} aria-hidden="true" />
        <span
          ref={reverseOrbitRef}
          className={styles.orbitArcReverse}
          aria-hidden="true"
        />
        <span ref={scanRef} className={styles.scan} aria-hidden="true" />

        <div className={styles.core}>
          <small>{coreLabel}</small>
          <strong>{coreTitle}</strong>
          <span aria-hidden="true" />
        </div>

        {pillars.slice(0, 3).map((pillar, pillarIndex) => {
          const isActive = pillarIndex === activeIndex;

          return (
            <button
              key={pillar.index}
              type="button"
              className={`${styles.pillar} ${styles[`pillar${pillarIndex + 1}`]} ${
                isActive ? styles.pillarActive : ""
              }`}
              data-pillar-index={pillarIndex}
              onClick={() => selectPillar(pillarIndex)}
              onMouseEnter={() => selectPillar(pillarIndex)}
              aria-pressed={isActive}
            >
              <span>{String(pillarIndex + 1).padStart(2, "0")}</span>
              <strong>{pillar.title}</strong>
              <i aria-hidden="true" />
            </button>
          );
        })}

        {factors.slice(0, 8).map((factor, factorIndex) => (
          <span
            key={factor.index}
            className={`${styles.factorPoint} ${styles[`factorPoint${factorIndex + 1}`]}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div ref={detailRef} className={styles.detail} aria-live="polite">
        <span data-detail-reveal>
          {String(activeIndex + 1).padStart(2, "0")}
        </span>

        <div>
          <strong data-detail-reveal>{activePillar.title}</strong>
          <p data-detail-reveal>{activePillar.description}</p>
        </div>
      </div>

      {factors.length > 0 && (
        <div className={styles.dimensions} data-competition-reveal>
          <small>{dimensionsLabel}</small>

          <div>
            {factors.slice(0, 8).map((factor) => (
              <span key={factor.index}>{factor.text}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
