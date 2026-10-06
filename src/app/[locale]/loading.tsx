import Image from "next/image";
import masdarLogo from "../../../public/brand/masdar-logo-text.png";

export default function Loading() {
  return (
    <main className="loading-screen" aria-label="Loading">
      <div className="loading-screen__logo">
        <Image
          src={masdarLogo}
          alt="Masdar Al Hayat for Food Industries"
          unoptimized
          priority
        />
      </div>
    </main>
  );
}
