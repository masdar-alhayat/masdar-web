"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

import styles from "./CompetitiveFoundationsFlow.module.css";

export interface CompetitiveFoundationItem {
  index: number;
  title: string;
  description: string;
}

interface CompetitiveFoundationsFlowProps {
  locale: string;
  regionLabel: string;
  eyebrow: string;
  startLabel: string;
  endLabel: string;
  countLabel: string;
  items: CompetitiveFoundationItem[];
}

const AUTOPLAY_SECONDS = 3.8;

export function CompetitiveFoundationsFlow({
  locale,
  regionLabel,
  eyebrow,
  startLabel,
  endLabel,
  countLabel,
  items,
}: CompetitiveFoundationsFlowProps) {
  const isAr = locale.toLowerCase().startsWith("ar");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const signalRef = useRef<HTMLSpanElement | null>(null);
  const autoplayRef = useRef<gsap.core.Tween | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
      const revealTargets = root.querySelectorAll("[data-foundation-reveal]");
      const pathTargets = root.querySelectorAll("[data-foundation-path]");

      gsap.fromTo(
        revealTargets,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0 : 0.75,
          stagger: prefersReducedMotion ? 0 : 0.07,
          ease: "power3.out",
        },
      );

      if (!prefersReducedMotion) {
        gsap.to(pathTargets, {
          strokeDashoffset: isAr ? 180 : -180,
          duration: 8,
          repeat: -1,
          ease: "none",
        });
      }
    }, root);

    return () => context.revert();
  }, [isAr, prefersReducedMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const signal = signalRef.current;

    if (!root || !stage || !signal || items.length === 0) return;

    const positionSignal = () => {
      const marker = root.querySelector<HTMLElement>(
        `[data-foundation-marker="${activeIndex}"]`,
      );

      if (!marker) return;

      const stageRect = stage.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const y = markerRect.top - stageRect.top + markerRect.height / 2;

      gsap.to(signal, {
        y,
        duration: prefersReducedMotion ? 0 : 0.7,
        ease: "power3.inOut",
      });
    };

    positionSignal();
    window.addEventListener("resize", positionSignal);

    const activeNode = root.querySelector<HTMLElement>(
      `[data-foundation-node="${activeIndex}"]`,
    );

    if (activeNode && !prefersReducedMotion) {
      gsap.fromTo(
        activeNode,
        { x: isAr ? 10 : -10 },
        {
          x: 0,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    }

    return () => {
      window.removeEventListener("resize", positionSignal);
    };
  }, [activeIndex, isAr, items.length, prefersReducedMotion]);

  useEffect(() => {
    autoplayRef.current?.kill();

    if (
      prefersReducedMotion ||
      isInteracting ||
      items.length <= 1
    ) {
      return;
    }

    autoplayRef.current = gsap.delayedCall(AUTOPLAY_SECONDS, () => {
      setActiveIndex((current) => (current + 1) % items.length);
    });

    return () => {
      autoplayRef.current?.kill();
    };
  }, [activeIndex, isInteracting, items.length, prefersReducedMotion]);

  if (items.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={styles.system}
      role="region"
      aria-label={regionLabel}
      dir={isAr ? "rtl" : "ltr"}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsInteracting(false);
        }
      }}
    >
      <div className={styles.topline} data-foundation-reveal>
        <span className={styles.eyebrow}>
          <i aria-hidden="true" />
          {eyebrow}
        </span>

        <span className={styles.count}>
          <strong>{String(items.length).padStart(2, "0")}</strong>
          <small>{countLabel}</small>
        </span>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.helix} aria-hidden="true">
          <svg
            viewBox="0 0 120 720"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path
              className={styles.spine}
              d="M60 18 L60 702"
            />
            <path
              data-foundation-path
              className={`${styles.braid} ${styles.braidPrimary}`}
              d="M60 18 C12 76 108 132 60 190 C12 248 108 304 60 362 C12 420 108 476 60 534 C12 592 108 648 60 702"
            />
            <path
              data-foundation-path
              className={`${styles.braid} ${styles.braidSecondary}`}
              d="M60 18 C108 76 12 132 60 190 C108 248 12 304 60 362 C108 420 12 476 60 534 C108 592 12 648 60 702"
            />
          </svg>

          <span ref={signalRef} className={styles.signal} />
          <span className={`${styles.terminal} ${styles.terminalStart}`}>
            {startLabel}
          </span>
          <span className={`${styles.terminal} ${styles.terminalEnd}`}>
            {endLabel}
          </span>
        </div>

        <ol className={styles.sequence}>
          {items.map((item, itemPosition) => {
            const logicalPosition = itemPosition + (isAr ? 1 : 0);
            const side = logicalPosition % 2 === 0 ? "left" : "right";
            const isActive = itemPosition === activeIndex;

            return (
              <li
                key={item.index}
                className={`${styles.item} ${styles[`item${side === "left" ? "Left" : "Right"}`]}`}
                data-foundation-reveal
              >
                <button
                  type="button"
                  className={`${styles.itemButton} ${isActive ? styles.itemButtonActive : ""}`}
                  onClick={() => setActiveIndex(itemPosition)}
                  onMouseEnter={() => setActiveIndex(itemPosition)}
                  onFocus={() => setActiveIndex(itemPosition)}
                  aria-current={isActive ? "step" : undefined}
                  data-foundation-node={itemPosition}
                >
                  <span className={styles.itemNumber}>
                    {String(item.index).padStart(2, "0")}
                  </span>

                  <span className={styles.itemCopy}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </span>
                </button>

                <span
                  className={`${styles.marker} ${isActive ? styles.markerActive : ""}`}
                  data-foundation-marker={itemPosition}
                  aria-hidden="true"
                >
                  <i />
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
