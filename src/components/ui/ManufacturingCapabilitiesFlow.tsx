"use client";

import Image from "next/image";
import {useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
}: {
  kicker: string;
  heading: string;
  items: ManufacturingCapabilityItem[];
  isRtl: boolean;
}) {
  const scope = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      const stageElement = stage.current;
      const trackElement = track.current;
      const progressElement = progress.current;
      const header = section?.querySelector<HTMLElement>(
        ".manufacturing-flow__header",
      );
      const cards = section
        ? gsap.utils.toArray<HTMLElement>(
            ".manufacturing-flow__card",
            section,
          )
        : [];

      if (
        !section ||
        !stageElement ||
        !trackElement ||
        !progressElement ||
        !header ||
        !cards.length
      ) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
        () => {
          section.classList.add("is-enhanced");
          cards[0]?.classList.add("is-active");

          gsap.set(progressElement, {
            scaleX: 0,
            transformOrigin: isRtl ? "right center" : "left center",
          });

          gsap.from(header.children, {
            y: 34,
            opacity: 0,
            duration: .8,
            stagger: .1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          });

          const travelDistance = () =>
            Math.max(0, trackElement.scrollWidth - stageElement.clientWidth);

          const movement = gsap.fromTo(
            trackElement,
            {x: () => (isRtl ? -travelDistance() : 0)},
            {
              x: () => (isRtl ? 0 : -travelDistance()),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${travelDistance() + window.innerHeight * .9}`,
                pin: true,
                scrub: .75,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                snap: items.length > 1
                  ? {
                      snapTo: 1 / (items.length - 1),
                      duration: {min: .18, max: .42},
                      delay: .04,
                      ease: "power1.inOut",
                    }
                  : undefined,
                onUpdate: (self) => {
                  gsap.set(progressElement, {scaleX: self.progress});

                  const activeIndex = Math.min(
                    cards.length - 1,
                    Math.round(self.progress * (cards.length - 1)),
                  );

                  cards.forEach((card, cardIndex) => {
                    card.classList.toggle("is-active", cardIndex === activeIndex);
                  });
                },
              },
            },
          );

          return () => {
            movement.kill();
            section.classList.remove("is-enhanced");
            cards.forEach((card) => card.classList.remove("is-active"));
            gsap.set([trackElement, progressElement], {clearProps: "all"});
          };
        },
      );

      mm.add(
        "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
        () => {
          const reveals = cards.map((card) =>
            gsap.from(card, {
              y: 60,
              opacity: 0,
              scale: .975,
              duration: .85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            }),
          );

          return () => reveals.forEach((reveal) => reveal.kill());
        },
      );

      return () => mm.revert();
    },
    {scope, dependencies: [isRtl, items.length]},
  );

  return (
    <section
      ref={scope}
      className="mah-section manufacturing-flow content-section content-section--industrial"
    >
      <div className="container-xxl manufacturing-flow__container">
        <header className="manufacturing-flow__header">
          <span className="section-kicker">{kicker}</span>
          <h2>{heading}</h2>
        </header>

        <div
          ref={stage}
          className="manufacturing-flow__stage"
          aria-label={heading}
        >
          <div ref={track} className="manufacturing-flow__track">
            {items.map((item, itemIndex) => (
              <article className="manufacturing-flow__card" key={item.title}>
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
                  <span className="manufacturing-flow__number">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="manufacturing-flow__progress" aria-hidden="true">
          <span>01</span>
          <div>
            <span ref={progress} />
          </div>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
