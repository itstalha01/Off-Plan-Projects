// WhatsApp number in international format, digits only — no "+", spaces or leading zeros.
export const WHATSAPP_NUMBER = "923297748627";

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// A WhatsApp link with no fixed recipient — opens the contact picker with the
// message prefilled. Used when a consultant shares with their own client rather
// than the Clearstoreys advisor number.
export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
