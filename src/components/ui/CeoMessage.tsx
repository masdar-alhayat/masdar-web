import Image from "next/image";
import {Quote} from "lucide-react";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {CEO_PORTRAIT} from "@/content/pages";
import {byLabel, paragraphs, value} from "@/lib/content";
import type {ContentSection, Locale} from "@/types/content";
import styles from "./CeoMessage.module.css";

/** About page: the CEO's portrait, message and short biography, shown directly below the hero. */
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
        <figure className={styles.figure} data-animate>
          <div className={styles.stage}>
            <span className={styles.panel} aria-hidden="true"/>
            <Image
              src={CEO_PORTRAIT}
              alt={[name, role, company].join(separator)}
              width={891}
              height={1164}
              sizes="(max-width: 575px) 88vw, (max-width: 991px) 30rem, 36vw"
              className={styles.portrait}
            />
            <span className={styles.shade} aria-hidden="true"/>
          </div>
          <figcaption className={styles.nameplate}>
            <strong>{name}</strong>
            <span className={styles.role}>{role}</span>
            <span className={styles.company}>{company}</span>
          </figcaption>
        </figure>

        <div className={styles.copy}>
          <span className="section-kicker" data-animate>{text("Section Label")}</span>
          <h2 data-animate>{text("Main Heading")}</h2>
          <blockquote className={styles.message} data-animate>
            <Quote className={styles.quote} aria-hidden="true"/>
            <p className={styles.lead}>{text("Lead")} <em>{text("Lead Highlight")}</em></p>
            {paragraphs(section, locale).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </blockquote>
          <div className={styles.bio} data-animate>
            <h3>{text("Bio Label")}</h3>
            <p>{text("Bio")}</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  </div>;
}
