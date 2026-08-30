import Image from "next/image";

export default function Loading() {
  return (
    <main className="loading-screen" aria-label="Loading">
      <div className="loading-screen__logo">
        <Image
          src="/brand/masdar-logo.png"
          alt="Masdar Al Hayat for Food Industries"
          width={220}
          height={102}
          priority
        />
      </div>
    </main>
  );
}
