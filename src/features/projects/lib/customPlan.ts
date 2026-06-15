import type { Plan } from "../types/project";
import { BACKLOADED_MILESTONE, cadenceMonths } from "../constants/projects";

/** A milestone with its computed PKR amount (matches the calculator/PDF rows). */
export type MilestoneRow = { label: string; pct: number; amount: number };

/** An installment stream with derived per-payment and total amounts. */
export type InstallmentRow = {
  label: string;
  pct: number;
  count: number;
  note?: string;
  per: number;
  streamTotal: number;
};

/**
 * The plan the client is shown:
 * - "developer" — the developer's published split (the default).
 * - "monthly" / "quarterly" — a custom proposal: a (usually higher) down
 *   payment, the possession/handover milestones held fixed, and *everything
 *   recurring* (monthly, bi-annual, balloons, …) consolidated into a single
 *   installment at the chosen cadence over the developer's term.
 */
export type PlanMode = "developer" | "monthly" | "quarterly";

export type CustomPlan = {
  milestones: MilestoneRow[];
  installments: InstallmentRow[];
  /** The down payment actually applied (clamped to a feasible range). */
  downPayment: number;
  /** Implied share of the total unit price, e.g. 28.5 (%). */
  downPaymentPct: number;
  /** True when the typed amount was clamped down to the pre-possession balance. */
  clamped: boolean;
  /** True when the down payment covers the whole pre-possession balance, so no
   *  installments remain. */
  fullyCovered: boolean;
  /** True when the chosen cadence isn't the plan's own (e.g. forcing quarterly
   *  onto a monthly plan) — the schedule is converted over the same term. */
  synthesized: boolean;
  /** Number of regular installment payments in the result. */
  count: number;
  /** The smallest monthly that still completes by possession (= balance over the
   *  developer's term). A custom monthly can't go below this. */
  requiredMonthly: number;
  /** True when a requested monthly was below `requiredMonthly` and raised to it. */
  monthlyClamped: boolean;
};

const TARGET_MONTHS: Record<Exclude<PlanMode, "developer">, number> = {
  monthly: 1,
  quarterly: 3,
};

function cadenceLabel(months: number): string {
  if (months === 1) return "Monthly installment";
  if (months === 3) return "Quarterly installment";
  if (months === 6) return "Half-yearly installment";
  if (months === 12) return "Yearly installment";
  return "Installment";
}

/** The plan can be restructured only when it has at least one installment
 *  stream — that's what defines the term and gives us something to consolidate. */
export function planSupportsCustomDownPayment(plan: Plan): boolean {
  return plan.installments.length > 0;
}

/** Sum of the upfront (non-back-loaded) milestone percentages — the standard
 *  down payment expressed as a share of the total. */
function upfrontPct(plan: Plan): number {
  return plan.milestones
    .filter((m) => !BACKLOADED_MILESTONE.test(m.label))
    .reduce((sum, m) => sum + m.pct, 0);
}

/** Standard upfront down payment (PKR) for a given unit total. */
export function standardDownPayment(plan: Plan, total: number): number {
  return (total * upfrontPct(plan)) / 100;
}

/**
 * The plan's recurring term, taken from its dominant cadence — the cadence with
 * the most payments. Returns the span in months and that cadence, so a target
 * cadence can be expressed over the same term (e.g. 42 monthly → 14 quarterly).
 * Concurrent streams (a monthly line running alongside a half-yearly one) would
 * double-count if summed, so we measure a single dominant cadence instead.
 */
function recurringTerm(plan: Plan): { months: number; cadence: number } {
  const byCadence = new Map<number, number>();
  for (const ins of plan.installments) {
    const c = cadenceMonths(ins);
    byCadence.set(c, (byCadence.get(c) ?? 0) + ins.count);
  }
  let cadence = 1;
  let count = 0;
  for (const [c, cnt] of byCadence) {
    if (cnt > count) {
      count = cnt;
      cadence = c;
    }
  }
  return { months: cadence * count, cadence };
}

