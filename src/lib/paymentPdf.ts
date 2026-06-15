import { jsPDF } from "jspdf";
import type { Category, Project } from "@/features/projects/types/project";
import { formatPKR, formatRate } from "./format";

/** A milestone with its computed PKR amount (as rendered in the calculator). */
type MilestoneRow = { label: string; pct: number; amount: number };

/** An installment stream with derived per-payment and total amounts. */
type InstallmentRow = {
  label: string;
  pct: number;
  count: number;
  note?: string;
  per: number;
  streamTotal: number;
};

export type PaymentPlanPdf = {
  project: Project;
  category: Category;
  size: number;
  rate: number;
  total: number;
  milestones: MilestoneRow[];
  installments: InstallmentRow[];
  buyerName?: string; // optional — personalises the document when provided
  custom?: boolean; // true when built from a custom down payment (see customPlan)
};

// Brand palette (from globals.css) as jsPDF RGB triples.
const INK = [22, 19, 13] as const;
const GOLD = [198, 162, 74] as const;
const GOLD_DEEP = [182, 145, 60] as const;
const BROWN = [140, 133, 122] as const;
const CREAM = [236, 227, 207] as const;
const PAPER = [247, 242, 232] as const;

const PAGE_W = 210; // A4 portrait, mm
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

function typeLabel(project: Project): string {
  return Array.isArray(project.type) ? project.type.join(" · ") : project.type;
}

/** Build a branded payment-plan PDF for the current selection, returning the
 *  jsPDF document and a slugified filename. Shared by the download and share paths. */
