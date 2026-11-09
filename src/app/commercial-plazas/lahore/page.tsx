import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LAHORE_PLAZAS, LAHORE_PLAZAS_URL, lahorePlazaPath } from "@/features/plazas/catalogue";
import { PlazaArtwork } from "@/features/plazas/PlazaArtwork";
import { formatCroreLakh } from "@/lib/format";

export const metadata: Metadata = {
  title: "Commercial Plazas in Lahore | Clearstoreys",
  description: "Explore commercial plazas for sale in Lahore by location, plaza value and monthly rental potential.",
  alternates: { canonical: LAHORE_PLAZAS_URL },
};

export default function LahorePlazasPage() {
  const whatsappMessage = "Hi Clearstoreys, I'd like to discuss commercial plazas in Lahore.";

  return (
    <>
      <Header whatsappMessage={whatsappMessage} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 sm:px-8 sm:py-20">
        <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
          Commercial Plazas in Lahore
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
          Explore commercial buildings for sale across Lahore.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LAHORE_PLAZAS.map((plaza) => (
            <Link
              key={plaza.slug}
              href={lahorePlazaPath(plaza.slug)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/15 bg-paper shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-deep"
            >
              <PlazaArtwork photo={plaza.photo} logo={plaza.logo} />
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/65">{plaza.area}</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">{plaza.name}</h2>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-4 text-sm font-semibold">
                  <span>{formatCroreLakh(plaza.askingPricePkr).replace(" Cr", " crore")}</span>
                  <span className="inline-flex items-center gap-1.5">View plaza <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter whatsappMessage={whatsappMessage} />
    </>
  );
}
