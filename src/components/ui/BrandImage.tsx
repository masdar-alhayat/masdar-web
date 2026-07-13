import Image from "next/image";

export function BrandImage({src, alt, className = "", priority = false}: {src: string; alt: string; className?: string; priority?: boolean}) {
  return (
    <div className={`brand-image ${className}`} data-animate>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} className="brand-image__img" />
      <span className="brand-image__veil" aria-hidden="true" />
    </div>
  );
}
