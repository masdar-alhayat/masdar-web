import Image from "next/image";
import {ArrowUpRight, ExternalLink, Mail, MapPin} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/types/content";

export function Footer({locale}: {locale: Locale}) {
  const ar = locale === "ar";
  return <footer className="site-footer">
    <div className="site-footer__grain" aria-hidden="true"/>
    <div className="container-xxl">
      <div className="site-footer__lead">
        <div><span>{ar ? "نصنع الغذاء. نبني الثقة." : "Manufacturing food. Building trust."}</span><h2>{ar ? "لنصنع قيمة تدوم." : "Let’s create lasting value."}</h2></div>
        <Link href="/brands-partnerships/business-partnerships" className="footer-circle">{ar ? "كن شريكاً لنا" : "Partner with us"}<ArrowUpRight/></Link>
      </div>
      <div className="site-footer__grid">
        <div className="footer-brand"><Image src="/brand/masdar-logo.png" alt="Masdar Al Hayat" width={230} height={107}/><p>{ar ? "شركة سعودية للصناعات الغذائية، وإحدى شركات مجموعة التميمي." : "A Saudi food manufacturing company operating as part of Tamimi Group."}</p></div>
        <div><h3>{ar ? "الشركة" : "Company"}</h3><Link href="/about/masdar-al-hayat">{ar ? "عن مصدر الحياة" : "About us"}</Link><Link href="/leadership-governance">{ar ? "القيادة والحوكمة" : "Leadership & governance"}</Link><Link href="/careers">{ar ? "الوظائف" : "Careers"}</Link></div>
        <div><h3>{ar ? "الخبرات" : "Capabilities"}</h3><Link href="/operations-quality/manufacturing-operations">{ar ? "التصنيع والعمليات" : "Manufacturing"}</Link><Link href="/operations-quality/quality-food-safety-compliance">{ar ? "الجودة وسلامة الغذاء" : "Quality & food safety"}</Link><Link href="/sustainability-responsibility">{ar ? "الاستدامة" : "Sustainability"}</Link></div>
        <div className="footer-contact"><h3>{ar ? "تواصل" : "Connect"}</h3><Link href="/contact"><Mail size={17}/>{ar ? "أرسل استفسارك" : "Send an enquiry"}</Link><Link href="/contact"><MapPin size={17}/>{ar ? "المكاتب والموقع" : "Corporate offices"}</Link><a href="#" aria-label="LinkedIn"><ExternalLink size={17}/>LinkedIn</a></div>
      </div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} Masdar Al Hayat for Food Industries Ltd.</span><span>{ar ? "جميع الحقوق محفوظة" : "All rights reserved"}</span></div>
    </div>
  </footer>;
}
