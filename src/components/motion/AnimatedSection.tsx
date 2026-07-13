"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "rise" | "mask" | "stagger" | "line" | "scale" | "slide";
  id?: string;
}

export function AnimatedSection({children, className = "", variant = "rise", id}: AnimatedSectionProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = scope.current?.querySelectorAll<HTMLElement>("[data-animate]");
      if (!targets?.length) return;
      const presets = {
        rise: {y: 48, opacity: 0},
        mask: {clipPath: "inset(0 0 100% 0)", y: 24, opacity: 0},
        stagger: {y: 34, opacity: 0, scale: 0.985},
        line: {x: -36, opacity: 0},
        scale: {scale: 0.92, opacity: 0},
        slide: {xPercent: 8, opacity: 0}
      } as const;
      gsap.from(targets, {
        ...presets[variant],
        duration: 0.9,
        stagger: variant === "stagger" ? 0.12 : 0.08,
        ease: "power3.out",
        scrollTrigger: {trigger: scope.current, start: "top 82%", once: true}
      });
    });
    return () => mm.revert();
  }, {scope});

  return <section ref={scope} id={id} className={`mah-section ${className}`}>{children}</section>;
}
