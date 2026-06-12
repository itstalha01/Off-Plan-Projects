// WhatsApp number in international format, digits only — no "+", spaces or leading zeros.
export const WHATSAPP_NUMBER = "923297748627";

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
