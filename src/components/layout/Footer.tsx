import Image from "next/image";
import masdarLogo from "../../../public/brand/masdar-logo-text.png";
import {
  Mail,
  MapPin,
  Phone,
  Printer,
} from "lucide-react";
import {FaLinkedinIn} from "react-icons/fa6";
import {Link} from "@/i18n/navigation";
import {getPageContent} from "@/content/pages";
import {byLabel, value} from "@/lib/content";
import type {Locale} from "@/types/content";

const socialLinks = [
  {label: "LinkedIn", href: "https://www.linkedin.com/company/fonte-masdaralhayat", Icon: FaLinkedinIn},
] as const;

// The footer introduces the company with the home page hero's opening paragraph.
const homeHero = getPageContent("home").sections[0];

export function Footer({locale}: {locale: Locale}) {
  const ar = locale === "ar";
  const copyrightYear = ar
    ? new Intl.NumberFormat("ar-SA", {useGrouping: false}).format(new Date().getFullYear())
    : new Date().getFullYear();

  return <footer className="site-footer">
    <div className="site-footer__grain" aria-hidden="true"/>
    <div className="container-xxl">
      <div className="site-footer__grid">
        <div className="footer-brand">
          <Image src={masdarLogo} alt="Masdar Al Hayat" unoptimized/>
          <p>{value(byLabel(homeHero, "Supporting Paragraph 1"), locale)}</p>
        </div>

        <div>
          <h3>{ar ? "روابط سريعة" : "Quick Links"}</h3>
          <Link href="/">{ar ? "الرئيسية" : "Home"}</Link>
          <Link href="/about/masdar-al-hayat">{ar ? "عن مصدر الحياة" : "About us"}</Link>
          <Link href="/brands-partnerships/brands">{ar ? "العلامات التجارية" : "Brands"}</Link>
          <Link href="/brands-partnerships/brands-portfolio">{ar ? "محفظة علاماتنا التجارية" : "Our Brand Portfolio"}</Link>
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
          <Link href="/capabilities/sales">{ar ? "المبيعات" : "Sales"}</Link>
          <Link href="/capabilities/marketing">{ar ? "التسويق" : "Marketing"}</Link>
        </div>

        <div className="footer-contact">
          <h3>{ar ? "تواصل" : "Connect"}</h3>
          <a href="mailto:info@masdar.sa"><Mail size={17}/>info@masdar.sa</a>
          <a href="tel:+966920005841"><Phone size={17}/><span dir="ltr">+966 9200 05841</span></a>
          <p className="footer-contact__fax"><Printer size={17}/><span>{ar ? "فاكس" : "Fax"}</span><span dir="ltr">+966 11 265 9000</span></p>
          <a href="https://www.google.com/maps/search/?api=1&query=Masdar%20Al-Hayat%20Food%20Industries%20Riyadh" target="_blank" rel="noreferrer">
            <MapPin size={17}/>{ar ? "مصدر الحياة، المنطقة الصناعية رقم 2، ص.ب 355011، الرياض 11383، المملكة العربية السعودية" : "Masdar Al Hayat, Industrial Zone No. 2, P.O. Box 355011, Riyadh 11383, Kingdom of Saudi Arabia"}
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
        <span>{ar ? "جميع الحقوق محفوظة" : "All rights reserved"}</span>
      </div>
    </div>
  </footer>;
}
