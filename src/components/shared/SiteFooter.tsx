"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";
import { brandName } from "@/features/partners/partners";
import { usePartner } from "@/features/partners/usePartner";

export function SiteFooter({ whatsappMessage }: { whatsappMessage?: string } = {}) {
  const partner = usePartner();
  const brand = brandName(partner);

  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-serif text-xl font-semibold">
            {brand}
            <span className="text-gold">.</span>
          </p>
          <p className="mt-1 text-sm text-paper/60">
            {partner
              ? "Powered by Clearstoreys · Pakistan commercial off-plan."
              : "Compare off-plan property in Lahore & Islamabad."}
          </p>
          <Link href="/articles" className="mt-3 mr-5 inline-block text-sm text-paper/80 underline underline-offset-4 hover:text-paper">
            The Journal
          </Link>
          <Link
            href="/privacy-policy"
            className="mt-3 inline-block text-sm text-paper/80 underline underline-offset-4 hover:text-paper"
          >
            Privacy policy
          </Link>
        </div>
        <a
          href={whatsappLink(
            whatsappMessage ?? `Hi ${brand}, I'd like to talk about Pakistan off-plan investment options.`,
            partner?.whatsapp
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          <MessageCircle className="size-4" />
          Chat on WhatsApp
        </a>
      </div>
    </footer>
  );
}
