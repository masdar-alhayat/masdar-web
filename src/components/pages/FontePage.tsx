import Image from "next/image";
import {ArrowDown, ArrowUpRight} from "lucide-react";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {FonteProductExplorer} from "@/components/ui/FonteProductExplorer";
import {LogoCarousel} from "@/components/ui/LogoCarousel";
import {fonteContent} from "@/content/fonte-test";
import {MANUFACTURING_VIDEO_SRC} from "@/content/media";
import clientLogos from "@/content/client-logos.json";
import {byLabel, numberedGroups, paragraphs, value} from "@/lib/content";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/types/content";
import styles from "./FontePage.module.css";

export function FontePage({locale}: {locale: Locale}) {
  const ar = locale === "ar";
  const flagship = fonteContent.sections.find(section => section.title === "Flagship Brand — Fonte")!;
  const clients = fonteContent.sections.find(section => section.title === "Our Diverse Portfolio of Clients")!;
  const closing = fonteContent.sections.find(section => section.title === "Closing CTA")!;
  const copy = paragraphs(flagship, locale);
  const products = numberedGroups(flagship).filter(group => group.prefix === "Product Category").map((group, index) => ({
    title: value(group.parts.Title, locale),
    description: value(group.parts.Description, locale),
    image: `/assets/images/prod-range-0${index + 1}-clean.png`,
  }));
  return <main id="main-content" className={styles.page}>
    <HeroMotion className={styles.hero}>
      <div className={`container-xxl ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <div className={styles.breadcrumb} data-hero-eyebrow>
            <Link href="/">{ar ? "الرئيسية" : "Home"}</Link><span>/</span>
            <Link href="/brands-partnerships/brands">{ar ? "علاماتنا التجارية" : "Our Brands"}</Link><span>/</span><span>{ar ? "فونتي" : "Fonte"}</span>
          </div>
          <div className={styles.brandSignature} data-hero-eyebrow>
            <Image src="/brand/fonte-transparent-logo.png" alt="Fonte — فونتي" width={197} height={80} priority/>
            <span>{ar ? "العلامة الرئيسية لمصدر الحياة" : "The flagship brand of Masdar Al Hayat"}</span>
          </div>
          <h1 data-hero-title><span>{ar ? "لكل مناسبة" : "Every Occasion."}<em>{ar ? "احتفال." : "A Celebration."}</em></span></h1>
          <p data-hero-copy>{ar ? "خيارات غذائية ترافق لحظاتكم اليومية." : "Food made for your everyday moments."}</p>
          <a className={styles.primaryButton} href="#fonte-products" data-hero-actions>{ar ? "اكتشف منتجاتنا" : "Discover our products"}<ArrowDown size={18} aria-hidden="true"/></a>
        </div>
        <figure className={styles.heroVisual} data-hero-media>
          <div className={styles.heroProducts}>
            <Image src="/assets/images/fonte/product-collection.webp" alt={ar ? "مجموعة منتجات فونتي من الخبز والتورتيلا والكيك ومعجون الطماطم" : "Fonte bread, tortillas, cakes and tomato paste product collection"} fill sizes="(max-width: 991px) 92vw, 52vw" priority/>
          </div>
        </figure>
      </div>
    </HeroMotion>

    <nav className={styles.brandNav} aria-label={ar ? "استكشف فونتي" : "Explore Fonte"}>
      <div className="container-xxl">
        <span>{ar ? "عالم فونتي" : "The world of Fonte"}</span>
        <a href="#fonte-products">{ar ? "منتجاتنا" : "Our products"}</a>
        <a href="#fonte-story">{ar ? "قصتنا" : "Our story"}</a>
        <a href="#fonte-film">{ar ? "خلف الكواليس" : "Behind the scenes"}</a>
        <a href="#fonte-clients">{ar ? "عملاؤنا" : "Our clients"}</a>
      </div>
    </nav>

    <AnimatedSection id="fonte-products" className={styles.products} variant="rise">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className={styles.eyebrow}>{ar ? "مجموعة المنتجات" : "Our product range"}</span><h2>{ar ? "مذاق لكل لحظة." : "A taste for every moment."}</h2></div>
          <p>{copy[1]}</p>
        </header>
        <FonteProductExplorer products={products} locale={locale}/>
      </div>
    </AnimatedSection>

    <AnimatedSection id="fonte-story" className={styles.story} variant="stagger">
      <div className={`container-xxl ${styles.storyGrid}`}>
        <div className={styles.storyVisual} data-animate>
          <Image src="/assets/images/fonte/bakery-collection.webp" alt={ar ? "خبز فونتي وخبز البرغر في عرض من كتالوج العلامة" : "Fonte sliced breads and burger buns from the brand catalogue"} fill sizes="(max-width: 991px) 92vw, 48vw"/>
          <div className={styles.storyLogo}><Image src="/brand/fonte-transparent-logo.png" alt="Fonte" width={148} height={60}/></div>
        </div>
        <div className={styles.storyCopy} data-animate>
          <span className={styles.eyebrow}>{value(byLabel(flagship, "Section Label"), locale)}</span>
          <h2>{value(byLabel(flagship, "Main Heading"), locale)}</h2>
          <p>{copy[0]}</p><p>{copy[2]}</p>
          <a className={styles.textLink} href="https://www.masdar.sa" target="_blank" rel="noreferrer">{value(byLabel(flagship, "Secondary CTA"), locale)}<ArrowUpRight className="directional-icon" size={20} aria-hidden="true"/></a>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="fonte-film" className={styles.film} variant="rise">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className={styles.eyebrow}>{ar ? "خلف الكواليس" : "Behind every Fonte moment"}</span><h2>{ar ? "العناية التي تصنع الفرق." : "Care you can see."}</h2></div>
          <p>{ar ? "تعرّف على عمليات التصنيع التي تدعم منتجات فونتي اليومية." : "A closer look at the manufacturing behind Fonte’s everyday food products."}</p>
        </header>
        <div className={styles.videoFrame} data-animate>
          <video src={MANUFACTURING_VIDEO_SRC} poster="/assets/images/fonte/bakery-collection.webp" autoPlay muted loop playsInline preload="metadata" disablePictureInPicture controlsList="nodownload noplaybackrate nofullscreen" aria-label={ar ? "فيلم تصنيع منتجات فونتي" : "Fonte manufacturing film"}/>
        </div>
        <div className={styles.filmCaption}><p>{ar ? "المذاق. الجودة. السهولة." : "Taste. Quality. Convenience."}</p></div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="fonte-clients" className={styles.clients} variant="rise">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className={styles.eyebrow}>{value(byLabel(clients, "Section Label"), locale)}</span><h2>{value(byLabel(clients, "Main Heading"), locale)}</h2></div>
          <p>{paragraphs(clients, locale)[0]}</p>
        </header>
        <LogoCarousel items={clientLogos.clients} locale={locale} label={value(byLabel(clients, "Main Heading"), locale)}/>
      </div>
    </AnimatedSection>

    <AnimatedSection className={styles.contact} variant="rise">
      <div className={`container-xxl ${styles.contactInner}`} data-animate>
        <Image src="/brand/fonte-transparent-logo.png" alt="Fonte" width={197} height={80}/>
        <span className={styles.eyebrow}>{ar ? "لنصنع لحظات أجمل معاً" : "Let’s create more everyday moments"}</span>
        <h2>{ar ? "قدّم فونتي لعملائك." : "Bring Fonte to your customers."}</h2>
        <p>{value(byLabel(closing, "Supporting Content"), locale)}</p>
        <div className={styles.contactActions}>
          <Link className={styles.primaryButton} href="/brands-partnerships/partnerships">{value(byLabel(closing, "Primary CTA"), locale)}<ArrowUpRight className="directional-icon" size={18} aria-hidden="true"/></Link>
          <Link className={styles.textLink} href="/contact#contact-form">{value(byLabel(closing, "Secondary CTA"), locale)}<ArrowUpRight className="directional-icon" size={18} aria-hidden="true"/></Link>
        </div>
      </div>
    </AnimatedSection>
  </main>;
}
