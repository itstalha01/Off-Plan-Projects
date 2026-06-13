import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import {
  AREAS,
  POSSESSION_YEARS,
  PRICE_BAND_MAX,
  PRICE_BAND_MIN,
  PROJECTS,
} from "../constants/projects";
import { Facade, Plus, Sunburst } from "./BuildingArt";

const HERO_WHATSAPP = whatsappLink(
  "Hi Clearstoreys, I'd like help finding a Lahore off-plan project that fits me."
);

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-brown">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const minYear = POSSESSION_YEARS[0];
  const maxYear = POSSESSION_YEARS[POSSESSION_YEARS.length - 1];
  const possessionWindow = `${minYear}–${maxYear.slice(2)}`;
  const priceBand = `${PRICE_BAND_MIN}–${PRICE_BAND_MAX}`;

  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12 lg:pb-24 lg:pt-16">
        {/* Left: building photo on a gold accent block */}
        <div className="relative order-2 lg:order-1">
          <Sunburst className="absolute -left-4 -top-4 z-20 size-14 drop-shadow-md sm:size-16" />
          <Plus className="absolute right-3 top-6 z-20 size-6 text-gold-deep" />
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 -z-0 rounded-[32px] bg-gradient-to-b from-gold to-gold-deep" />
            <div className="relative h-[360px] overflow-hidden rounded-[24px] shadow-xl sm:h-[460px] lg:h-[560px]">
              <Image
                src="/images/hero-tower.jpg"
                alt="A modern Lahore high-rise residential tower with a rooftop garden"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Facade chips */}
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-lg border border-ink/10 bg-cream p-1.5">
              <Facade className="h-8 w-12" />
            </span>
            <span className="rounded-lg border border-ink/10 bg-cream p-1.5">
              <Facade className="h-8 w-12" />
            </span>
            <span className="text-xs font-medium text-brown">
              {PROJECTS.length} curated towers across Lahore
            </span>
          </div>
        </div>

        {/* Right: headline + CTA */}
        <div className="order-1 flex flex-col justify-center lg:order-2">
          <p className="font-serif text-lg italic text-gold-deep">
            Lahore commercial off-plan, made simple
          </p>

          <p
            dir="rtl"
            lang="ur"
            className="mt-3 text-left text-3xl font-bold leading-[2] text-ink sm:text-4xl"
            style={{ fontFamily: "var(--font-urdu)" }}
          >
            صاف بات، <span className="text-gold">بلند عمارت</span>
          </p>

          <h1 className="mt-3 font-sans text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            The project
            <br />
            that <span className="text-gold">fits</span>
            <br />
            you<span className="text-gold">.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-brown">
            Payment plans, possession timelines and approval status, laid bare.
            Tell us your budget, we&rsquo;ll match you to the towers worth your
            money.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={HERO_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-gold-deep"
            >
              <MessageCircle className="size-4" />
              Find my project on WhatsApp
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#projects"
              className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              Browse all projects
            </a>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-2 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-4">
            <Stat value={String(PROJECTS.length)} label="Live projects" />
            <Stat value={String(AREAS.length)} label="Areas covered" />
            <Stat value={priceBand} label="Price band (PKR M)" />
            <Stat value={possessionWindow} label="Possession window" />
          </div>
        </div>
      </div>
    </section>
  );
}
