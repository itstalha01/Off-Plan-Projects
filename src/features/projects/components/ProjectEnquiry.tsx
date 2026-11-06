"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { usePartner } from "@/features/partners/usePartner";
import { brandName } from "@/features/partners/partners";
import { whatsappLink } from "@/lib/whatsapp";
import type { Project } from "../types/project";

const OFFERS = [
  { label: "Get available units and latest prices", request: "Please send available units and latest prices" },
  { label: "Request a payment plan", request: "I'd like to request a payment plan" },
  { label: "Book a site visit", request: "I'd like to book a site visit" },
];

const SelectionContext = createContext<{
  unit: string;
  setUnit: (unit: string) => void;
} | null>(null);

function useEnquiryLink(project: Project, unit: string) {
  const partner = usePartner();
  return (request: string) => whatsappLink(
    `Hi ${brandName(partner)}, ${request} for ${project.name} (${project.dev}, ${project.area}, ${project.city})${unit ? ` — ${unit}` : ""}.`,
    partner?.whatsapp
  );
}

/** Share the calculator's current unit with the persistent mobile enquiry. */
export function ProjectEnquiryProvider({ project, children }: { project: Project; children: ReactNode }) {
  const [unit, setUnit] = useState("");
  const link = useEnquiryLink(project, unit);
  return (
    <SelectionContext.Provider value={{ unit, setUnit }}>
      {children}
      <div className="h-[calc(6.5rem+env(safe-area-inset-bottom))] sm:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <p className="mb-2 truncate text-center text-xs text-brown">{project.name}{unit ? ` · ${unit}` : ""}</p>
        <a href={link(OFFERS[0].request)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-3 py-3 text-center text-sm font-semibold text-ink hover:bg-gold-deep hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
          <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
          {OFFERS[0].label}
        </a>
      </div>
    </SelectionContext.Provider>
  );
}

export function ProjectEnquiry({ project, unit }: { project: Project; unit?: string }) {
  const selection = useContext(SelectionContext);
  const link = useEnquiryLink(project, unit ?? selection?.unit ?? "");
  return (
    <div className="flex flex-wrap gap-3" aria-label="Project enquiries">
      {OFFERS.map((offer, index) => (
        <a key={offer.label} href={link(offer.request)} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-sm font-semibold text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${index === 0 ? "bg-gold hover:bg-gold-deep hover:text-paper" : "border border-ink/20 hover:border-gold hover:bg-cream"}`}>
          {index === 0 && <MessageCircle aria-hidden="true" className="size-4 shrink-0" />}
          {offer.label}
        </a>
      ))}
    </div>
  );
}

export function useEnquiryUnit(unit: string) {
  const setUnit = useContext(SelectionContext)?.setUnit;
  useEffect(() => {
    setUnit?.(unit);
    return () => setUnit?.("");
  }, [setUnit, unit]);
}
