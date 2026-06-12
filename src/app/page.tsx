import { MessageCircle } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Hero } from "@/features/projects/components/Hero";
import { FilterToolbar } from "@/features/projects/components/FilterToolbar";
import { ProjectGrid } from "@/features/projects/components/ProjectGrid";
import { whatsappLink } from "@/lib/whatsapp";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FilterToolbar />
        <ProjectGrid />
      </main>
      <footer className="border-t border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-serif text-xl font-semibold">
              Banaao<span className="text-gold">.</span>
            </p>
            <p className="mt-1 text-sm text-paper/60">
              Lahore off-plan investment, decoded.
            </p>
          </div>
          <a
            href={whatsappLink(
              "Hi Banaao, I'd like to talk about Lahore off-plan investment options."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper"
          >
            <MessageCircle className="size-4" />
            Chat on WhatsApp
          </a>
        </div>
      </footer>
    </>
  );
}
