import Image from "next/image";
import type { LAHORE_PLAZAS } from "./catalogue";

type PlazaArtworkProps = Pick<(typeof LAHORE_PLAZAS)[number], "photo"> & {
  detail?: boolean;
};

export function PlazaArtwork({ photo, detail = false }: PlazaArtworkProps) {
  return (
    <div className="bg-ink">
      <div className={detail ? "relative mx-auto aspect-[4/5] max-w-md" : "relative aspect-[16/9]"}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 480px) 100vw, 448px" className="object-contain" />
      </div>
    </div>
  );
}
