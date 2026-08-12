import {ArrowDown, ArrowRight, ShieldCheck, Wheat, Factory, Globe2, Users, BriefcaseBusiness} from "lucide-react";
import Image from "next/image";
import {AnimatedSection} from "@/components/motion/AnimatedSection";
import {HeroMotion} from "@/components/motion/HeroMotion";
import {ArrowLink} from "@/components/ui/ArrowLink";
import {BrandImage} from "@/components/ui/BrandImage";
import {BRAND_LOGOS, HOME_IMAGES, HOME_VIDEOS} from "@/content/pages";
import {byLabel, numberedGroups, paragraphs, value} from "@/lib/content";
import type {Locale, PageContent} from "@/types/content";

const iconSet = [Factory, ShieldCheck, Wheat, Globe2, BriefcaseBusiness, Users];

export function HomePage({page, locale}: {page: PageContent; locale: Locale}) {
  const ar = locale === "ar";
  const [hero, intro, glance, manufacturing, portfolio, fonte, quality, tamimi, partnerships, market, careers, finalCta] = page.sections;
  const heroHeading = value(byLabel(hero,"Main Heading"),locale);
  const fonteHeading = value(byLabel(fonte,"Main Heading"),locale);
  const fonteTitle = fonteHeading.replace(ar ? /^فونتي\s*[—–-]\s*/ : /^Fonte\s*[—–-]\s*/i, "").trim();
  const heroWords = heroHeading.split(/(?<=[.!؟])\s+/).filter(Boolean);
  return <main id="main-content">
    <HeroMotion className="home-hero">
      <div className="home-hero__media" data-hero-media><BrandImage src={HOME_IMAGES.hero} alt={heroHeading} priority/></div>
      <div className="home-hero__wash" aria-hidden="true"/>
      <div className="container-xxl home-hero__content">
        <span className="home-hero__eyebrow" data-hero-eyebrow>{value(byLabel(hero,"Eyebrow"),locale)}</span>
        <h1 data-hero-title>{heroWords.map((word,i)=><span key={i}>{word}</span>)}</h1>
        <div className="home-hero__bottom"><div data-hero-copy>{paragraphs(hero,locale).map((p,i)=><p key={i}>{p}</p>)}</div><div className="home-hero__actions" data-hero-actions><ArrowLink href="/about/masdar-al-hayat" light>{value(byLabel(hero,"Primary CTA"),locale)}</ArrowLink><ArrowLink href="/brands-partnerships/partnerships" light>{value(byLabel(hero,"Secondary CTA"),locale)}</ArrowLink></div></div>
      </div>
      <div className="home-hero__mark" data-hero-mark aria-hidden="true"><span>M</span><small>{ar ? "منذ ٢٠٠٩" : "SINCE 2009"}</small></div>
      <a className="home-hero__scroll" href="#who-we-are"><ArrowDown/>{ar ? "اكتشف" : "Discover"}</a>
    </HeroMotion>

    <AnimatedSection id="who-we-are" className="home-intro" variant="rise">
      <div className="container-xxl home-intro__grid">
        <div className="home-intro__content" data-animate>
          <span className="section-kicker">{value(byLabel(intro,"Section Label"),locale)}</span>
          <h2>{value(byLabel(intro,"Main Heading"),locale)}</h2>
          <div className="home-intro__copy">
            {paragraphs(intro,locale).map((p,i)=><p key={i}>{p}</p>)}
          </div>
          <ArrowLink href="/about/masdar-al-hayat">{value(byLabel(intro,"CTA"),locale)}</ArrowLink>
        </div>

        <figure className="home-intro__visual">
          <BrandImage
            src={HOME_IMAGES.whoWeAre}
            alt={ar ? "أخصائي إنتاج في مصدر الحياة يتابع خط تصنيع المخبوزات" : "Masdar Al Hayat production specialist inspecting a bakery manufacturing line"}
            className="home-intro__image"
            priority
          />
          <figcaption className="home-intro__badge" data-animate>
            <span aria-hidden="true">M</span>
            <div>
              <strong>2009</strong>
              <small>{ar ? "صناعة غذائية سعودية" : "Saudi food manufacturing"}</small>
            </div>
          </figcaption>
        </figure>
      </div>
    </AnimatedSection>

    <AnimatedSection className="glance-section" variant="stagger"><div className="container-xxl"><header className="section-heading" data-animate><span className="section-kicker">{value(byLabel(glance,"Section Label"),locale)}</span><h2>{value(byLabel(glance,"Main Heading"),locale)}</h2><p>{value(byLabel(glance,"Introduction"),locale)}</p></header><div className="glance-grid">{numberedGroups(glance).map((group)=><article key={group.key} data-animate><span className="glance-grid__value">{value(group.parts.Value,locale)}</span><h3>{value(group.parts.Title,locale)}</h3><p>{value(group.parts.Description,locale)}</p><span className="glance-grid__line"/></article>)}</div></div></AnimatedSection>

    <AnimatedSection className="manufacturing-home" variant="mask">
      <div className="container-xxl manufacturing-home__grid">
        <div className="manufacturing-home__content" data-animate>
          <span className="section-kicker">{value(byLabel(manufacturing,"Section Label"),locale)}</span>
          <h2>{value(byLabel(manufacturing,"Main Heading"),locale)}</h2>
          {paragraphs(manufacturing,locale).map((p,i)=><p key={i}>{p}</p>)}
          <ArrowLink href="/capabilities/manufacturing">{value(byLabel(manufacturing,"CTA"),locale)}</ArrowLink>
        </div>
        <figure className="manufacturing-home__visual" data-animate>
          <BrandImage
            src={HOME_IMAGES.manufacturingStrength}
            alt={ar ? "أسطول شاحنات مصدر الحياة المبرّدة الجاهز للتوزيع" : "Masdar Al Hayat refrigerated delivery fleet ready for distribution"}
            className="manufacturing-home__image"
          />
          <figcaption><Factory/><span>{ar ? "قوة التصنيع والتوزيع" : "Manufacturing and distribution strength"}</span></figcaption>
        </figure>
        <div className="manufacturing-home__rail">{numberedGroups(manufacturing).map((g,i)=>{const Icon=iconSet[i%iconSet.length];return <div key={g.key} data-animate><Icon/><span>0{i+1}</span><h3>{value((locale === "ar" ? g.parts["Arabic Title"] : undefined) || g.parts.Title,locale)}</h3></div>})}</div>
      </div>
    </AnimatedSection>

    <AnimatedSection className="portfolio-home" variant="stagger"><div className="container-xxl"><header className="portfolio-home__header" data-animate><div><span className="section-kicker">{value(byLabel(portfolio,"Section Label"),locale)}</span><h2>{value(byLabel(portfolio,"Main Heading"),locale)}</h2></div><div>{paragraphs(portfolio,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/brands-partnerships/brands">{value(byLabel(portfolio,"CTA"),locale)}</ArrowLink></div></header><div className="portfolio-orbit">{numberedGroups(portfolio).map((g,i)=><article key={g.key} data-animate><span>0{i+1}</span><h3>{value(g.parts.Title,locale)}</h3><p>{value(g.parts.Description,locale)}</p></article>)}</div></div></AnimatedSection>

    <AnimatedSection className="fonte-home" variant="slide">
      <div className="fonte-home__background" aria-hidden="true">
        <video
          className="fonte-home__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          disablePictureInPicture
        >
          <source src={HOME_VIDEOS.flagshipBrand} type="video/mp4"/>
        </video>
        <span className="fonte-home__wash"/>
      </div>
      <div className="container-xxl fonte-home__content" data-animate>
        <span className="section-kicker">{value(byLabel(fonte,"Section Label"),locale)}</span>
        <div className="fonte-home__logo" role="img" aria-label={ar ? "شعار فونتي" : "Fonte logo"}>
          <Image src="/brand/fonte-logo-full.png" alt="" width={512} height={512} sizes="(max-width: 767px) 150px, 184px"/>
        </div>
        <h2>{fonteTitle}</h2>
        {paragraphs(fonte,locale).map((p,i)=><p key={i}>{p}</p>)}
        <div className="fonte-home__categories">{numberedGroups(fonte).map((g)=><span key={g.key}>{value(g.parts.Title || g.parts.Text,locale) || value(Object.values(g.parts)[0],locale)}</span>)}</div>
        <ArrowLink href="/brands-partnerships/brands" light>{value(byLabel(fonte,/CTA/),locale)}</ArrowLink>
      </div>
    </AnimatedSection>

    <AnimatedSection className="quality-home" variant="line">
      <div className="container-xxl quality-home__grid">
        <header data-animate>
          <ShieldCheck/>
          <span className="section-kicker">{value(byLabel(quality,"Section Label"),locale)}</span>
          <h2>{value(byLabel(quality,"Main Heading"),locale)}</h2>
          <BrandImage
            src={HOME_IMAGES.qualitySystem}
            alt={ar ? "أخصائية جودة توثق فحوصات سلامة الغذاء داخل منشأة الإنتاج" : "Quality specialist documenting food-safety checks inside the production facility"}
            className="quality-home__image"
          />
        </header>
        <div data-animate>
          {paragraphs(quality,locale).map((p,i)=><p key={i}>{p}</p>)}
          <div className="quality-home__steps">{numberedGroups(quality).map((g,i)=><div key={g.key}><span>{String(i+1).padStart(2,"0")}</span><h3>{value(g.parts.Title,locale)}</h3><p>{value(g.parts.Description,locale)}</p></div>)}</div>
          <ArrowLink href="/capabilities/quality-compliance">{value(byLabel(quality,"CTA"),locale)}</ArrowLink>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection className="legacy-home" variant="mask">
      <div className="container-xxl legacy-home__grid">
        <figure className="legacy-home__emblem" data-animate>
          <div className="legacy-home__logo-frame">
            <Image
              src={BRAND_LOGOS.tamimiGroup}
              alt={ar ? "شعار مجموعة التميمي" : "Tamimi Group logo"}
              width={400}
              height={270}
              className="legacy-home__logo"
            />
          </div>
          <figcaption>
            <span>{ar ? "تأسست عام" : "Established"}</span>
            <strong>1942</strong>
          </figcaption>
        </figure>
        <div className="legacy-home__content" data-animate>
          <span className="legacy-home__year">2009</span>
          <span className="section-kicker">{value(byLabel(tamimi,"Section Label"),locale)}</span>
          <h2>{value(byLabel(tamimi,"Main Heading"),locale)}</h2>
          {paragraphs(tamimi,locale).map((p,i)=><p key={i}>{p}</p>)}
          <ArrowLink href="/about/group-story-tamimi-group">{value(byLabel(tamimi,"CTA"),locale)}</ArrowLink>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection className="partnership-home" variant="stagger"><div className="container-xxl"><header className="section-heading section-heading--wide" data-animate><div><BriefcaseBusiness/><span className="section-kicker">{value(byLabel(partnerships,"Section Label"),locale)}</span><h2>{value(byLabel(partnerships,"Main Heading"),locale)}</h2></div><div>{paragraphs(partnerships,locale).map((p,i)=><p key={i}>{p}</p>)}<ArrowLink href="/brands-partnerships/partnerships">{value(byLabel(partnerships,"CTA"),locale)}</ArrowLink></div></header><div className="partnership-home__channels">{numberedGroups(partnerships).map((g,i)=><article data-animate key={g.key}><span>0{i+1}</span><h3>{value(g.parts.Title,locale)}</h3><p>{value(g.parts.Description,locale)}</p><ArrowRight/></article>)}</div></div></AnimatedSection>

    <AnimatedSection className="market-home" variant="slide">
      <div className="container-xxl market-home__layout">
        <div className="market-home__overlay" data-animate>
          <Globe2/>
          <span className="section-kicker">{value(byLabel(market,"Section Label"),locale)}</span>
          <h2>{value(byLabel(market,"Main Heading"),locale)}</h2>
          {paragraphs(market,locale).map((p,i)=><p key={i}>{p}</p>)}
          <ArrowLink href="/market-presence/exhibitions" light>{value(byLabel(market,"CTA"),locale)}</ArrowLink>
        </div>
        <figure className="market-home__figure" data-animate>
          <BrandImage
            src={HOME_IMAGES.marketConnection}
            alt={ar ? "جناح مصدر الحياة وفونتي في معرض تجاري لقطاع الأغذية" : "Masdar Al Hayat and Fonte exhibition stand at a food-industry trade event"}
            className="market-home__image"
          />
          <span className="market-home__mark" aria-hidden="true"><Globe2/></span>
        </figure>
      </div>
    </AnimatedSection>

    <AnimatedSection className="careers-home" variant="rise">
      <div className="container-xxl careers-home__grid">
        <div data-animate>
          <Users/>
          <span className="section-kicker">{value(byLabel(careers,"Section Label"),locale)}</span>
          <h2>{value(byLabel(careers,"Main Heading"),locale)}</h2>
          {paragraphs(careers,locale).map((p,i)=><p key={i}>{p}</p>)}
          <ArrowLink href="/careers#career-application">{value(byLabel(careers,"CTA"),locale)}</ArrowLink>
        </div>
        <figure className="careers-home__visual" data-animate>
          <BrandImage
            src={HOME_IMAGES.careers}
            alt={ar ? "مدخل منشأة مصدر الحياة للصناعات الغذائية" : "Entrance to the Masdar Al Hayat food manufacturing facility"}
            className="careers-home__image"
          />
          <figcaption><Users/><span>{ar ? "فرص مهنية" : "Career opportunities"}</span></figcaption>
        </figure>
      </div>
    </AnimatedSection>

    <AnimatedSection className="home-final" variant="mask"><div className="container-xxl home-final__inner" data-animate><span className="section-kicker">{value(byLabel(finalCta,"Section Label"),locale)}</span><h2>{value(byLabel(finalCta,"Main Heading"),locale)}</h2>{paragraphs(finalCta,locale).map((p,i)=><p key={i}>{p}</p>)}<div><ArrowLink href="/contact" light>{value(byLabel(finalCta,/Primary CTA|CTA/),locale)}</ArrowLink><ArrowLink href="/brands-partnerships/partnerships" light>{value(byLabel(finalCta,"Secondary CTA"),locale)}</ArrowLink></div></div></AnimatedSection>
  </main>;
}
