export type LdaStatus = "Approved" | "Pending" | "Verify";

export type ProjectType =
  | "Apartment"
  | "Res. Plot"
  | "Villa"
  | "Commercial"
  | "Residential";

/**
 * Unit configuration, derived from category names/groups — both residential
 * bedroom layouts (e.g. "Studio (Standard)", "3 Bed Penthouse") and commercial
 * unit types (e.g. "Corporate Offices", "Ground Floor · Shops"). Lets a
 * prospect narrow to projects that actually offer the unit they want.
 */
export type UnitConfig =
  // Residential
  | "Studio"
  | "1 Bed"
  | "2 Bed"
  | "3 Bed"
  | "4 Bed"
  | "Penthouse"
  // Commercial
  | "Corporate Office"
  | "Shop"
  | "Showroom"
  | "Kiosk"
  | "Food Court"
  | "Outlet";

/** Which family a `UnitConfig` belongs to — used to group the filter dropdown. */
export type UnitConfigGroup = "Residential" | "Commercial";

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

/** A headline stat shown on the "About the developer" panel (e.g. "19 yrs · Experience"). */
export type Stat = { value: string; label: string };

/**
 * The developer behind a project. Rendered natively in the site's brand on the
 * "About the developer" panel — we don't embed the developer's own brochure.
 * Shared across a developer's projects (keyed by developer name).
 */
export type Developer = {
  name: string;
  blurb: string; // 1–3 sentences, written in our voice
  stats?: Stat[]; // headline figures (years, projects delivered, etc.)
  trackRecord?: string[]; // notable past projects
};

/**
 * Marketing-facing description of the project itself, rendered natively.
 * `highlights` become pills (amenities / selling points).
 */
export type About = {
  description: string;
  highlights?: string[];
};

/** A single floor-plan drawing — shown as an image, with optional download. */
export type FloorPlan = {
  label: string; // e.g. "Tower 1 — Ground Floor"
  img: string; // path under /public
};

export type Project = {
  name: string;
  dev: string;
  city: string; // e.g. "Lahore", "Islamabad"
  area: string;
  type: ProjectType | ProjectType[]; // one or more (e.g. mixed-use)
  poss: string; // possession year e.g. "2027"
  lda: LdaStatus;
  plan: Plan; // payment plan (percentages of the total unit price)
  planNote?: string; // optional caveat shown with the plan (e.g. corner/MB factor)
  categories: Category[]; // one or more purchasable layouts
  img?: string; // optional cover photo path under /public
  gallery?: string[]; // optional extra images (renders) for the "About the project" panel
  developer?: Developer; // optional native "About the developer" content
  about?: About; // optional native "About the project" content
  floorPlans?: FloorPlan[]; // optional floor-plan drawings (shown as images)
  brochureUrl?: string; // optional link to the developer's official PDF brochure
};
