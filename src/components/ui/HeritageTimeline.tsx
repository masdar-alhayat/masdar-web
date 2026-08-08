"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import styles from "./HeritageTimeline.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HeritageTimelineMilestone {
  year: string;
  title: string;
  description: string;
}

interface HeritageTimelineProps {
  kicker: string;
  heading: string;
  introduction: string;
  milestones: HeritageTimelineMilestone[];
}

export function HeritageTimeline({
  kicker,
  heading,
  introduction,
  milestones,
}: HeritageTimelineProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = scope.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const header = section.querySelector<HTMLElement>("[data-timeline-header]");
      const timeline = section.querySelector<HTMLElement>("[data-timeline]");
      const progress = section.querySelector<HTMLElement>("[data-timeline-progress]");
      const entries = gsap.utils.toArray<HTMLElement>("[data-timeline-entry]", section);
      const isRtl = getComputedStyle(section).direction === "rtl";

      if (header) {
        gsap.from(header.children, {
          y: 36,
          opacity: 0,
          duration: .85,
          stagger: .1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 84%",
            once: true,
          },
        });
      }

      entries.forEach((entry, index) => {
        const tile = entry.querySelector<HTMLElement>("[data-timeline-tile]");
        const marker = entry.querySelector<HTMLElement>("[data-timeline-marker]");
        const logicalDirection = index % 2 === 0 ? -1 : 1;
        const x = (isRtl ? -logicalDirection : logicalDirection) * 64;

        if (tile) {
          gsap.fromTo(
            tile,
            {x, y: 24, autoAlpha: 0},
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: .85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: entry,
                start: "top 82%",
                once: true,
              },
            },
          );
        }

        if (marker) {
          gsap.fromTo(
            marker,
            {scale: 0},
            {
              scale: 1,
              duration: .45,
              ease: "back.out(1.8)",
              scrollTrigger: {
                trigger: entry,
                start: "top 80%",
                once: true,
              },
            },
          );
        }
      });

      if (timeline && progress) {
        gsap.fromTo(
          progress,
          {scaleY: 0},
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 66%",
              end: "bottom 44%",
              scrub: .45,
            },
          },
        );
      }
    });

    return () => media.revert();
  }, {scope});

  return (
    <section ref={scope} className={`mah-section ${styles.section}`}>
      <div className={`container-xxl ${styles.container}`}>
        <header className={styles.header} data-timeline-header>
          <div>
            {kicker && <span className="section-kicker">{kicker}</span>}
            <h2>{heading}</h2>
          </div>
          {introduction && <p>{introduction}</p>}
        </header>

        <div className={styles.timeline} data-timeline>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.progress} data-timeline-progress />
          </span>

          {milestones.map((milestone, index) => {
            const side = index % 2 === 0 ? "start" : "end";
            const isFeatured = milestone.year === "2009";

            return (
              <div
                key={`${milestone.year}-${milestone.title}`}
                className={styles.entry}
                data-side={side}
                data-timeline-entry
              >
                <article
                  className={`${styles.tile} ${isFeatured ? styles.featured : ""}`}
                  data-timeline-tile
                >
                  <div className={styles.tileMeta}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <time dateTime={milestone.year}>{milestone.year}</time>
                  </div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </article>

                <span className={styles.marker} data-timeline-marker aria-hidden="true">
                  <span />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
