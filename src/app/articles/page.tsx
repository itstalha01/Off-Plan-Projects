import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { CURVE_ARTICLE_DESCRIPTION, CURVE_ARTICLE_PATH, CURVE_ARTICLE_TITLE } from "@/features/articles/curve-brands";

export const metadata: Metadata = {
  title: "The Journal | Clearstoreys",
  description: "Stories about the places, brands and people shaping Lahore and Islamabad’s off-plan property landscape.",
  alternates: { canonical: "https://clearstoreys.com/articles" },
};

export default function ArticlesPage() {
  return <><header className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8"><Link href="/" aria-label="Clearstoreys home"><Logo className="flex items-center gap-2.5" /></Link></header><main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-20"><p className="text-xs tracking-[.18em] text-brown">THE CLEARSTOREYS JOURNAL</p><h1 className="mt-5 font-serif text-5xl tracking-tight sm:text-7xl">Places. People. Possibility.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-brown">A closer look at the addresses and ideas shaping what comes next.</p><Link href={CURVE_ARTICLE_PATH} className="group mt-14 grid overflow-hidden border border-ink/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:grid-cols-[1.2fr_1fr]"><div className="relative min-h-72"><Image src="/images/curve/gallery/01-facade-dusk.webp" alt="Architectural visualisation of Curve on Pine Avenue, Lahore" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" /></div><div className="flex flex-col justify-center p-7 sm:p-10"><p className="text-xs tracking-widest text-brown">01 / THE CURVE EDITION · 6 NOVEMBER 2026</p><h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">{CURVE_ARTICLE_TITLE}</h2><p className="mt-5 text-sm leading-7 text-brown">{CURVE_ARTICLE_DESCRIPTION}</p><span className="mt-8 flex items-center gap-3 text-sm font-semibold">Read the story <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span></div></Link></main><SiteFooter /></>;
}
