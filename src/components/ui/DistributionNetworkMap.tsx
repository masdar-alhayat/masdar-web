"use client";

import {useId, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import type {Locale} from "@/types/content";
import styles from "./DistributionNetworkMap.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Pin tips and route control points use the supplied reference's 977 x 757
// coordinate space. Keep this geography unchanged in the Arabic layout.
const locations = [
  {id: "riyadh", x: 565, y: 393, kind: "hub", en: "Riyadh", ar: "الرياض", dx: 0, dy: 20},
  {id: "al-qassim", x: 451, y: 233, kind: "major", en: "Al Qassim", ar: "القصيم", dx: 18, dy: -2},
  {id: "dammam", x: 697, y: 290, kind: "major", en: "Dammam", ar: "الدمام", dx: 0, dy: 20},
  {id: "jeddah", x: 252, y: 510, kind: "major", en: "Jeddah", ar: "جدة", dx: -14, dy: 16},
  {id: "abha", x: 384, y: 672, kind: "major", en: "Abha", ar: "أبها", dx: 0, dy: 20},
  {id: "sakakah", x: 293, y: 144, kind: "minor", en: "Sakakah", ar: "سكاكا", dx: 0, dy: 17},
  {id: "hail", x: 352, y: 254, kind: "minor", en: "Ha’il", ar: "حائل", dx: 0, dy: 17},
  {id: "buraydah", x: 445, y: 303, kind: "minor", en: "Buraydah", ar: "بريدة", dx: 0, dy: 19},
  {id: "madinah", x: 267, y: 390, kind: "minor", en: "Madinah", ar: "المدينة المنورة", dx: 0, dy: 19},
  {id: "makkah", x: 278, y: 518, kind: "minor", en: "Makkah", ar: "مكة المكرمة", dx: 10, dy: 18},
  {id: "najran", x: 486, y: 684, kind: "minor", en: "Najran", ar: "نجران", dx: 0, dy: 19},
  {id: "jizan", x: 391, y: 729, kind: "minor", en: "Jizan", ar: "جازان", dx: 0, dy: 20},
  {id: "bahrain", x: 735, y: 332, kind: "minor", en: "Bahrain", ar: "البحرين", dx: 15, dy: 0},
] as const;

const routes = [
  {id: "riyadh-qassim", d: "M565 393C510 359 486 332 490 293C490 264 475 244 451 233", local: false},
  {id: "riyadh-dammam", d: "M565 393C666 368 623 286 697 290", local: false},
  {id: "riyadh-jeddah", d: "M565 393C465 391 387 423 333 476S278 510 252 510", local: false},
  {id: "riyadh-abha", d: "M565 393C477 438 474 466 473 512C471 599 448 672 384 672", local: false},
  {id: "qassim-sakakah", d: "M451 233Q365 166 293 144", local: true},
  {id: "qassim-hail", d: "M451 233Q387 232 352 254", local: true},
  {id: "qassim-buraydah", d: "M451 233Q476 274 445 303", local: true},
  {id: "jeddah-makkah", d: "M252 510Q265 534 278 518", local: true},
  {id: "makkah-madinah", d: "M278 518C292 466 317 406 300 384Q284 370 267 390", local: true},
  {id: "abha-najran", d: "M384 672Q445 696 486 684", local: true},
  {id: "abha-jizan", d: "M384 672Q418 704 391 729", local: true},
  {id: "dammam-bahrain", d: "M697 290Q721 297 735 332", local: true},
] as const;

export function DistributionNetworkMap({locale}: {locale: Locale}) {
  const ar = locale === "ar";
  const scope = useRef<HTMLElement>(null);
  const maskPrefix = `distribution-${useId().replace(/:/g, "")}`;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = scope.current;
      if (!root) return;
      const land = root.querySelector("[data-map-land]");
      const pins = root.querySelectorAll("[data-map-pin]");
      const reveals = root.querySelectorAll("[data-route-reveal]");

      gsap.set(land, {opacity: 0, y: 16});
      gsap.set(pins, {opacity: 0, scale: 0, svgOrigin: "0 0"});
      gsap.set(reveals, {strokeDashoffset: 1});

      gsap.timeline({
        scrollTrigger: {trigger: root.querySelector("svg"), start: "top 82%", once: true},
      })
        .to(land, {opacity: 1, y: 0, duration: 0.85, ease: "power2.out"})
        .to(pins, {opacity: 1, scale: 1, duration: 0.55, stagger: 0.065, ease: "back.out(1.6)"}, "-=0.12")
        .to(reveals, {strokeDashoffset: 0, duration: 1.2, stagger: 0.09, ease: "power1.inOut"}, "+=0.1");
    });
    return () => mm.revert();
  }, {scope});

  const label = locale === "ar"
    ? "خريطة شبكة التوزيع من الرياض عبر مناطق المملكة العربية السعودية والبحرين"
    : "Distribution network from Riyadh across Saudi Arabia and Bahrain";

  return <section ref={scope} className={styles.section} aria-label={label} data-distribution-map>
    <div className={`container-xxl ${styles.frame}`}>
      <header className={styles.header}>
        <h2>{ar ? <>شبكة توزيعنا<br/>في جميع أنحاء المملكة العربية السعودية</> : <>Our Distribution Network<br/>Across Saudi Arabia</>}</h2>
        <p>{ar ? "نصل إلى المستهلكين في جميع أنحاء المملكة عبر شبكة توزيع قوية ومتنامية." : "We reach consumers across the Kingdom through a strong and growing distribution network."}</p>
      </header>
      <svg className={styles.map} viewBox="30 0 930 780" role="img" aria-label={label}>
        <defs>
          {routes.map(route => <mask key={route.id} id={`${maskPrefix}-${route.id}`} maskUnits="userSpaceOnUse" x="30" y="0" width="930" height="780" style={{maskType: "luminance"}}>
            <path d={route.d} pathLength="1" fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="0" data-route-reveal/>
          </mask>)}
        </defs>

        <g data-map-land>
          <use href="/assets/images/saudi-distribution-map.svg#saudi-base"/>
        </g>

        <g fill="none" strokeLinecap="round">
          {routes.map(route => <path key={route.id} d={route.d} data-map-route={route.id}
            className={route.local ? styles.localRoute : styles.route}
            mask={`url(#${maskPrefix}-${route.id})`}/>)}
        </g>

        {locations.map(location => <g key={location.id} transform={`translate(${location.x} ${location.y})`} data-map-location={location.id}>
          <g data-map-pin>
            <g transform={`scale(${location.kind === "hub" ? 1.65 : location.kind === "minor" ? 0.5 : 1})`}
              className={location.kind === "minor" ? styles.minorPin : styles.pin}>
              <ellipse cx="0" cy="1" rx="9" ry="2.4" className={styles.shadow}/>
              <path d="M0 0C-7-10-21-26-21-38a21 21 0 1 1 42 0C21-26 7-10 0 0Z" strokeWidth="1.2"/>
              {location.kind === "hub"
                ? <path className={styles.factory} d="M-13-30v-9l8-4v5l8-4v5h3l1-15h5l1 22ZM-9-34h3m5 0h3m5 0h3"/>
                : <circle cx="0" cy="-38" r="9" className={styles.pinCenter}/>}
            </g>
            <text x={location.dx} y={location.dy} className={styles.locationLabel}
              textAnchor={location.dx > 0 ? (ar ? "end" : "start") : location.dx < 0 ? (ar ? "start" : "end") : "middle"}
              direction={ar ? "rtl" : "ltr"}>{ar ? location.ar : location.en}</text>
          </g>
        </g>)}
      </svg>
    </div>
  </section>;
}
