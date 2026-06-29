"use client";

import { useState } from "react";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { trackLeadConversion } from "./gtag";

// Budget bands phrased in the Pakistani crore/lakh convention, aligned with the
// portal's entry-price band. All optional — "Not sure yet" lets a prospect submit
// without committing to a number, since filling the form isn't mandatory.
const BUDGET_OPTIONS = [
  "Under PKR 1 Cr",
  "PKR 1 – 2.5 Cr",
  "PKR 2.5 – 5 Cr",
  "PKR 5 – 10 Cr",
  "PKR 10 Cr+",
  "Not sure yet",
] as const;

const fieldClass =
  "h-12 w-full rounded-xl border border-ink/15 bg-paper px-4 text-base font-medium text-ink outline-none transition-colors placeholder:font-normal placeholder:text-brown/60 focus:border-gold focus:ring-2 focus:ring-gold/30";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-brown";

// Hands the lead to the Clearstoreys WhatsApp advisor with whatever the prospect
// filled in — there's no backend here, so WhatsApp is the collection channel.
// Nothing is required: an empty form still opens a sensible "I saw your ad" chat.
function buildAdvisorMessage(name: string, phone: string, budget: string) {
  const lines = [
    "Hi Clearstoreys, I saw your ad and I'd like help finding a Pakistan off-plan project.",
    name.trim() && `Name: ${name.trim()}`,
    phone.trim() && `Phone: ${phone.trim()}`,
    budget && `Budget: ${budget}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function LeadCaptureForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const advisorLink = whatsappLink(buildAdvisorMessage(name, phone, budget));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Count the lead as a Google Ads conversion (no-ops if tracking isn't
    // configured) before handing off to WhatsApp.
    trackLeadConversion();
    // Open the advisor chat in a new tab; show the confirmation state regardless
    // so a blocked popup still leaves the prospect a tap-through link.
    window.open(advisorLink, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-ink/10 bg-paper p-8 text-center shadow-xl shadow-ink/5 sm:p-10">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <Check className="size-7" />
        </span>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            You&rsquo;re all set{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}
            <span className="text-gold">.</span>
          </h2>
          <p className="text-sm leading-relaxed text-brown">
            We&rsquo;ve opened WhatsApp so an advisor can match you to the towers
            worth your money. If it didn&rsquo;t open, tap below.
          </p>
        </div>
        <a
          href={advisorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-gold-deep"
        >
          <MessageCircle className="size-4" />
          Open WhatsApp
        </a>
        <a
          href="/"
          className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          Browse all projects instead
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-xl shadow-ink/5 sm:p-8"
    >
      <h2 className="font-serif text-2xl font-semibold text-ink">
        Get matched in a minute
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-brown">
        Tell us a little about you and an advisor will reach out. No pressure,
        nothing required.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-name" className={labelClass}>
            Name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-phone" className={labelClass}>
            Phone / WhatsApp
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 3XX XXXXXXX"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-budget" className={labelClass}>
            Budget
          </label>
          <select
            id="lead-budget"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`${fieldClass} ${budget ? "text-ink" : "text-brown/60"}`}
          >
            <option value="">Select a budget</option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="text-ink">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper"
      >
        <MessageCircle className="size-4" />
        Talk to an advisor
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>

      <p className="mt-3 text-center text-xs text-brown">
        We&rsquo;ll only use your details to help with your property search.
      </p>
    </form>
  );
}
