import Image from "next/image";
import {ArrowDown, ArrowUpRight, CloudSun, HeartHandshake, Moon, Play, ShieldCheck, Sparkles, Sun, Sunrise, Sunset, Timer, UtensilsCrossed} from "lucide-react";
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

// Per-category accent colours, in the same order as the "Product Category" content groups.
const productAccents = ["#f6b533", "#d9892b", "#ec6f2d", "#c8416c", "#e91c29", "#a8682e"];

const moments = [
  {icon: Sunrise, product: 1, en: {time: "Morning", title: "Golden toast", text: "Soft sliced breads for an easy family breakfast."}, ar: {time: "الصباح", title: "توست ذهبي", text: "خبز مقطّع طري لفطور عائلي سهل."}},
  {icon: Sun, product: 0, en: {time: "Midday", title: "Wraps on the go", text: "Tortillas ready for quick, fresh lunches."}, ar: {time: "الظهيرة", title: "لفائف سريعة", text: "تورتيلا جاهزة لوجبات غداء سريعة وطازجة."}},
  {icon: CloudSun, product: 3, en: {time: "Afternoon", title: "Tea-time treats", text: "Swiss rolls, sponge cakes and croissants."}, ar: {time: "العصر", title: "حلويات الشاي", text: "سويس رول وكيك إسفنجي وكرواسون."}},
  {icon: Sunset, product: 2, en: {time: "Evening", title: "Burger night", text: "Potato and sesame buns for the whole table."}, ar: {time: "المساء", title: "ليلة البرغر", text: "خبز البطاطس والسمسم لكل أفراد المائدة."}},
  {icon: Moon, product: 4, en: {time: "Dinner", title: "Home-cooked flavour", text: "Rich tomato paste for slow-cooked dishes."}, ar: {time: "العشاء", title: "نكهة البيت", text: "معجون طماطم غني لأطباق الطبخ المنزلي."}},
  {icon: Sparkles, product: 5, en: {time: "Gatherings", title: "Crispy & golden", text: "Bread crumbs for the dishes everyone shares."}, ar: {time: "التجمعات", title: "مقرمش وذهبي", text: "فتات خبز للأطباق التي يتشاركها الجميع."}},
];

