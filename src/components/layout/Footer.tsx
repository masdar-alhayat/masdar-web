import Image from "next/image";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {FaLinkedinIn} from "react-icons/fa6";
import {
  SiFacebook,
  SiInstagram,
  SiSnapchat,
  SiTiktok,
  SiX,
} from "react-icons/si";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/types/content";

const socialLinks = [
  {label: "Facebook", href: "https://www.facebook.com/282830791817902", Icon: SiFacebook},
  {label: "Instagram", href: "https://www.instagram.com/fonte2me/", Icon: SiInstagram},
  {label: "Twitter / X", href: "https://x.com/fonte2me", Icon: SiX},
  {label: "LinkedIn", href: "https://www.linkedin.com/company/fonte-masdaralhayat", Icon: FaLinkedinIn},
  {label: "Snapchat", href: "https://www.snapchat.com/add/fonte2me", Icon: SiSnapchat},
  {label: "TikTok", href: "https://www.tiktok.com/@fonte2me", Icon: SiTiktok},
] as const;

export function Footer({locale}: {locale: Locale}) {
  const ar = locale === "ar";
  const copyrightYear = ar
    ? new Intl.NumberFormat("ar-SA", {useGrouping: false}).format(new Date().getFullYear())
    : new Date().getFullYear();

  return <footer className="site-footer">
    <div className="site-footer__grain" aria-hidden="true"/>
    <div className="container-xxl">
      <div className="site-footer__lead">
        <div>
          <span>{ar ? "نصنع الغذاء. نبني الثقة." : "Manufacturing food. Building trust."}</span>
          <h2>{ar ? "لنصنع قيمة تدوم." : "Let’s create lasting value."}</h2>
        </div>
        <Link href="/brands-partnerships/partnerships" className="footer-circle">
          {ar ? "كن شريكاً لنا" : "Partner with us"}<ArrowUpRight/>
        </Link>
      </div>

      <div className="site-footer__grid">
        <div className="footer-brand">
          <Image src="/brand/masdar-logo.png" alt="Masdar Al Hayat" width={230} height={107}/>
          <p>{ar ? "شركة سعودية للصناعات الغذائية، وإحدى شركات مجموعة التميمي." : "A Saudi food manufacturing company operating as part of Tamimi Group."}</p>
        </div>

        <div>
          <h3>{ar ? "روابط سريعة" : "Quick Links"}</h3>
          <Link href="/">{ar ? "الرئيسية" : "Home"}</Link>
          <Link href="/about/masdar-al-hayat">{ar ? "عن مصدر الحياة" : "About us"}</Link>
          <Link href="/brands-partnerships/brands">{ar ? "العلامات التجارية" : "Brands"}</Link>
          <Link href="/brands-partnerships/partnerships">{ar ? "الشراكات" : "Partnerships"}</Link>
          <Link href="/careers">{ar ? "الوظائف" : "Careers"}</Link>
          <Link href="/contact">{ar ? "تواصل معنا" : "Contact"}</Link>
        </div>

        <div>
          <h3>{ar ? "قدراتنا" : "Capabilities"}</h3>
          <Link href="/capabilities/manufacturing">{ar ? "التصنيع" : "Manufacturing"}</Link>
          <Link href="/capabilities/operations">{ar ? "العمليات" : "Operations"}</Link>
          <Link href="/capabilities/quality-compliance">{ar ? "الجودة والامتثال" : "Quality & Compliance"}</Link>
          <Link href="/capabilities/logistics-distribution">{ar ? "الخدمات اللوجستية والتوزيع" : "Logistics & Distribution"}</Link>
        </div>

        <div className="footer-contact">
          <h3>{ar ? "تواصل" : "Connect"}</h3>
          <a href="mailto:info@masdar.sa"><Mail size={17}/>info@masdar.sa</a>
          <a href="tel:+966112656000"><Phone size={17}/><span dir="ltr">+966 11 265 6000</span></a>
          <a href="https://www.google.com/maps/search/?api=1&query=Masdar%20Al-Hayat%20Food%20Industries%20Riyadh" target="_blank" rel="noreferrer">
            <MapPin size={17}/>{ar ? "256، المدينة الصناعية الثالثة، الرياض 14336" : "256 III Industrial City, Riyadh 14336"}
          </a>
          <div className="footer-socials" aria-label={ar ? "حسابات التواصل الاجتماعي" : "Social media"}>
            {socialLinks.map(({label, href, Icon}) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon size={18}/></a>)}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>
          © {copyrightYear} {ar ? "شركة مصدر الحياة للصناعات الغذائية المحدودة." : "Masdar Al Hayat for Food Industries Ltd."}
        </span>
        <span className="site-footer__credit" dir={ar ? "rtl" : "ltr"}>
          {ar ? "تم التصميم والتطوير بواسطة" : "Designed and Developed by"}{" "}
          <a
            href="https://adtco-sa.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ar ? "مؤسسة ألفا المطورة للاتصالات و تقنية المعلومات" : "Alpha Developers Tech Company (ADTCO)"}
          </a>
        </span>
        <span>{ar ? "جميع الحقوق محفوظة" : "All rights reserved"}</span>
      </div>
    </div>
  </footer>;
}
