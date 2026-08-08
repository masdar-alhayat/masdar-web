"use client";

import {useEffect, useRef, type CSSProperties} from "react";

export function FocusConnector({
  label,
  areas,
}: {
  label: string;
  areas: string[];
}) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scope.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.motionActive = "true";
      return;
    }

    element.dataset.motionReady = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        element.dataset.motionActive = "true";
        observer.disconnect();
      },
      {
        threshold: .22,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scope} className="focus-connector">
      <strong className="focus-connector__heading">{label}</strong>

      <div
        className="focus-connector__track"
        style={{"--focus-count": areas.length} as CSSProperties}
      >
        <span className="focus-connector__line" aria-hidden="true" />

        {areas.map((area, areaIndex) => (
          <div
            className="focus-connector__item"
            key={area}
            style={
              {"--focus-delay": `${areaIndex * .14}s`} as CSSProperties
            }
          >
            <span className="focus-connector__dot" aria-hidden="true">
              <small>{String(areaIndex + 1).padStart(2, "0")}</small>
            </span>

            <span className="focus-connector__label">{area}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