function buildPaymentPlanPdf(data: PaymentPlanPdf): {
  doc: jsPDF;
  filename: string;
} {
  const {
    project,
    category,
    size,
    rate,
    total,
    milestones,
    installments,
    buyerName,
    custom,
  } = data;
  const buyer = buyerName?.trim();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // — Header band —
  doc.setFillColor(...INK);
  doc.rect(0, 0, PAGE_W, 30, "F");
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CLEARSTOREYS", MARGIN, 15);
  doc.setTextColor(...PAPER);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    custom ? "Custom Payment Plan" : "Indicative Payment Plan",
    MARGIN,
    22
  );

  const generated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setTextColor(...BROWN);
  doc.text(generated, PAGE_W - MARGIN, 22, { align: "right" });

  let y = 44;

  // — Project title —
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(project.name, MARGIN, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BROWN);
  doc.text(
    `${project.dev} · ${project.area}, ${project.city} · ${typeLabel(
      project
    )} · Possession ${project.poss}`,
    MARGIN,
    y
  );
  y += 12;

  // — Personalisation (optional) — a quiet gold label with the buyer's name set
  //   in serif italic, echoing the site's serif headings, and a short gold rule.
  if (buyer) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...GOLD_DEEP);
    doc.text("PREPARED EXCLUSIVELY FOR", MARGIN, y);
    y += 7;
    doc.setFont("times", "bolditalic");
    doc.setFontSize(18);
    doc.setTextColor(...INK);
    doc.text(buyer, MARGIN, y);
    const nameW = Math.min(doc.getTextWidth(buyer), CONTENT_W);
    y += 2.5;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, MARGIN + nameW, y);
    y += 10;
  }

  // — Configuration summary (category / size / rate) —
  const cells: [string, string][] = [
    ["Category", category.name],
    ["Unit size", `${size.toLocaleString()} sqft`],
    ["Rate", formatRate(rate)],
  ];
  const cellW = CONTENT_W / cells.length;
  const cellPad = 5;
  // Usable text width inside a cell, leaving a gutter before the next column.
  const cellTextW = cellW - cellPad - 3;
  doc.setFillColor(...CREAM);
  doc.roundedRect(MARGIN, y, CONTENT_W, 18, 2, 2, "F");
  cells.forEach(([label, value], i) => {
    const cx = MARGIN + cellW * i + cellPad;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...BROWN);
    doc.text(label.toUpperCase(), cx, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    // Shrink the value's font size until it fits within its column so long
    // labels (e.g. "Corporate Offices (3rd–9th Floor)") don't overrun the
    // neighbouring cell.
    const FLOOR = 6.5;
    let valueSize = 11;
    doc.setFontSize(valueSize);
    while (doc.getTextWidth(value) > cellTextW && valueSize > FLOOR) {
      valueSize -= 0.5;
      doc.setFontSize(valueSize);
    }
    // If it still doesn't fit at the floor size, wrap onto (up to two) lines.
    const lines: string[] =
      doc.getTextWidth(value) > cellTextW
        ? (doc.splitTextToSize(value, cellTextW) as string[]).slice(0, 2)
        : [value];
    // Stack lines from a common bottom so a single line keeps its baseline.
    const lineH = valueSize * 0.42;
    const baseY = y + 13.5 - (lines.length - 1) * lineH;
    lines.forEach((line, li) => {
      doc.text(line, cx, baseY + li * lineH);
    });
  });
  y += 26;

  // — Total unit price (hero) —
  doc.setFillColor(...GOLD);
  doc.roundedRect(MARGIN, y, CONTENT_W, 20, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...INK);
  doc.text(
    `TOTAL UNIT PRICE · ${size.toLocaleString()} sqft × ${formatRate(rate)}`,
    MARGIN + 6,
    y + 8
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(formatPKR(total), MARGIN + 6, y + 16);
  y += 30;

  // — Row renderer with simple page-break handling —
  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - 28) {
      doc.addPage();
      y = MARGIN + 6;
    }
  };

  const sectionHeading = (text: string) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD_DEEP);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 3;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 7;
  };

  const planRow = (label: string, sub: string, value: string) => {
    ensureSpace(11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(label, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...BROWN);
    doc.text(sub, MARGIN, y + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(value, PAGE_W - MARGIN, y, { align: "right" });
    y += 8;
    doc.setDrawColor(...CREAM);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
  };

  if (milestones.length) {
    sectionHeading("Milestones");
    milestones.forEach((m) =>
      planRow(m.label, `${m.pct}% of total`, formatPKR(m.amount))
    );
    y += 2;
  }

  if (installments.length) {
    sectionHeading("Installments");
    installments.forEach((ins) =>
      planRow(
        ins.label,
        `${ins.note ?? `${ins.pct}% × ${ins.count}`} · ${formatPKR(
          ins.streamTotal
        )} total`,
        `${formatPKR(ins.per)} × ${ins.count}`
      )
    );
    y += 2;
  }

  // — Plan note —
  if (project.planNote) {
    ensureSpace(20);
    const lines = doc.splitTextToSize(project.planNote, CONTENT_W - 12);
    const boxH = lines.length * 4.5 + 8;
    doc.setFillColor(...PAPER);
    doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GOLD_DEEP);
    doc.text(lines, MARGIN + 6, y + 6);
    y += boxH + 6;
  }

  // — Disclaimer —
  ensureSpace(16);
  const disclaimer =
    "Figures are indicative and derived from the published rate and plan split. " +
    (custom
      ? "This custom split is a proposal subject to developer approval. "
      : "") +
    "Final pricing, taxes and schedule are confirmed by the developer at booking.";
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...BROWN);
  doc.text(doc.splitTextToSize(disclaimer, CONTENT_W), MARGIN, y);

  // — Footer on every page —
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...CREAM);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...BROWN);
    doc.text("Clearstoreys", MARGIN, PAGE_H - 10);
    doc.text(`Page ${p} of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 10, {
      align: "right",
    });
  }

  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const forBuyer = buyer ? `-for-${slug(buyer)}` : "";
  const customTag = custom ? "-custom" : "";
  const filename = `payment-plan${customTag}-${slug(project.name)}-${slug(
    category.name
  )}-${size}sqft${forBuyer}.pdf`;

  return { doc, filename };
}

/** Build and trigger a download of a branded payment-plan PDF for the current selection. */
export function downloadPaymentPlanPdf(data: PaymentPlanPdf): void {
  const { doc, filename } = buildPaymentPlanPdf(data);
  doc.save(filename);
}

/** Build the payment-plan PDF as a File, for sharing via the Web Share API
 *  (e.g. straight into WhatsApp on a consultant's phone). */
export function paymentPlanPdfFile(data: PaymentPlanPdf): File {
  const { doc, filename } = buildPaymentPlanPdf(data);
  return new File([doc.output("blob")], filename, {
    type: "application/pdf",
  });
}
