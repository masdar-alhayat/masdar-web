"use client";

import Image from "next/image";
import {useCallback, useRef, useState} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import styles from "./ManufacturingVideoInterlude.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const manufacturingVideos = [
  "/assets/videos/masdar-video-3.mov",
  "/assets/videos/masdar-video-4.mov",
  "/assets/videos/masdar-video-5.mov",
  "/assets/videos/masdar-video-10.mov",
  "/assets/videos/masdar-video-11.mov",
  "/assets/videos/masdar-video-6.mov",
  "/assets/videos/masdar-video-7.mov",
  "/assets/videos/masdar-video-8.mov",
  "/assets/videos/masdar-video-9.mov",
];

export function ManufacturingVideoInterlude({label}: {label: string}) {
  const scope = useRef<HTMLElement>(null);
  const frame = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const playNextVideo = useCallback(() => {
    setActiveVideoIndex(
      (currentIndex) => (currentIndex + 1) % manufacturingVideos.length,
    );
  }, []);

  useGSAP(
    () => {
      const section = scope.current;
      const frameElement = frame.current;
      const mediaElement = media.current;

      if (!section || !frameElement || !mediaElement) return;

      void video.current?.play().catch(() => undefined);

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const reveal = gsap.fromTo(
            frameElement,
            {y: 44, scale: .975, opacity: .72},
            {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                end: "top 48%",
                scrub: .6,
              },
            },
          );

          const parallax = gsap.fromTo(
            mediaElement,
            {yPercent: -5, scale: 1.075},
            {
              yPercent: 5,
              scale: 1.025,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: .8,
                invalidateOnRefresh: true,
              },
            },
          );

          return () => {
            reveal.kill();
            parallax.kill();
            gsap.set([frameElement, mediaElement], {clearProps: "all"});
          };
        },
      );

      mediaQuery.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const reveal = gsap.from(frameElement, {
            y: 28,
            opacity: 0,
            duration: .8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: frameElement,
              start: "top 88%",
              once: true,
            },
          });

          const parallax = gsap.fromTo(
            mediaElement,
            {yPercent: -2.5, scale: 1.045},
            {
              yPercent: 2.5,
              scale: 1.015,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: .7,
              },
            },
          );

          return () => {
            reveal.kill();
            parallax.kill();
            gsap.set([frameElement, mediaElement], {clearProps: "all"});
          };
        },
      );

      return () => mediaQuery.revert();
    },
    {scope},
  );

  return (
    <section ref={scope} className={styles.section} aria-label={label}>
      <div className={`container-xxl ${styles.container}`}>
        <figure ref={frame} className={styles.frame}>
          <div ref={media} className={styles.media}>
            <video
              key={manufacturingVideos[activeVideoIndex]}
              ref={video}
              className={styles.video}
              src={manufacturingVideos[activeVideoIndex]}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={playNextVideo}
              onLoadedData={(event) => {
                void event.currentTarget.play().catch(() => undefined);
              }}
              data-sequence-index={activeVideoIndex}
              aria-hidden="true"
            />
          </div>

          <span className={styles.veil} aria-hidden="true" />
          <span className={styles.inset} aria-hidden="true" />
          <span className={styles.accent} aria-hidden="true" />

          <div className={styles.brandBadge} aria-label="Fonte">
            <Image
              src="/brand/fonte-transparent-logo.png"
              alt="Fonte"
              width={198}
              height={80}
              sizes="(max-width: 767px) 112px, 198px"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
