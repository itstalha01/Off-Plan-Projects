"use client";

import { useMemo, useState } from "react";
import { Download, MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatPKR, formatRate } from "@/lib/format";
import { whatsappLink, whatsappShareLink } from "@/lib/whatsapp";
import {
  downloadPaymentPlanPdf,
  paymentPlanPdfFile,
  type PaymentPlanPdf,
} from "@/lib/paymentPdf";
import type { Category, Project } from "../types/project";
import {
  MAX_DOWN_PAYMENT,
  MAX_ENTRY_PRICE,
  MAX_MONTHLY,
  MIN_DOWN_PAYMENT,
  MIN_ENTRY_PRICE,
  MIN_MONTHLY,
  unitInBudget,
  type BudgetFilter,
} from "../constants/projects";
import {
  buildConsolidatedPlan,
  modeCadenceMonths,
  planSupportsCustomDownPayment,
  standardDownPayment,
  type PlanMode,
} from "../lib/customPlan";
import { useBudgetFilter } from "../hooks/useBudgetFilter";
import { UnitSizeSlider } from "./UnitSizeSlider";

type BudgetMode = BudgetFilter["budgetMode"];

// Does the window actually constrain anything (vs. the wide-open "Any")? Mirrors
// the grid's budget summary: only the active price/down lens plus monthly count.
function budgetConstrains(b: BudgetFilter): boolean {
  const priceSide =
    b.budgetMode === "down"
      ? b.minDownPayment > MIN_DOWN_PAYMENT || b.maxDownPayment < MAX_DOWN_PAYMENT
      : b.minEntryPrice > MIN_ENTRY_PRICE || b.maxEntryPrice < MAX_ENTRY_PRICE;
  const monthlySide = b.minMonthly > MIN_MONTHLY || b.maxMonthly < MAX_MONTHLY;
  return priceSide || monthlySide;
}

// The store's max for a lens, expressed as a PKR string for the modal's input
// (price/down are kept in millions; monthly is already raw PKR). "" when open.
function seedMax(mode: BudgetMode, b: BudgetFilter): string {
  if (mode === "down") {
    return b.maxDownPayment < MAX_DOWN_PAYMENT
      ? String(Math.round(b.maxDownPayment * 1_000_000))
      : "";
  }
  return b.maxEntryPrice < MAX_ENTRY_PRICE
    ? String(Math.round(b.maxEntryPrice * 1_000_000))
    : "";
}

function advisorWhatsapp(
  project: Project,
  category: Category,
  size: number,
  rate: number
): string {
  const ratePart =
    rate !== category.rate ? ` at a custom rate of ${formatRate(rate)}` : "";
  return whatsappLink(
    `Hi Clearstoreys, I'd like the full payment schedule and to book a viewing for ${project.name} (${project.dev}, ${project.area}), ${category.name}, roughly ${size.toLocaleString()} sqft${ratePart}.`
  );
}

/** Parse a free-typed override field; returns null unless it's a positive number. */
function parsePositive(input: string): number | null {
  const n = Number(input);
  return input.trim() !== "" && Number.isFinite(n) && n > 0 ? n : null;
}

function CustomNumberField({
  label,
  suffix,
  placeholder,
  value,
  onChange,
  active,
}: {
  label: string;
  suffix: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  active: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors",
        active ? "border-gold bg-gold/10" : "border-ink/15"
      )}
    >
      <span className="shrink-0 text-xs font-medium text-brown">{label}</span>
      <span className="flex min-w-0 flex-1 items-baseline justify-end gap-1">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-right text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-brown/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:text-sm"
        />
        <span className="shrink-0 text-xs text-brown/60">{suffix}</span>
      </span>
    </label>
  );
}

