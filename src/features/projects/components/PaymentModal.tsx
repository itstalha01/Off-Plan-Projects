"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatPKR, formatRate } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { Category, Project } from "../types/project";
import { UnitSizeSlider } from "./UnitSizeSlider";

function advisorWhatsapp(
  project: Project,
  category: Category,
  size: number
): string {
  return whatsappLink(
    `Hi Clearstoreys, I'd like the full payment schedule and to book a viewing for ${project.name} (${project.dev}, ${project.area}), ${category.name}, roughly ${size.toLocaleString()} sqft.`
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
}: {
  c: Category;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors",
        active ? "border-gold bg-gold/10" : "border-ink/15 hover:border-ink/30"
      )}
    >
      <span className="text-sm font-semibold text-ink">{c.name}</span>
      <span className="text-xs text-brown">{formatRate(c.rate)}</span>
    </button>
  );
}

function PaymentCalculator({ project }: { project: Project }) {
  const single = project.categories.length === 1;
  const [catIndex, setCatIndex] = useState(single ? 0 : -1);
  const [size, setSize] = useState(
    single ? project.categories[0].sizes[0] : 0
  );

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
    setSize(project.categories[i].sizes[0]);
  }

  const total = category ? size * category.rate : 0;
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

  return (
    <div className="flex max-h-[68vh] flex-col overflow-y-auto pr-1">
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
                {size.toLocaleString()} sqft
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
                  onChange={setSize}
                />
                <div className="mt-2 flex justify-between">
                  {category.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        "text-[11px] font-medium transition-colors",
                        s === size
                          ? "text-gold-deep"
                          : "text-brown/60 hover:text-brown"
                      )}
                    >
                      {s.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-xl bg-cream/60 px-4">
            <Row
              label="Total unit price"
              sub={`${size.toLocaleString()} sqft × ${formatRate(category.rate)}`}
              value={formatPKR(total)}
              lead
            />
          </div>

          <div className="mt-1">
            {milestones.map((m) => (
              <Row
                key={m.label}
                label={m.label}
                sub={`${m.pct}% of total`}
                value={formatPKR(m.amount)}
              />
            ))}

            {installments.map((ins) => (
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
            split. Final pricing, taxes and schedule are confirmed by the
            developer at booking.
          </p>

          <a
            href={advisorWhatsapp(project, category, size)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper"
          >
            <MessageCircle className="size-4" />
            Request full schedule on WhatsApp
          </a>
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
          <PaymentCalculator key={project.name} project={project} />
        </DialogContent>
      )}
    </Dialog>
  );
}
