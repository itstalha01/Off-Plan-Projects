export type LdaStatus = "Approved" | "Pending" | "Verify";

export type ProjectType =
  | "Apartment"
  | "Res. Plot"
  | "Villa"
  | "Commercial"
  | "Residential";

/**
 * A purchasable layout within a project (e.g. "Ground Floor", "Offices").
 * Price is linear within a category: total = size × rate.
 * `sizes` is an explicit, ascending list — the size slider snaps ONLY to
 * these values (they may be unevenly spaced).
 */
export type Category = {
  name: string; // e.g. "Ground & Mezzanine", "Office 3 to 7 Floor"
  rate: number; // PKR per sqft
  sizes: number[]; // allowed sqft sizes, ascending — slider snaps to these
  group?: string; // optional grouping (e.g. floor) for the modal's category list
};

/** A one-off payment milestone, expressed as a % of the total unit price. */
export type Milestone = { label: string; pct: number };

/**
 * A recurring installment stream — `pct`% of the total per single payment,
 * paid `count` times. The per-payment amount is derived (total × pct%), so it
 * changes whenever the chosen category/size changes.
 */
export type Installment = {
  label: string; // e.g. "Monthly installment"
  pct: number; // percent of total per single payment
  count: number; // number of payments
  note?: string; // cadence note e.g. "1% × 30 months"
};

/** Payment plan, shared across all categories in a project. All % of total. */
export type Plan = {
  milestones: Milestone[];
  installments: Installment[];
};

export type Project = {
  name: string;
  dev: string;
  area: string;
  type: ProjectType | ProjectType[]; // one or more (e.g. mixed-use)
  poss: string; // possession year e.g. "2027"
  lda: LdaStatus;
  plan: Plan; // payment plan (percentages of the total unit price)
  planNote?: string; // optional caveat shown with the plan (e.g. corner/MB factor)
  categories: Category[]; // one or more purchasable layouts
  img?: string; // optional cover photo path under /public
};