/**
 * Build a restructured payment plan for a custom down payment, consolidating the
 * recurring portion into a single stream at `targetMonths` cadence.
 *
 * The developer's back-loaded milestones (possession / handover / grey structure
 * / completion / final) are held fixed. The upfront milestones collapse into a
 * single "Down payment" line at the requested amount, and the entire remaining
 * pre-possession balance — every original installment and any balloon — is
 * spread evenly across the consolidated stream, so a larger down payment lowers
 * each payment without changing the term.
 *
 * `requestedDown` is clamped to [0, total − back-loaded milestones]; paying more
 * than that would leave the installments negative.
 */
export function buildConsolidatedPlan(
  plan: Plan,
  total: number,
  targetMonths: number,
  requestedDown: number,
  // Optional target per-payment. When given (monthly mode), the client pays this
  // amount each period and the term shortens to suit — but it can't go below the
  // amount needed to finish by possession, so the plan never runs long.
  requestedPer?: number | null
): CustomPlan {
  // Back-loaded milestones stay exactly as the developer set them.
  const backMilestones: MilestoneRow[] = plan.milestones
    .filter((m) => BACKLOADED_MILESTONE.test(m.label))
    .map((m) => ({ ...m, amount: (total * m.pct) / 100 }));
  const backAmount = backMilestones.reduce((sum, m) => sum + m.amount, 0);

  // The down payment can't exceed everything that falls due before possession.
  const maxDown = Math.max(0, total - backAmount);
  const downPayment = Math.min(Math.max(requestedDown, 0), maxDown);
  const clamped = requestedDown > maxDown;

  // The pool the consolidated installment must cover — the whole balance that
  // isn't the down payment or a fixed back-loaded milestone.
  const pool = Math.max(0, total - downPayment - backAmount);
  const fullyCovered = pool <= 0;

  const term = recurringTerm(plan);
  // Payments at the developer's term — the longest (and so cheapest-per-payment)
  // schedule. The required per-payment is the floor a custom amount can't dip below.
  const termCount = Math.max(1, Math.round(term.months / targetMonths));
  const synthesized = term.months > 0 && targetMonths !== term.cadence;
  const requiredPer = pool / termCount;

  const label = cadenceLabel(targetMonths);
  const row = (per: number, n: number): InstallmentRow => ({
    label,
    pct: total > 0 ? (per / total) * 100 : 0,
    count: n,
    note: `${n} payment${n === 1 ? "" : "s"}`,
    per,
    streamTotal: per * n,
  });

  // A custom per-payment shortens the term; without one, spread evenly over the
  // developer's term. Either way the payments sum exactly to the pool.
  let installments: InstallmentRow[] = [];
  let count = termCount;
  let monthlyClamped = false;

  if (!fullyCovered) {
    if (requestedPer != null) {
      const per = Math.max(requestedPer, requiredPer);
      monthlyClamped = requestedPer < requiredPer - 1;
      count = Math.max(1, Math.ceil(pool / per - 1e-6));
      const last = pool - per * (count - 1);
      if (count === 1) {
        installments = [row(pool, 1)];
      } else if (Math.abs(last - per) < 1) {
        installments = [row(per, count)];
      } else {
        // Whole payments at the chosen amount, then a smaller final balance.
        installments = [row(per, count - 1)];
        installments.push({
          label: "Final installment",
          pct: total > 0 ? (last / total) * 100 : 0,
          count: 1,
          note: "balance",
          per: last,
          streamTotal: last,
        });
      }
    } else {
      installments = [row(requiredPer, termCount)];
    }
  }

  const downPaymentPct = total > 0 ? (downPayment / total) * 100 : 0;
  const downMilestone: MilestoneRow = {
    label: "Down payment",
    pct: Math.round(downPaymentPct * 10) / 10,
    amount: downPayment,
  };

  return {
    milestones: [downMilestone, ...backMilestones],
    installments,
    downPayment,
    downPaymentPct,
    clamped,
    fullyCovered,
    synthesized,
    count,
    requiredMonthly: requiredPer,
    monthlyClamped,
  };
}

/** Resolve a non-developer mode to its target cadence in months. */
export function modeCadenceMonths(mode: Exclude<PlanMode, "developer">): number {
  return TARGET_MONTHS[mode];
}