function Row({
  label,
  value,
  sub,
  lead = false,
}: {
  label: string;
  value: string;
  sub?: string;
  lead?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-3",
        lead ? "" : "border-t border-ink/10"
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-brown">{label}</span>
        {sub && <span className="text-xs text-brown/70">{sub}</span>}
      </div>
      <span
        className={cn(
          lead
            ? "font-serif text-2xl font-semibold text-gold-deep"
            : "text-sm font-semibold text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function CategoryButton({
  c,
  active,
  onSelect,
  fit,
}: {
  c: Category;
  active: boolean;
  onSelect: () => void;
  // How many of this category's sizes fall inside the budget · undefined when no
  // budget is set (so no fit line is shown).
  fit?: { n: number; total: number };
}) {
  const dim = fit != null && fit.n === 0 && !active;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors",
        active ? "border-gold bg-gold/10" : "border-ink/15 hover:border-ink/30",
        dim && "opacity-50"
      )}
    >
      <span className="text-sm font-semibold text-ink">{c.name}</span>
      <span className="text-xs text-brown">{formatRate(c.rate)}</span>
      {fit && (
        <span
          className={cn(
            "mt-0.5 text-[10px] font-semibold uppercase tracking-wide",
            fit.n > 0 ? "text-gold-deep" : "text-brown/50"
          )}
        >
          {fit.n > 0 ? `${fit.n} of ${fit.total} fit budget` : "None in budget"}
        </span>
      )}
    </button>
  );
}

