import Image from "next/image";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {CEO_PORTRAIT} from "@/content/pages";
import {byLabel, paragraphs, value} from "@/lib/content";
import type {ContentSection, Locale} from "@/types/content";
import styles from "./CeoMessage.module.css";

/** About page: the CEO's message, set as a signed letter beside a quiet portrait, with a short biography. */
export function CeoMessage({section, locale}: {section: ContentSection; locale: Locale}) {
  const text = (label: string) => value(byLabel(section, label), locale);
  const name = text("Name");
  const role = text("Role");
  const company = text("Company");
  const separator = locale === "ar" ? "، " : ", ";

  // The plain wrapper keeps the alternating `.content-section:nth-of-type()` backgrounds of the sections below unchanged.
  return <div>
    <AnimatedSection className={styles.section} id="ceo-message">
      <div className={`container-xxl ${styles.grid}`}>
        <figure className={styles.portrait} data-animate>
          <Image
            src={CEO_PORTRAIT}
            alt={[name, role, company].join(separator)}
            width={891}
            height={1164}
            sizes="(max-width: 575px) 80vw, (max-width: 991px) 22rem, 30vw"
          />
        </figure>

        <div className={styles.copy}>
          <span className="section-kicker" data-animate>{text("Section Label")}</span>
          <h2 data-animate>{text("Main Heading")}</h2>

          <div className={styles.letter} data-animate>
            <p className={styles.salutation}>{text("Salutation")}</p>
            {paragraphs(section, locale).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <p className={styles.signature}>
              <strong>{name}</strong>
              <span>{role}{separator}{company}</span>
            </p>
          </div>

          <div className={styles.bio} data-animate>
            <h3>{text("Bio Label")}</h3>
            <p>{text("Bio")}</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  </div>;
}
