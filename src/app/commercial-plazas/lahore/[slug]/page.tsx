import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle, Play, Share2 } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LAHORE_PLAZAS, LAHORE_PLAZAS_PATH, lahorePlazaUrl } from "@/features/plazas/catalogue";
import { PlazaArtwork } from "@/features/plazas/PlazaArtwork";
import { formatCroreLakh } from "@/lib/format";
import { whatsappLink, whatsappShareLink } from "@/lib/whatsapp";

type PlazaPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LAHORE_PLAZAS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PlazaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const plaza = LAHORE_PLAZAS.find((entry) => entry.slug === slug);
  if (!plaza) notFound();

  const title = `${plaza.name} in ${plaza.area} | Clearstoreys`;
  const description = `See the plaza value and monthly rental potential for ${plaza.name} in ${plaza.area}.`;
  const url = lahorePlazaUrl(slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function PlazaPage({ params }: PlazaPageProps) {
  const { slug } = await params;
  const plaza = LAHORE_PLAZAS.find((entry) => entry.slug === slug);
  if (!plaza) notFound();

  const { min, max } = plaza.monthlyRentEstimatePkr;
  const plazaValue = formatCroreLakh(plaza.askingPricePkr).replace(" Cr", " crore");
  const rentalPotential = `PKR ${min / 100_000}–${max / 100_000} lakh`;
  const whatsappMessage = `Hi Clearstoreys, I’m interested in ${plaza.name} in ${plaza.area}. Please share the latest asking price and site visit options.`;
  const shareUrl = lahorePlazaUrl(slug);

  return (
    <>
      <Header whatsappMessage={whatsappMessage} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <Link href={LAHORE_PLAZAS_PATH} className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> All Lahore plazas
        </Link>
        <article className="mt-5 overflow-hidden rounded-2xl border border-ink/15 bg-ink text-paper shadow-xl shadow-ink/10">
          <PlazaArtwork photo={plaza.photo} logo={plaza.logo} />
          <div className="border-t border-gold/40 px-5 py-6 sm:px-8 sm:py-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Commercial plaza for sale</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{plaza.name}</h1>
            <p className="mt-3 text-sm font-semibold text-paper">{plaza.floors} floors · {plaza.sizeMarla} marla</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-paper/85">
              <a href={plaza.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                <MapPin className="size-4 text-gold" aria-hidden="true" /> {plaza.area}
              </a>
              <a href={plaza.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                <Play className="size-4 text-gold" aria-hidden="true" /> Watch on YouTube
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-2 divide-x divide-ink/15 bg-cream text-ink">
            <div className="px-4 py-5 sm:px-8 sm:py-6">
              <dt className="text-xs font-bold uppercase tracking-wide">Plaza value</dt>
              <dd className="mt-2 font-serif text-lg font-semibold sm:text-3xl">{plazaValue}</dd>
            </div>
            <div className="px-4 py-5 sm:px-8 sm:py-6">
              <dt className="text-xs font-bold uppercase tracking-wide">Rental potential</dt>
              <dd className="mt-2 font-serif text-lg font-semibold sm:text-3xl">{rentalPotential}</dd>
              <dd className="mt-0.5 text-xs text-ink/70">Estimated per month</dd>
            </div>
          </dl>
        </article>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="whatsapp-chat inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
            <MessageCircle className="size-4" aria-hidden="true" /> Chat on WhatsApp
          </a>
          <a href={whatsappShareLink(`${plaza.name} · ${plaza.area}\n${shareUrl}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold hover:bg-cream">
            <Share2 className="size-4" aria-hidden="true" /> Share plaza
          </a>
        </div>
      </main>
      <SiteFooter whatsappMessage={whatsappMessage} />
    </>
  );
}
