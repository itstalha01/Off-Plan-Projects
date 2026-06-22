// Client-side helpers for putting a partner's logo on the generated PDF. jsPDF
// can't take a bare image URL, so we load the asset into a canvas and hand it a
// PNG data URL plus the natural dimensions (to preserve aspect ratio).

export type LogoImage = { dataUrl: string; width: number; height: number };

/** Load an image (same-origin /public path) as a PNG data URL with its size.
 *  Resolves null on failure so the PDF can fall back to a text wordmark. */
export function loadLogoImage(src: string): Promise<LogoImage | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Parse a hex colour (#rgb or #rrggbb) into a jsPDF RGB triple. */
export function hexToRgb(hex?: string): [number, number, number] | undefined {
  if (!hex) return undefined;
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (h.length !== 6) return undefined;
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n)) return undefined;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