export function PaymentCalculator({
  project,
  // The modal renders this inside a fixed-height dialog, so it caps the height
  // and scrolls internally. On the dedicated payment page we want it to flow at
  // full height instead, so the whole plan is visible before Related projects.
  scrollContained = false,
}: {
  project: Project;
  scrollContained?: boolean;
}) {
  const single = project.categories.length === 1;
  const [catIndex, setCatIndex] = useState(single ? 0 : -1);
  const [size, setSize] = useState(
    single ? project.categories[0].sizes[0] : 0
  );
  // Free-typed overrides for off-plan sizes / revised (old) rates.
  const [customSize, setCustomSize] = useState("");
  const [customRate, setCustomRate] = useState("");
  // Which plan the client is viewing — the developer's published split, or a
  // custom proposal consolidated to monthly / quarterly installments.
  const [planMode, setPlanMode] = useState<PlanMode>("developer");
  // Free-typed custom down payment (PKR) for the custom modes. Empty falls back
  // to the standard down payment, so a mode is meaningful before any typing.
  const [customDown, setCustomDown] = useState("");
  // Free-typed target monthly (PKR) for Custom · Monthly. Empty spreads over the
  // developer's term; a higher amount shortens it. Can't go below what's required.
  const [customMonthly, setCustomMonthly] = useState("");
  // Optional buyer name — personalises the shared/downloaded PDF. Kept across
  // category changes since it belongs to the buyer, not the selected unit.
  const [buyerName, setBuyerName] = useState("");

  // Client budget — seeded from the grid filter the client already set, then
  // editable here so the consultant can tweak it per project. It drives the
  // "fits budget" highlighting on categories and sizes below; it does NOT change
  // the quoted prices. Inputs are in PKR (matching the prices on screen).
  const storeBudget = useBudgetFilter();
  const [budgetMode, setBudgetModeLocal] = useState<BudgetMode>(
    storeBudget.budgetMode
  );
  const [maxBudget, setMaxBudget] = useState(() =>
    seedMax(storeBudget.budgetMode, storeBudget)
  );
  const [maxMonthlyBudget, setMaxMonthlyBudget] = useState(() =>
    storeBudget.maxMonthly < MAX_MONTHLY ? String(storeBudget.maxMonthly) : ""
  );

  // Switching lens re-seeds the max from the store, since the figure's scale and
  // meaning change between total price and down payment.
  function switchBudgetMode(m: BudgetMode) {
    setBudgetModeLocal(m);
    setMaxBudget(seedMax(m, storeBudget));
  }

  const parsedMaxBudget = parsePositive(maxBudget);
  const parsedMaxMonthly = parsePositive(maxMonthlyBudget);

  // The window the matcher reads. Min bounds carry over from the grid filter; the
  // editable max for the active lens (and the monthly cap) override the store.
  const budget = useMemo<BudgetFilter>(
    () => ({
      budgetMode,
      minEntryPrice:
        budgetMode === "price" ? storeBudget.minEntryPrice : MIN_ENTRY_PRICE,
      maxEntryPrice:
        budgetMode === "price" && parsedMaxBudget != null
          ? parsedMaxBudget / 1_000_000
          : MAX_ENTRY_PRICE,
      minDownPayment:
        budgetMode === "down" ? storeBudget.minDownPayment : MIN_DOWN_PAYMENT,
      maxDownPayment:
        budgetMode === "down" && parsedMaxBudget != null
          ? parsedMaxBudget / 1_000_000
          : MAX_DOWN_PAYMENT,
      minMonthly: storeBudget.minMonthly,
      maxMonthly: parsedMaxMonthly != null ? parsedMaxMonthly : MAX_MONTHLY,
    }),
    [budgetMode, parsedMaxBudget, parsedMaxMonthly, storeBudget]
  );

  const budgetActive = budgetConstrains(budget);

  // Roll-up across the whole project for the budget panel's one-line summary.
  const fitSummary = useMemo(() => {
    let units = 0;
    let cats = 0;
    for (const c of project.categories) {
      const n = c.sizes.filter((s) =>
        unitInBudget(project, s * c.rate, budget)
      ).length;
      units += n;
      if (n > 0) cats += 1;
    }
    return { units, cats };
  }, [project, budget]);

  // Sizes within a category that fit the budget (at the category's published
  // rate). The selected category also re-checks against any custom rate below.
  const categoryFit = (c: Category) => {
    let n = 0;
    for (const s of c.sizes) if (unitInBudget(project, s * c.rate, budget)) n++;
    return { n, total: c.sizes.length };
  };

  // First size in a category that fits the budget, so selecting a category lands
  // on an affordable unit rather than its smallest (which may be out of range).
  const firstFittingSize = (c: Category) =>
    (budgetActive && c.sizes.find((s) => unitInBudget(project, s * c.rate, budget))) ||
    c.sizes[0];

  const category = catIndex >= 0 ? project.categories[catIndex] : null;

  // When categories carry a `group` (e.g. floor), render them grouped in
  // declaration order; otherwise fall back to a flat grid.
  const groups = useMemo(() => {
    if (!project.categories.some((c) => c.group)) return null;
    const out: { group: string; items: { c: Category; i: number }[] }[] = [];
    project.categories.forEach((c, i) => {
      const g = c.group ?? "Other";
      const last = out[out.length - 1];
      if (last && last.group === g) last.items.push({ c, i });
      else out.push({ group: g, items: [{ c, i }] });
    });
    return out;
  }, [project]);

  function selectCategory(i: number) {
    setCatIndex(i);
    setSize(firstFittingSize(project.categories[i]));
    setCustomSize("");
    setCustomRate("");
    setCustomDown("");
    setCustomMonthly("");
    setPlanMode("developer");
  }

  // The target monthly only applies to Custom · Monthly; drop it when leaving.
  function selectMode(mode: PlanMode) {
    setPlanMode(mode);
    if (mode !== "monthly") setCustomMonthly("");
  }

  // Picking a listed size clears any custom size so the two never conflict.
  function pickSize(s: number) {
    setSize(s);
    setCustomSize("");
  }

  // A typed override wins over the published value, letting a consultant quote
  // an off-plan size or an old/revised rate. Everything below derives from these.
  const parsedSize = parsePositive(customSize);
  const parsedRate = parsePositive(customRate);
  const effectiveSize = parsedSize ?? size;
  const effectiveRate = category ? parsedRate ?? category.rate : 0;

  const total = category ? effectiveSize * effectiveRate : 0;
  const fixedSize = category ? category.sizes.length === 1 : false;

  const milestones = useMemo(
    () =>
      project.plan.milestones.map((m) => ({
        ...m,
        amount: (total * m.pct) / 100,
      })),
    [project, total]
  );

  const installments = useMemo(
    () =>
      project.plan.installments.map((ins) => {
        const per = (total * ins.pct) / 100;
        return { ...ins, per, streamTotal: per * ins.count };
      }),
    [project, total]
  );

  // Custom modes are only offered for plans that have installments to
  // consolidate. Each builds a proposal at the chosen cadence; an empty down
  // payment field falls back to the standard down payment.
  const supportsCustom = planSupportsCustomDownPayment(project.plan);
  const parsedDown = parsePositive(customDown);
  const parsedMonthly = parsePositive(customMonthly);
  const customPlan = useMemo(() => {
    if (planMode === "developer" || total <= 0) return null;
    const down = parsedDown ?? standardDownPayment(project.plan, total);
    // The target monthly only applies to the monthly cadence.
    const per = planMode === "monthly" ? parsedMonthly : null;
    return buildConsolidatedPlan(
      project.plan,
      total,
      modeCadenceMonths(planMode),
      down,
      per
    );
  }, [project, total, planMode, parsedDown, parsedMonthly]);

  // Rows actually rendered / exported — custom when active, else the standard split.
  const shownMilestones = customPlan ? customPlan.milestones : milestones;
  const shownInstallments = customPlan ? customPlan.installments : installments;

  // Plan-mode options offered for this project (developer always; custom modes
  // only when there's a recurring portion to restructure).
  const planModes: { mode: PlanMode; label: string }[] = supportsCustom
    ? [
        { mode: "developer", label: "Developer's plan" },
        { mode: "monthly", label: "Custom · Monthly" },
        { mode: "quarterly", label: "Custom · Quarterly" },
      ]
    : [{ mode: "developer", label: "Developer's plan" }];

  function pdfData(c: Category): PaymentPlanPdf {
    return {
      project,
      category: c,
      size: effectiveSize,
      rate: effectiveRate,
      total,
      milestones: shownMilestones,
      installments: shownInstallments,
      buyerName: buyerName.trim() || undefined,
      custom: customPlan != null,
    };
  }

  // Share the payment plan with the client over WhatsApp. On phones (where the
  // consultant has WhatsApp), the native share sheet attaches the actual PDF and
  // lets them pick the client. WhatsApp's URL scheme can't attach files, so on
  // desktop / unsupported browsers we download the PDF and open WhatsApp with a
  // prefilled message for the consultant to attach manually.
  async function shareViaWhatsApp(c: Category) {
    const data = pdfData(c);
    const buyer = buyerName.trim();
    const greeting = buyer ? `Hi ${buyer}, here is your ` : "";
    const planKind = customPlan ? "custom" : "indicative";
    const downPart = customPlan
      ? ` Down payment ${formatPKR(customPlan.downPayment)}.`
      : "";
    const summary =
      `${greeting}${planKind} payment plan — ${project.name} (${c.name}, ` +
      `${effectiveSize.toLocaleString()} sqft). Total ${formatPKR(
        total
      )}.${downPart}`;

    try {
      const file = paymentPlanPdfFile(data);
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Payment plan — ${project.name}`,
          text: summary,
        });
        return;
      }
    } catch (err) {
      // User dismissed the share sheet — don't fall through to the download.
      if ((err as Error)?.name === "AbortError") return;
    }

    downloadPaymentPlanPdf(data);
    window.open(whatsappShareLink(summary), "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className={
        scrollContained
          ? "flex max-h-[68vh] flex-col overflow-y-auto pr-1"
          : "flex flex-col"
      }
    >
      {/* Client budget — seeded from the grid filter, editable here. Highlights
          which categories & sizes fit; doesn't change the quoted prices. */}
      <div className="mt-2 rounded-xl border border-ink/15 bg-cream/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
            Client budget
          </span>
          <div className="inline-flex rounded-lg border border-ink/15 bg-paper p-0.5">
            {(
              [
                ["price", "Total price"],
                ["down", "Down payment"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => switchBudgetMode(m)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  budgetMode === m ? "bg-gold text-ink" : "text-brown hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CustomNumberField
            label={budgetMode === "price" ? "Max price" : "Max down"}
            suffix="PKR"
            placeholder="Any"
            value={maxBudget}
            onChange={setMaxBudget}
            active={parsedMaxBudget != null}
          />
          <CustomNumberField
            label="Max monthly"
            suffix="PKR"
            placeholder="Any"
            value={maxMonthlyBudget}
            onChange={setMaxMonthlyBudget}
            active={parsedMaxMonthly != null}
          />
        </div>

        <p className="mt-2 text-xs text-brown/70">
          {budgetActive
            ? `${fitSummary.units} unit${
                fitSummary.units === 1 ? "" : "s"
              } across ${fitSummary.cats} categor${
                fitSummary.cats === 1 ? "y" : "ies"
              } fit this budget — highlighted below.`
            : "Set a max to highlight the sizes that fit across every category."}
        </p>
      </div>

      {/* Step 1 — choose a category (only when there is more than one) */}
      {!single && (
        <div className="mt-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
            Choose a category
          </span>
          {groups ? (
            <div className="mt-3 flex flex-col gap-4">
              {groups.map(({ group, items }) => (
                <div key={group}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                    {group}
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {items.map(({ c, i }) => (
                      <CategoryButton
                        key={i}
                        c={c}
                        active={i === catIndex}
                        onSelect={() => selectCategory(i)}
                        fit={budgetActive ? categoryFit(c) : undefined}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {project.categories.map((c, i) => (
                <CategoryButton
                  key={i}
                  c={c}
                  active={i === catIndex}
                  onSelect={() => selectCategory(i)}
                  fit={budgetActive ? categoryFit(c) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — size + breakdown (after a category is selected) */}
      {category ? (
        <>
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
                {single ? "Unit size" : `${category.name} · size`}
              </span>
              <span className="font-serif text-lg font-semibold text-ink">
                {effectiveSize.toLocaleString()} sqft
              </span>
            </div>

            {fixedSize ? (
              <p className="mt-3 text-xs text-brown">
                Fixed unit size for this category.
              </p>
            ) : (
              <div className="mt-4">
                <UnitSizeSlider
                  sizes={category.sizes}
                  value={size}
                  onChange={pickSize}
                />
                <div className="mt-2 flex justify-between">
                  {category.sizes.map((s) => {
                    const outOfBudget =
                      budgetActive &&
                      !unitInBudget(project, s * effectiveRate, budget);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => pickSize(s)}
                        title={outOfBudget ? "Outside budget" : undefined}
                        className={cn(
                          "text-[11px] font-medium transition-colors",
                          s === size && !parsedSize
                            ? "text-gold-deep"
                            : "text-brown/60 hover:text-brown",
                          outOfBudget && s !== size && "opacity-40 line-through"
                        )}
                      >
                        {s.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom size — quote a sqft that isn't in the published list. */}
            <div className="mt-4">
              <CustomNumberField
                label="Custom size"
                suffix="sqft"
                placeholder={size ? size.toLocaleString() : "Enter sqft"}
                value={customSize}
                onChange={setCustomSize}
                active={parsedSize != null}
              />
            </div>
          </div>

          {/* Custom rate — quote on an old/revised rate per sqft. */}
          <div className="mt-5">
            <CustomNumberField
              label="Custom rate"
              suffix="/sqft"
              placeholder={category.rate.toLocaleString()}
              value={customRate}
              onChange={setCustomRate}
              active={parsedRate != null}
            />
          </div>

          {/* Plan options — the developer's published split, or a custom
              proposal that consolidates the recurring portion to a single
              monthly / quarterly installment. Only when there's a recurring
              portion to restructure. */}
          {supportsCustom && (
            <div className="mt-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
                Payment plan
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {planModes.map(({ mode, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => selectMode(mode)}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-center text-xs font-semibold transition-colors",
                      mode === planMode
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-ink/15 text-brown hover:border-ink/30"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom down payment — drives the consolidated proposal. A larger
              upfront amount lowers every installment over the same term. */}
          {planMode !== "developer" && (
            <div className="mt-3">
              <CustomNumberField
                label="Down payment"
                suffix="PKR"
                placeholder={Math.round(
                  standardDownPayment(project.plan, total)
                ).toLocaleString()}
                value={customDown}
                onChange={setCustomDown}
                active={parsedDown != null}
              />
              {customPlan && (
                <p className="mt-1.5 text-xs text-brown/70">
                  {customPlan.clamped
                    ? `Capped at ${formatPKR(
                        customPlan.downPayment
                      )} — the full balance due before possession. `
                    : ""}
                  {customPlan.fullyCovered
                    ? "Covers everything up to possession — no installments remain."
                    : `${customPlan.downPaymentPct.toFixed(1)}% down · ${
                        customPlan.count
                      } ${planMode} payments${
                        customPlan.synthesized
                          ? ` (converted to ${planMode} over the same term)`
                          : ""
                      }.`}
                </p>
              )}
            </div>
          )}

          {/* Target monthly — only for Custom · Monthly. Paying more per month
              finishes sooner; it can't go below the amount required to complete
              by possession (so the schedule never runs past the developer's term). */}
          {planMode === "monthly" && customPlan && !customPlan.fullyCovered && (
            <div className="mt-3">
              <CustomNumberField
                label="Monthly installment"
                suffix="PKR"
                placeholder={Math.round(
                  customPlan.requiredMonthly
                ).toLocaleString()}
                value={customMonthly}
                onChange={setCustomMonthly}
                active={parsedMonthly != null && !customPlan.monthlyClamped}
              />
              <p className="mt-1.5 text-xs text-brown/70">
                {customPlan.monthlyClamped
                  ? `Minimum ${formatPKR(
                      customPlan.requiredMonthly
                    )}/month — the least that still finishes by possession.`
                  : parsedMonthly != null
                  ? `${formatPKR(
                      customPlan.installments[0]?.per ?? 0
                    )}/month · finishes in ${customPlan.count} payments.`
                  : `Minimum ${formatPKR(
                      customPlan.requiredMonthly
                    )}/month. Enter more to finish sooner.`}
              </p>
            </div>
          )}

          <div className="mt-3 rounded-xl bg-cream/60 px-4">
            <Row
              label="Total unit price"
              sub={`${effectiveSize.toLocaleString()} sqft × ${formatRate(
                effectiveRate
              )}`}
              value={formatPKR(total)}
              lead
            />
          </div>

          <div className="mt-1">
            {shownMilestones.map((m) => (
              <Row
                key={m.label}
                label={m.label}
                sub={`${m.pct}% of total`}
                value={formatPKR(m.amount)}
              />
            ))}

            {shownInstallments.map((ins) => (
              <Row
                key={ins.label}
                label={ins.label}
                sub={`${ins.note ?? `${ins.pct}% × ${ins.count}`} · ${formatPKR(
                  ins.streamTotal
                )} total`}
                value={`${formatPKR(ins.per)} × ${ins.count}`}
              />
            ))}
          </div>

          {project.planNote && (
            <p className="mt-4 rounded-lg bg-gold/10 px-3 py-2 text-xs leading-relaxed text-gold-deep">
              {project.planNote}
            </p>
          )}

          <p className="mt-4 text-xs leading-relaxed text-brown/70">
            Figures are indicative and derived from the published rate and plan
            split.{" "}
            {customPlan
              ? "This custom split is a proposal subject to developer approval. "
              : ""}
            Final pricing, taxes and schedule are confirmed by the developer at
            booking.
          </p>

          <label className="mt-5 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
              Buyer name
              <span className="ml-1.5 font-normal normal-case tracking-normal text-brown/60">
                optional · prints on the PDF
              </span>
            </span>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g. Ahmed Khan"
              className="h-11 w-full rounded-xl border border-ink/15 bg-paper px-3 text-base font-medium text-ink outline-none transition-colors placeholder:font-normal placeholder:text-brown/40 hover:border-ink/30 focus:border-gold focus:ring-2 focus:ring-gold/30 sm:text-sm"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={advisorWhatsapp(
                project,
                category,
                effectiveSize,
                effectiveRate
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper"
            >
              <MessageCircle className="size-4" />
              Connect to the advisor
            </a>
            <button
              type="button"
              onClick={() => shareViaWhatsApp(category)}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1da851]"
            >
              <Send className="size-4" />
              Share via WhatsApp
            </button>
            <button
              type="button"
              onClick={() => downloadPaymentPlanPdf(pdfData(category))}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/20 px-5 text-sm font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-cream/60"
            >
              <Download className="size-4" />
              Download payment plan (PDF)
            </button>
          </div>
        </>
      ) : (
        <p className="mt-5 rounded-xl bg-cream/60 px-4 py-6 text-center text-sm text-brown">
          Select a category above to view sizes and the payment plan.
        </p>
      )}
    </div>
  );
}

type PaymentModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function PaymentModal({ project, onClose }: PaymentModalProps) {
  return (
    <Dialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {project && (
        <DialogContent aria-modal className="max-w-lg sm:max-w-lg">
          <DialogTitle className="pr-8 font-serif text-2xl font-semibold text-ink">
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-brown">
            {project.dev} · {project.area}
          </DialogDescription>
          <PaymentCalculator
            key={project.name}
            project={project}
            scrollContained
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
