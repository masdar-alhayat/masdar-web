import type { Locale } from "@/types/content";
import styles from "./ContactLocationMap.module.css";

interface ContactLocationMapProps {
  locale: Locale;
  regionLabel: string;
  title: string;
  locationName: string;
  mapSrc: string;
}

export function ContactLocationMap({
  locale,
  regionLabel,
  title,
  locationName,
  mapSrc,
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
    </section>
  );
}
