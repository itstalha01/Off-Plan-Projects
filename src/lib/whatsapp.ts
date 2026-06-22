// WhatsApp number in international format, digits only — no "+", spaces or leading zeros.
export const WHATSAPP_NUMBER = "923297748627";

// `number` lets a white-label partner route enquiries to their own WhatsApp
// Business line; it defaults to the Clearstoreys advisor number.
export function whatsappLink(
  message?: string,
  number: string = WHATSAPP_NUMBER
): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// A WhatsApp link with no fixed recipient — opens the contact picker with the
// message prefilled. Used when a consultant shares with their own client rather
// than the Clearstoreys advisor number.
export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
