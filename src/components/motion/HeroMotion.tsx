"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function HeroMotion({children, className = ""}: {children: React.ReactNode; className?: string}) {
  const scope = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({defaults: {ease: "power3.out"}});
      tl.from("[data-hero-media]", {clipPath: "inset(0 0 100% 0)", scale: 1.08, duration: 1.35})
        .from("[data-hero-eyebrow]", {y: 20, opacity: 0, duration: 0.55}, "-=0.7")
        .from("[data-hero-title] > span", {yPercent: 110, opacity: 0, stagger: 0.12, duration: 0.9}, "-=0.35")
        .from("[data-hero-copy], [data-hero-actions]", {y: 24, opacity: 0, stagger: 0.1, duration: 0.65}, "-=0.45")
        .from("[data-hero-mark]", {scale: 0.7, rotate: -8, opacity: 0, duration: 0.9}, "-=0.75");
    });
    return () => mm.revert();
  }, {scope});
  return <section ref={scope} className={className}>{children}</section>;
}
