import type { Locale } from "@/types/content";
import styles from "./ContactLocationMap.module.css";

interface ContactLocationMapProps {
  locale: Locale;
  regionLabel: string;
  title: string;
  locationName: string;
  address: string;
  description: string;
  mapSrc: string;
  directionsHref: string;
  directionsLabel: string;
  badgeLabel: string;
  badgeValue: string;
}

export function ContactLocationMap({
  locale,
  regionLabel,
  title,
  locationName,
  address,
  description,
  mapSrc,
  directionsHref,
  directionsLabel,
  badgeLabel,
  badgeValue,
}: ContactLocationMapProps) {
  const isAr = String(locale).toLowerCase().startsWith("ar");

  return (
    <section
      className={styles.mapShell}
      dir={isAr ? "rtl" : "ltr"}
      aria-label={regionLabel || title || locationName}
    >
      <div className={styles.mapFrame}>
        <iframe
          title={regionLabel || title || locationName}
          src={mapSrc}
          className={styles.mapIframe}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className={styles.locationPanel}>
        <div>
          <span>{locationName}</span>
          <strong>{title}</strong>
        </div>

        <p>{address}</p>

        {description && <small>{description}</small>}

        {directionsHref && directionsLabel && (
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {directionsLabel}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      {(badgeLabel || badgeValue) && (
        <div
          className={styles.mapBadge}
          aria-hidden="true"
        >
          {badgeValue && <strong>{badgeValue}</strong>}
          {badgeLabel && <span>{badgeLabel}</span>}
        </div>
      )}
    </section>
  );
}
