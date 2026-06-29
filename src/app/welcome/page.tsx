import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/shared/Logo";
import { LeadCaptureForm } from "@/features/landing/LeadCaptureForm";
import { GoogleAdsTag } from "@/features/landing/GoogleAdsTag";

export const metadata: Metadata = {
  title: "Find your Pakistan off-plan project · Clearstoreys",
  description:
    "Tell us your budget and we'll match you to Pakistan commercial off-plan towers worth your money — payment plans, possession timelines and approval status, laid bare.",
  // A campaign landing page: keep it out of the search index so it doesn't
  // compete with the main portal, but let ad crawlers follow links.
  robots: { index: false, follow: true },
};

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-full flex-col overflow-hidden bg-paper">
      <GoogleAdsTag />
      {/* Slim brand bar — no nav, so the page stays focused on the one action. */}
      <header className="mx-auto flex w-full max-w-6xl items-center px-5 py-6 sm:px-8">
        <Logo className="flex items-center gap-2.5" />
      </header>

      {/* Mobile stacks headline → form → image so the form is reachable without a
          long scroll. On desktop, explicit grid placement keeps the headline and
          tower photo in the left column with the form spanning the right. */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid lg:grid-cols-[1fr_minmax(0,440px)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16 lg:gap-y-10 lg:pb-24">
        {/* The pitch */}
        <div className="flex flex-col justify-center lg:col-start-1 lg:row-start-1">
          <p className="font-serif text-lg italic text-gold-deep">
            Pakistan commercial off-plan, made simple
          </p>

          <h1 className="mt-3 font-sans text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
            The project
            <br />
            that <span className="text-gold">fits</span> you
            <span className="text-gold">.</span>
          </h1>

          <p
            dir="rtl"
            lang="ur"
            className="mt-6 text-left text-3xl font-bold leading-[2] text-ink sm:text-4xl"
            style={{ fontFamily: "var(--font-urdu)" }}
          >
            صاف بات، <span className="text-gold">بلند عمارت</span>
          </p>
        </div>

        {/* The lead form */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-8">
          <LeadCaptureForm />
        </div>

        {/* Tower photo — looking up at off-plan high-rises, echoing بلند عمارت. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-ink/10 shadow-xl shadow-ink/5 lg:col-start-1 lg:row-start-2 lg:aspect-auto lg:h-full">
          <Image
            src="/images/welcome-towers.webp"
            alt="Looking up at a cluster of glass commercial towers against a bright sky"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
