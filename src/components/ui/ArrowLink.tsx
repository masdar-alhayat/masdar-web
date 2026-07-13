import {ArrowUpRight} from "lucide-react";
import {Link} from "@/i18n/navigation";

export function ArrowLink({href, children, light = false}: {href: string; children: React.ReactNode; light?: boolean}) {
  return <Link href={href} className={`arrow-link ${light ? "arrow-link--light" : ""}`}><span>{children}</span><ArrowUpRight aria-hidden="true" size={18}/></Link>;
}
