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
  /** The monthly the "Monthly installment" field starts from. In consolidated
   *  mode it's the smallest monthly that still completes by possession (a custom
   *  monthly can't go below it). In split mode it's the developer's own monthly,
   *  which the buyer can raise or lower. */
  requiredMonthly: number;
  /** True when a requested monthly was out of range and pulled back to the bound
   *  (raised to `requiredMonthly` in consolidated mode, capped at `maxMonthly`
   *  in split mode). */
  monthlyClamped: boolean;
  /** True when this is the split-monthly proposal: the developer's monthly line
   *  is kept and the higher installment (balloon / bi-annual / half-yearly /
   *  yearly) absorbs any change, so the two streams still cover the balance. */
  split: boolean;
  /** Split mode only: the largest monthly per-payment before the higher
   *  installment would be driven below zero (pool ÷ monthly count). */
  maxMonthly: number;
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

/** True when the plan has both a monthly stream and a higher installment
 *  (bi-annual / half-yearly / yearly / quarterly balloon). These get the
 *  split-monthly treatment: the monthly line is kept and the higher installment
 *  absorbs any change to it, instead of both being consolidated into one line. */
export function planHasHigherInstallment(plan: Plan): boolean {
  const hasMonthly = plan.installments.some((i) => cadenceMonths(i) === 1);
  const hasHigher = plan.installments.some((i) => cadenceMonths(i) > 1);
  return hasMonthly && hasHigher;
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
 * Shared backbone for the custom proposals: hold the developer's back-loaded
 * milestones fixed, clamp the requested down payment to what falls due before
 * possession, and return the remaining pool the installments must cover.
 */
function planBackbone(plan: Plan, total: number, requestedDown: number) {
  const backMilestones: MilestoneRow[] = plan.milestones
    .filter((m) => BACKLOADED_MILESTONE.test(m.label))
    .map((m) => ({ ...m, amount: (total * m.pct) / 100 }));
  const backAmount = backMilestones.reduce((sum, m) => sum + m.amount, 0);

  // The down payment can't exceed everything that falls due before possession.
  const maxDown = Math.max(0, total - backAmount);
  const downPayment = Math.min(Math.max(requestedDown, 0), maxDown);
  const clamped = requestedDown > maxDown;

  // The balance the installments must cover — everything that isn't the down
  // payment or a fixed back-loaded milestone.
  const pool = Math.max(0, total - downPayment - backAmount);
  return { backMilestones, downPayment, clamped, pool };
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
  // Back-loaded milestones stay fixed, down payment clamped, and the remaining
  // pool is what the consolidated installment must cover.
  const { backMilestones, downPayment, clamped, pool } = planBackbone(
    plan,
    total,
    requestedDown
  );
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
    split: false,
    maxMonthly: 0,
  };
}

/**
 * Build the split-monthly proposal for a plan that has both a monthly stream and
 * a higher installment (balloon / bi-annual / half-yearly / yearly). Unlike
 * `buildConsolidatedPlan`, this keeps the developer's two streams as separate
 * lines: the monthly line starts at the developer's amount (or a buyer-chosen
 * one) and the higher installment absorbs the difference, so raising the monthly
 * shrinks the higher payment while the two still cover the pre-possession
 * balance. The number of higher payments is unchanged — only their size moves.
 *
 * `requestedMonthly` is clamped to [0, pool ÷ monthly count]; above that ceiling
 * the higher installment would be driven negative.
 */
export function buildSplitMonthlyPlan(
  plan: Plan,
  total: number,
  requestedDown: number,
  requestedMonthly?: number | null
): CustomPlan {
  const { backMilestones, downPayment, clamped, pool } = planBackbone(
    plan,
    total,
    requestedDown
  );
  const fullyCovered = pool <= 0;

  const monthlyStreams = plan.installments.filter((i) => cadenceMonths(i) === 1);
  const higherStreams = plan.installments.filter((i) => cadenceMonths(i) > 1);
  const monthlyCount = monthlyStreams.reduce((n, i) => n + i.count, 0);
  const higherCount = higherStreams.reduce((n, i) => n + i.count, 0);

  // The developer's own monthly per-payment — the starting point the buyer can
  // raise or lower; the higher installment moves the opposite way.
  const devMonthlyTotal = monthlyStreams.reduce(
    (sum, i) => sum + (total * i.pct * i.count) / 100,
    0
  );
  const defaultMonthly = monthlyCount > 0 ? devMonthlyTotal / monthlyCount : 0;

  // Above this the higher installment would go negative, so cap the monthly here.
  const maxMonthly = monthlyCount > 0 ? pool / monthlyCount : 0;
  const monthlyPer = Math.min(
    Math.max(requestedMonthly ?? defaultMonthly, 0),
    maxMonthly
  );
  const monthlyClamped =
    requestedMonthly != null && requestedMonthly > maxMonthly + 1;

  const monthlyTotal = monthlyPer * monthlyCount;
  const higherTotal = Math.max(0, pool - monthlyTotal);
  const higherPer = higherCount > 0 ? higherTotal / higherCount : 0;

  const pct = (per: number) => (total > 0 ? (per / total) * 100 : 0);
  const payments = (n: number) => `${n} payment${n === 1 ? "" : "s"}`;
  const installments: InstallmentRow[] = [];
  // Drop a stream once it rounds to nothing (e.g. the buyer maxes the monthly,
  // fully absorbing the higher installment).
  if (!fullyCovered && monthlyCount > 0 && monthlyPer > 1) {
    installments.push({
      label: "Monthly installment",
      pct: pct(monthlyPer),
      count: monthlyCount,
      note: payments(monthlyCount),
      per: monthlyPer,
      streamTotal: monthlyTotal,
    });
  }
  if (!fullyCovered && higherCount > 0 && higherPer > 1) {
    installments.push({
      label: higherStreams[0].label,
      pct: pct(higherPer),
      count: higherCount,
      note: payments(higherCount),
      per: higherPer,
      streamTotal: higherTotal,
    });
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
    synthesized: false,
    count: monthlyCount,
    requiredMonthly: defaultMonthly,
    monthlyClamped,
    split: true,
    maxMonthly,
  };
}

/** Resolve a non-developer mode to its target cadence in months. */
export function modeCadenceMonths(mode: Exclude<PlanMode, "developer">): number {
  return TARGET_MONTHS[mode];
}
