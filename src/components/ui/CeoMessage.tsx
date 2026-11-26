import Image from "next/image";
import {Quote} from "lucide-react";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {CEO_PORTRAIT} from "@/content/pages";
import {byLabel, paragraphs, value} from "@/lib/content";
import type {ContentSection, Locale} from "@/types/content";
import styles from "./CeoMessage.module.css";

/**
 * About page: the CEO's message as a signed letter. The portrait and the short biography form one column,
 * the letter the other, and both columns share the same top and bottom edges.
 */
export function CeoMessage({section, locale}: {section: ContentSection; locale: Locale}) {
  const text = (label: string) => value(byLabel(section, label), locale);
  const name = text("Name");
  const role = text("Role");
  const company = text("Company");
  const separator = locale === "ar" ? "، " : ", ";

  // The plain wrapper keeps the alternating `.content-section:nth-of-type()` backgrounds of the sections below unchanged.
  return <div>
    <AnimatedSection className={styles.section} id="ceo-message">
      {/* No visible title by design; the heading keeps the section named for screen readers and the page outline. */}
      <h2 className={styles.srOnly}>{text("Main Heading")}</h2>
      <div className="container-xxl">
        <span className="section-kicker" data-animate>{text("Section Label")}</span>
      </div>
      <div className={`container-xxl ${styles.grid}`}>
        <div className={styles.profile} data-animate>
          <figure className={styles.portrait}>
            <Image
              src={CEO_PORTRAIT}
              alt={[name, role, company].join(separator)}
              fill
              sizes="(max-width: 575px) 90vw, (max-width: 991px) 50vw, 40vw"
            />
          </figure>
          <div className={styles.bio}>
            <p>{text("Bio")}</p>
          </div>
        </div>

        <article className={styles.letter} data-animate>
          <Quote className={styles.mark} aria-hidden="true"/>
          <div className={styles.body}>
            <p className={styles.salutation}>{text("Salutation")}</p>
            {paragraphs(section, locale).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <p className={styles.signature}>
            <strong>{name}</strong>
            <span>{role}{separator}{company}</span>
          </p>
        </article>
      </div>
    </AnimatedSection>
  </div>;
}
