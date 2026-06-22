"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "@/components/shared/Logo";
import { basePathFor, brandName } from "@/features/partners/partners";
import { usePartner } from "@/features/partners/usePartner";

const isExternal = (href: string) => href.startsWith("http");

export function Header() {
  const [open, setOpen] = useState(false);
  const partner = usePartner();
  const home = basePathFor(partner) || "/";
  const brand = brandName(partner);

  const ADVISOR_WHATSAPP = whatsappLink(
    `Hi ${brand}, I'd like to speak to an advisor about Pakistan off-plan investments.`,
    partner?.whatsapp
  );

  const NAV_LINKS = [
    { label: "Projects", href: "#projects" },
    { label: "Areas", href: "#areas" },
    { label: "Contact", href: ADVISOR_WHATSAPP },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      {partner?.accent && (
        <div style={{ height: 3, backgroundColor: partner.accent }} />
      )}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={home} aria-label={`${brand} home`}>
          {partner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <Logo className="flex items-center gap-2.5" />
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(isExternal(link.href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-sm font-medium text-brown transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={ADVISOR_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-gold-deep md:inline-flex"
        >
          <MessageCircle className="size-4" />
          Chat on WhatsApp
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-ink/10 bg-paper transition-[max-height] duration-300 md:hidden",
          open ? "max-h-80" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(isExternal(link.href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-brown transition-colors hover:bg-cream hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={ADVISOR_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-center text-sm font-medium text-paper transition-colors hover:bg-gold-deep"
          >
            <MessageCircle className="size-4" />
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
