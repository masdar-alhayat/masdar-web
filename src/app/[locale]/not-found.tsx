import {Link} from "@/i18n/navigation";
export default function NotFound() { return <main className="error-page"><span>404</span><h1>Page not found</h1><p>The requested page may have moved or is no longer available.</p><Link href="/">Return home</Link></main>; }
