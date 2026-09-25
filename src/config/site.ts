import type { Product } from "../types/product";

export const SITE = {
  brand: "Mangai Jewelry",
  tagline: "Anti-tarnish jewelry",
  whatsApp: {
    countryCode: "91",
    nationalNumber: "7200933249",
  },
  instagram: {
    handle: "@mangai_jewelry",
    url: "https://www.instagram.com/mangai_jewelry",
  },
  email: {
    address: "mangaijewelry1323@gmail.com",
  },
} as const;

export const WHATSAPP_DIALABLE = `${SITE.whatsApp.countryCode}${SITE.whatsApp.nationalNumber}`;

export const WHATSAPP_DISPLAY = `+${SITE.whatsApp.countryCode} ${SITE.whatsApp.nationalNumber.replace(
  /^(\d{5})(\d{5})$/,
  "$1 $2",
)}`;

function formatPriceLabel(amount: number | string, currency: string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return `${currency} ${amount}`;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${currency} ${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
}

export function buildWhatsAppProductLink(product: Product): string {
  const priceLabel = formatPriceLabel(product.price, product.currency);

  const variantValue =
    product.variant &&
    (product.variant.option_value || product.variant.option_name)
      ? [product.variant.option_name, product.variant.option_value]
          .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
          .join(" · ")
      : null;

  const lines: string[] = [
    `Hello ${SITE.brand} ✨`,
    ``,
    `I'd love to know more about this piece —`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `💍  Piece :  ${product.name}`,
    variantValue ? `      Style :  ${variantValue}` : null,
    `💰  Price :  ${priceLabel}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `Could you please share —`,
    `  ✓ Current availability & ready-to-ship stock`,
    `  ✓ Sizing guidance (if applicable)`,
    `  ✓ Dispatch timeline & shipping charges`,
    `  ✓ COD / payment options, if any`,
    ``,
    `Thank you! 🙏`,
  ].filter((line): line is string => line !== null);

  return `https://wa.me/${WHATSAPP_DIALABLE}?text=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

export function buildWhatsAppLink(prefill?: string): string {
  const text = prefill?.trim()
    ? prefill
    : `Hi ${SITE.brand}! I'd like to place an order or ask a question.`;
  return `https://wa.me/${WHATSAPP_DIALABLE}?text=${encodeURIComponent(text)}`;
}