const pillars = [
  {icon: UtensilsCrossed, en: {title: "Taste", text: "Food developed for everyday meals and family occasions."}, ar: {title: "المذاق", text: "غذاء مطوّر للوجبات اليومية والمناسبات العائلية."}},
  {icon: ShieldCheck, en: {title: "Quality", text: "Dependable quality backed by Masdar Al Hayat manufacturing."}, ar: {title: "الجودة", text: "جودة موثوقة تدعمها خبرات مصدر الحياة التصنيعية."}},
  {icon: Timer, en: {title: "Convenience", text: "Practical products for quick preparation at home and at work."}, ar: {title: "السهولة", text: "منتجات عملية للتحضير السريع في المنزل والعمل."}},
];

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
    accent: productAccents[index],
  }));
  const ribbon = [...products.map(product => product.title), ar ? "لكل مناسبة احتفال" : "Every occasion a celebration"];
  const badgeText = ar ? "لكل مناسبة احتفال ✦ فونتي ✦ لكل مناسبة احتفال ✦ " : "Every occasion a celebration ✦ Fonte ✦ ";

  return <main id="main-content" className={styles.page}>
    <HeroMotion className={styles.hero}>
      <div className={styles.heroBackdrop} aria-hidden="true">
        <span className={styles.heroWordmark}>{ar ? "فونتي" : "FONTE"}</span>
        <span className={styles.confetti}/>
      </div>
      <div className={`container-xxl ${styles.heroInner}`}>
        <div className={styles.breadcrumb} data-hero-eyebrow>
          <Link href="/">{ar ? "الرئيسية" : "Home"}</Link><span>/</span>
          <Link href="/brands-partnerships/brands">{ar ? "علاماتنا التجارية" : "Our Brands"}</Link><span>/</span><span>{ar ? "فونتي" : "Fonte"}</span>
        </div>
        <div className={styles.brandSignature} data-hero-eyebrow>
          <Image src="/brand/fonte-transparent-logo.png" alt="Fonte — فونتي" width={197} height={80} priority/>
          <span>{ar ? "العلامة الرئيسية لمصدر الحياة" : "The flagship brand of Masdar Al Hayat"}</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 data-hero-title><span>{ar ? "لكل مناسبة" : "Every Occasion."}</span><span><em>{ar ? "احتفال." : "A Celebration."}</em></span></h1>
            <p data-hero-copy>{ar ? "خيارات غذائية ترافق لحظاتكم اليومية." : "Food made for your everyday moments."}</p>
            <div className={styles.heroActions} data-hero-actions>
              <a className={styles.primaryButton} href="#fonte-products">{ar ? "اكتشف منتجاتنا" : "Discover our products"}<ArrowDown size={18} aria-hidden="true"/></a>
              <a className={styles.ghostButton} href="#fonte-film"><span className={styles.playDot}><Play size={14} fill="currentColor" aria-hidden="true"/></span>{ar ? "شاهد خلف الكواليس" : "Watch behind the scenes"}</a>
            </div>
            <ul className={styles.heroChips} data-hero-copy aria-label={ar ? "فئات فونتي" : "Fonte categories"}>
              {products.map(product => <li key={product.title} style={{"--accent": product.accent} as React.CSSProperties}>{product.title}</li>)}
            </ul>
          </div>
          <figure className={styles.heroVisual} data-hero-media>
            <div className={styles.heroBurst} aria-hidden="true"/>
            <div className={styles.heroArch}>
              <div className={styles.heroProducts}>
                <Image src="/assets/images/fonte/product-collection.webp" alt={ar ? "مجموعة منتجات فونتي من الخبز والتورتيلا والكيك ومعجون الطماطم" : "Fonte bread, tortillas, cakes and tomato paste product collection"} fill sizes="(max-width: 991px) 80vw, 40vw" priority/>
              </div>
            </div>
            <svg className={styles.heroBadge} viewBox="0 0 200 200" aria-hidden="true">
              <defs><path id="fonte-badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs>
              <circle cx="100" cy="100" r="98"/>
              <text direction="ltr"><textPath href="#fonte-badge-circle" textLength={ar ? undefined : 470}>{badgeText}</textPath></text>
              <image href="/brand/fonte-mark.webp" x="48" y="48" width="104" height="104"/>
            </svg>
          </figure>
        </div>
      </div>
    </HeroMotion>

    <div className={styles.ribbons} aria-hidden="true">
      {[styles.ribbonGold, styles.ribbonRed].map(variant => <div key={variant} className={`${styles.ribbon} ${variant}`}>
        <div className={styles.ribbonTrack}>
          {[0, 1, 2, 3].map(copyIndex => <span key={copyIndex}>{ribbon.map(item => <span key={item}>{item}<Sparkles size={18}/></span>)}</span>)}
        </div>
      </div>)}
    </div>

    <nav className={styles.brandNav} aria-label={ar ? "استكشف فونتي" : "Explore Fonte"}>
      <div className="container-xxl">
        <span>{ar ? "عالم فونتي" : "The world of Fonte"}</span>
        <div>
          <a href="#fonte-products">{ar ? "منتجاتنا" : "Our products"}</a>
          <a href="#fonte-moments">{ar ? "لحظاتنا" : "Moments"}</a>
          <a href="#fonte-story">{ar ? "قصتنا" : "Our story"}</a>
          <a href="#fonte-film">{ar ? "خلف الكواليس" : "Behind the scenes"}</a>
          <a href="#fonte-clients">{ar ? "عملاؤنا" : "Our clients"}</a>
        </div>
      </div>
    </nav>

    <AnimatedSection id="fonte-products" className={styles.products} variant="rise">
      <div className="container-xxl">
        <header className={styles.sectionHeader} data-animate>
          <div><span className={styles.eyebrow}>{ar ? "مجموعة المنتجات" : "Our product range"}</span><h2>{ar ? <>مذاق <mark>لكل</mark> لحظة.</> : <>A taste for <mark>every</mark> moment.</>}</h2></div>
          <p>{copy[1]}</p>
        </header>
        <FonteProductExplorer products={products} locale={locale}/>
      </div>
    </AnimatedSection>

    <AnimatedSection id="fonte-moments" className={styles.moments} variant="stagger">
      <div className="container-xxl">
        <header className={styles.momentsHeader} data-animate>
          <span className={styles.eyebrow}>{ar ? "من الصباح حتى المساء" : "From sunrise to gathering"}</span>
          <h2>{ar ? "لحظة فونتي لكل وقت من اليوم." : "A Fonte moment for every hour of the day."}</h2>
        </header>
        <svg className={styles.sunPath} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M10,110 C300,-20 900,-20 1190,110"/></svg>
        <ol className={styles.momentGrid}>
          {moments.map((moment, index) => {
            const Icon = moment.icon;
            const text = ar ? moment.ar : moment.en;
            return <li key={moment.en.time} className={styles.momentCard} data-animate style={{"--accent": productAccents[moment.product], "--step": index} as React.CSSProperties}>
              <div className={styles.momentSky}>
                <Icon size={26} strokeWidth={1.6} aria-hidden="true"/>
                <span>{text.time}</span>
              </div>
              <div className={styles.momentThumb}><Image src={products[moment.product].image} alt="" fill sizes="120px"/></div>
              <h3>{text.title}</h3>
              <p>{text.text}</p>
              <small>{products[moment.product].title}</small>
            </li>;
          })}
        </ol>
      </div>
    </AnimatedSection>

    <AnimatedSection id="fonte-story" className={styles.story} variant="stagger">
      <div className={styles.storyBanner}>
        <Image src="/assets/images/fonte/bakery-collection.webp" alt={ar ? "خبز فونتي وخبز البرغر في عرض من كتالوج العلامة" : "Fonte sliced breads and burger buns from the brand catalogue"} fill sizes="100vw"/>
        <div className={`container-xxl ${styles.storyBannerInner}`}>
          <div className={styles.storyCopy} data-animate>
            <span className={styles.eyebrow}>{value(byLabel(flagship, "Section Label"), locale)}</span>
            <h2>{value(byLabel(flagship, "Main Heading"), locale)}</h2>
            <p>{copy[0]}</p>
            <a className={styles.textLink} href="https://www.masdar.sa" target="_blank" rel="noreferrer">{value(byLabel(flagship, "Secondary CTA"), locale)}<ArrowUpRight className="directional-icon" size={20} aria-hidden="true"/></a>
          </div>
        </div>
      </div>
      <div className={`container-xxl ${styles.pillarRow}`}>
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          const text = ar ? pillar.ar : pillar.en;
          return <article key={pillar.en.title} className={styles.pillar} data-animate>
            <span className={styles.pillarIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <Icon size={34} strokeWidth={1.5} aria-hidden="true"/>
            <h3>{text.title}</h3>
            <p>{text.text}</p>
          </article>;
        })}
        <p className={styles.pillarNote} data-animate><HeartHandshake size={22} aria-hidden="true"/>{copy[2]}</p>
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
      <div className={styles.contactBurst} aria-hidden="true"/>
      <div className={`container-xxl ${styles.contactInner}`} data-animate>
        <div className={styles.contactLogo}><Image src="/brand/fonte-transparent-logo.png" alt="Fonte" width={197} height={80}/></div>
        <span className={styles.eyebrow}>{ar ? "لنصنع لحظات أجمل معاً" : "Let’s create more everyday moments"}</span>
        <h2>{ar ? "قدّم فونتي لعملائك." : "Bring Fonte to your customers."}</h2>
        <p>{value(byLabel(closing, "Supporting Content"), locale)}</p>
        <div className={styles.contactActions}>
          <Link className={styles.primaryButton} href="/brands-partnerships/partnerships">{value(byLabel(closing, "Primary CTA"), locale)}<ArrowUpRight className="directional-icon" size={18} aria-hidden="true"/></Link>
          <Link className={styles.ghostButton} href="/contact#contact-form">{value(byLabel(closing, "Secondary CTA"), locale)}<ArrowUpRight className="directional-icon" size={18} aria-hidden="true"/></Link>
        </div>
      </div>
    </AnimatedSection>
  </main>;
}
