import Image from "next/image";
import type { LAHORE_PLAZAS } from "./catalogue";

type PlazaArtworkProps = Pick<(typeof LAHORE_PLAZAS)[number], "photo" | "logo">;

export function PlazaArtwork({ photo, logo }: PlazaArtworkProps) {
  return (
    <div className="grid aspect-[16/9] grid-cols-[42%_1fr] overflow-hidden bg-ink">
      <div className="relative overflow-hidden bg-cream">
        {/* The video thumbnail has dark side panels. Frame the storefront in the center. */}
        <div className="absolute inset-y-0 left-1/2 w-[238%] -translate-x-1/2">
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        </div>
      </div>
      <div className="relative flex items-center justify-center bg-[radial-gradient(ellipse_at_75%_30%,#654126_0%,#2b2018_55%,#16130d_100%)] px-[12%]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-gold/35 sm:inset-4" />
        <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="(max-width: 768px) 40vw, 340px" className="relative h-auto w-full" />
      </div>
    </div>
  );
}
