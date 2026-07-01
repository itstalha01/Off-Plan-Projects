// White-label partners (agencies) that embed Clearstoreys on their own site.
// Each partner sees a curated subset of the catalogue, gets their own logo and
// WhatsApp number, and a brand accent on the exported PDF. Everything here is
// plain serialisable data, safe to import from both Server and Client Components.

export type Partner = {
  /** URL segment under /partner — keep it kebab-case and stable. */
  id: string;
  /** Display name, used in copy, the footer and the PDF. */
  name: string;
  /** Public path to their logo (PNG/JPEG — not SVG, so it can go on the PDF). */
  logo: string;
  /** WhatsApp Business number, international format, digits only (no +, spaces). */
  whatsapp: string;
  /** Brand accent (hex). Used on the PDF and a header accent strip. */
  accent?: string;
  /** Darker accent (hex) for hovers / depth; falls back to `accent`. */
  accentDeep?: string;
  /** Explicit allow-list of project slugs. Takes precedence over `exclude`. */
  projects?: string[];
  /** Project slugs to hide. Ignored when `projects` is set. */
  exclude?: string[];
  /** The agency's own site — allowed to embed the iframe, shown in attribution. */
  website?: string;
};

export const PARTNERS: Record<string, Partner> = {
  "corner-brick-group": {
    id: "corner-brick-group",
    name: "Corner Brick Group",
    logo: "/partners/corner-brick-group.png",
    whatsapp: "923072926111",
    accent: "#ed3a1c",
    accentDeep: "#c8300f",
    // "All projects except The Ark, Falah and Skyline Boulevard." A deny-list
    // means new projects added later show for them automatically — switch to
    // `projects` (an allow-list) if you'd rather curate each one in.
    exclude: ["the-ark", "falah-technology-tower", "skyline-boulevard"],
    website: "https://cornerbrickgroup.com",
  },
};

export const PARTNER_IDS = Object.keys(PARTNERS);

/** Resolve a partner by id, or null if there's no such partner. */
export function partnerById(id?: string | null): Partner | null {
  return (id && PARTNERS[id]) || null;
}

/** The route prefix for a partner's embed ("" for the main Clearstoreys site). */
export function basePathFor(partner: Partner | null | undefined): string {
  return partner ? `/partner/${partner.id}` : "";
}

/** Derive the active partner from a pathname like `/partner/<id>/...`. */
export function partnerFromPath(pathname: string): Partner | null {
  const match = pathname.match(/^\/partner\/([^/]+)/);
  return match ? partnerById(match[1]) : null;
}

/** Whether a project slug is visible to a partner (everyone sees all by default). */
export function isAllowedSlug(
  partner: Partner | null | undefined,
  slug: string
): boolean {
  if (!partner) return true;
  if (partner.projects) return partner.projects.includes(slug);
  if (partner.exclude) return !partner.exclude.includes(slug);
  return true;
}

/** The brand name to show — the partner's, or Clearstoreys on the main site. */
export function brandName(partner: Partner | null | undefined): string {
  return partner?.name ?? "Clearstoreys";
}
