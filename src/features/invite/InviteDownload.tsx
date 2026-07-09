"use client";

// TEMP: Bahria Sky One "Mega Open House" invite (Corner Brick Group event).
// Lets the user personalise the invite with a client name, then either download
// it as a PDF or share the PDF via the phone's native share sheet (WhatsApp,
// etc.). Remove after the event — delete this file, inviteTemplate.ts, and the
// banners that render it.

import { useEffect, useState } from "react";
import { Download, Loader2, MessageCircle } from "lucide-react";
import {
  buildInviteHtml,
  INVITE_FONTS_HREF,
} from "@/features/invite/inviteTemplate";

const PDF_FILENAME = "bahria-sky-one-open-house-invite.pdf";

/** Load the invite's Google Fonts once and wait until they're ready to paint. */
async function ensureInviteFonts(): Promise<void> {
  const id = "invite-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = INVITE_FONTS_HREF;
    document.head.appendChild(link);
  }
  try {
    await Promise.all([
      document.fonts.load("700 40px 'Playfair Display'"),
      document.fonts.load("900 40px 'Playfair Display'"),
      document.fonts.load("italic 600 26px 'Playfair Display'"),
      document.fonts.load("600 30px 'Noto Nastaliq Urdu'"),
      document.fonts.load("700 30px 'Noto Nastaliq Urdu'"),
      document.fonts.load("600 16px 'Inter'"),
    ]);
  } catch {
    // Best-effort: fall through to document.fonts.ready below.
  }
  await document.fonts.ready;
}

/** Render the personalised invite off-screen and return it as a PDF Blob. */
async function buildInvitePdf(name: string): Promise<Blob> {
  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.left = "-10000px";
  holder.style.top = "0";
  holder.style.zIndex = "-1";
  holder.innerHTML = buildInviteHtml(name);
  document.body.appendChild(holder);

  try {
    const [html2canvas, { jsPDF }] = await Promise.all([
      import("html2canvas-pro").then((m) => m.default),
      import("jspdf"),
    ]);

    await ensureInviteFonts();
    const card = holder.querySelector<HTMLElement>(".card");
    if (!card) throw new Error("Invite card element not found");

    const canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: "#FBF8F3",
      logging: false,
      useCORS: true,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      0,
      0,
      canvas.width,
      canvas.height
    );
    return pdf.output("blob");
  } finally {
    document.body.removeChild(holder);
  }
}

function triggerDownload(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = PDF_FILENAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function InviteDownload() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<null | "download" | "share">(null);
  // Only phones/tablets can attach a file to WhatsApp (Web Share API Level 2).
  // Feature-detect after mount so the button is hidden on desktop and SSR.
  const [canShareFiles, setCanShareFiles] = useState(false);

  useEffect(() => {
    try {
      const probe = new File(["probe"], "probe.pdf", {
        type: "application/pdf",
      });
      setCanShareFiles(!!navigator.canShare?.({ files: [probe] }));
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  async function handleDownload() {
    if (busy) return;
    setBusy("download");
    try {
      triggerDownload(await buildInvitePdf(name));
    } catch (err) {
      console.error("Failed to generate invite PDF", err);
      alert("Sorry — the invite couldn't be generated. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (busy) return;
    setBusy("share");
    try {
      const blob = await buildInvitePdf(name);
      const file = new File([blob], PDF_FILENAME, { type: "application/pdf" });
      const shareData = {
        files: [file],
        title: "Mega Open House · Bahria Sky One",
        text: "You're invited to the Mega Open House at Bahria Sky One — Sunday 12th July, 1 PM to 9 PM.",
      };

      // Web Share API (Level 2) can attach the file — on phones this opens the
      // native share sheet with WhatsApp as a target. Desktop can't, so fall
      // back to a download the user can attach manually.
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        triggerDownload(blob);
        alert(
          "Sharing files isn't supported on this device — the invite has been downloaded so you can attach it in WhatsApp."
        );
      }
    } catch (err) {
      // The user dismissing the share sheet throws AbortError — ignore it.
      if ((err as Error)?.name !== "AbortError") {
        console.error("Failed to share invite PDF", err);
        alert("Sorry — the invite couldn't be shared. Please try again.");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="text-sm text-brown">
        <span className="font-semibold text-ink">Mega Open House</span> · Bahria
        Sky One — personalise the invite with a client&rsquo;s name, then share
        or download it.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client name (optional)"
          aria-label="Client name for the invite"
          className="w-48 rounded-full border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink outline-none placeholder:text-brown/70 focus:border-gold-deep"
        />
        {canShareFiles && (
          <button
            type="button"
            onClick={handleShare}
            disabled={busy !== null}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1da851] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy === "share" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MessageCircle className="size-4" />
            )}
            {busy === "share" ? "Preparing…" : "Share on WhatsApp"}
          </button>
        )}
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy === "download" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {busy === "download" ? "Preparing…" : "Download invite"}
        </button>
      </div>
    </div>
  );
}
