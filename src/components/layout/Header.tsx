"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {ChevronDown, Menu, X, ArrowUpRight} from "lucide-react";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import type {Locale} from "@/types/content";

gsap.registerPlugin(useGSAP);

type MenuItem = {label: {en: string; ar: string}; href?: string; children?: MenuItem[]};
const menu: MenuItem[] = [
  {label: {en: "Home", ar: "الرئيسية"}, href: "/"},
  {label: {en: "About Us", ar: "من نحن"}, children: [
    {label: {en: "About Masdar Al Hayat", ar: "عن مصدر الحياة"}, href: "/about/masdar-al-hayat"},
    {label: {en: "Group Story — Tamimi Group", ar: "قصة المجموعة — مجموعة التميمي"}, href: "/about/group-story-tamimi-group"},
    {label: {en: "Vision, Mission & Values", ar: "الرؤية والرسالة والقيم"}, href: "/about/vision-mission-values"}
  ]},
  {label: {en: "Research & Innovation", ar: "البحث والابتكار"}, href: "/research-innovation"},
  {label: {en: "Our Capabilities", ar: "قدراتنا"}, children: [
    {label: {en: "Manufacturing", ar: "التصنيع"}, href: "/capabilities/manufacturing"},
    {label: {en: "Operations", ar: "العمليات"}, href: "/capabilities/operations"},
    {label: {en: "Quality & Compliance", ar: "الجودة والامتثال"}, href: "/capabilities/quality-compliance"},
    {label: {en: "Logistics & Distribution", ar: "الخدمات اللوجستية والتوزيع"}, href: "/capabilities/logistics-distribution"}
  ]},
  {label: {en: "Brands & Partnerships", ar: "العلامات والشراكات"}, children: [
    {label: {en: "Brands", ar: "العلامات التجارية"}, href: "/brands-partnerships/brands"},
    {label: {en: "Partnerships", ar: "الشراكات"}, href: "/brands-partnerships/partnerships"}
  ]},
  {label: {en: "Market Presence", ar: "حضورنا في السوق"}, children: [
    {label: {en: "Market Presence & Exhibitions", ar: "الحضور في السوق والمعارض"}, href: "/market-presence/exhibitions"},
    {label: {en: "Market & Industry Landscape", ar: "السوق والقطاع الغذائي"}, href: "/market-presence/industry-landscape"}
  ]},
  {label: {en: "Careers", ar: "الوظائف"}, href: "/careers"}
];

export function Header({locale}: {locale: Locale}) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isAr = locale === "ar";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, {passive: true});
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobile);
    return () => document.body.classList.remove("menu-open");
  }, [mobile]);

  useGSAP(() => {
    if (!open) return;
    gsap.fromTo(".mega-menu.is-open", {opacity: 0, y: -12, clipPath: "inset(0 0 100% 0)"}, {opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.42, ease: "power3.out"});
  }, {dependencies: [open], scope: navRef});

  const switchLanguage = () => router.replace(pathname, {locale: isAr ? "en" : "ar"});

  const closeOnLink = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest("a")) { setOpen(null); setMobile(false); }
  };

  return (
    <>
      <header onClickCapture={closeOnLink} className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container-xxl site-header__inner" ref={navRef}>
        <Link href="/" className="site-logo" aria-label={isAr ? "مصدر الحياة — الرئيسية" : "Masdar Al Hayat — Home"}>
          <Image src="/brand/masdar-logo.png" alt="Masdar Al Hayat for Food Industries" width={220} height={102} priority />
        </Link>
        <nav className="desktop-nav" aria-label={isAr ? "التنقل الرئيسي" : "Primary navigation"}>
          {menu.map((item) => {
            const label = item.label[locale];
            if (!item.children) return <Link key={label} href={item.href!} className={pathname === item.href ? "is-active" : ""}>{label}</Link>;
            const active = open === label;
            return <div className="nav-group" key={label}>
              <button type="button" aria-expanded={active} onClick={() => setOpen(active ? null : label)}>{label}<ChevronDown size={15}/></button>
              <div className={`mega-menu ${active ? "is-open" : ""}`} hidden={!active}>
                <div className="mega-menu__intro">
                  <span>{isAr ? "استكشف مصدر الحياة" : "Explore Masdar Al Hayat"}</span>
                  <strong>{label}</strong>
                </div>
                <div className="mega-menu__links">
                  {item.children.map((child, index) => <Link key={child.href} href={child.href!}><span>0{index + 1}</span><strong>{child.label[locale]}</strong><ArrowUpRight size={18}/></Link>)}
                </div>
              </div>
            </div>;
          })}
        </nav>
        <div className="site-header__actions">
          <button className="language-switch" onClick={switchLanguage} type="button">{isAr ? "EN" : "العربية"}</button>
          <Link href="/contact" className="header-cta">{isAr ? "تواصل معنا" : "Contact"}<ArrowUpRight size={16}/></Link>
          <button className="mobile-trigger" type="button" onClick={() => setMobile(true)} aria-label={isAr ? "فتح القائمة" : "Open menu"}><Menu/></button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu ${mobile ? "is-open" : ""}`}
        aria-hidden={!mobile}
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? "قائمة التنقل" : "Navigation menu"}
        onClickCapture={closeOnLink}
      >
        <div className="mobile-menu__top">
          <Image src="/brand/masdar-logo.png" alt="Masdar Al Hayat" width={190} height={88}/>
          <button onClick={() => setMobile(false)} aria-label={isAr ? "إغلاق القائمة" : "Close menu"}><X/></button>
        </div>
        <div className="mobile-menu__body">
          {menu.map((item, i) => <div className="mobile-menu__item" key={item.label.en}>
            {item.href ? <Link href={item.href}><span>0{i+1}</span>{item.label[locale]}</Link> : <details><summary><span>0{i+1}</span>{item.label[locale]}<ChevronDown size={18}/></summary><div>{item.children?.map(child => <Link key={child.href} href={child.href!}>{child.label[locale]}<ArrowUpRight size={16}/></Link>)}</div></details>}
          </div>)}
        </div>
        <div className="mobile-menu__footer"><button onClick={switchLanguage}>{isAr ? "English" : "العربية"}</button><Link href="/contact">{isAr ? "تواصل معنا" : "Start a conversation"}</Link></div>
      </div>
    </>
  );
}
