import type { Product } from "../../types/product";
import { buildWhatsAppProductLink } from "../../config/site";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

function formatPrice(
  amount: number | string,
  currency: string,
): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return `${amount} ${currency}`;
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return formatter.format(num);
  } catch {
    return `${currency} ${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
}

function isSaleActive(product: Product): boolean {
  if (!product.sale_price) return false;
  const now = Date.now();
  if (product.sale_price_start_date) {
    if (new Date(product.sale_price_start_date).getTime() > now) return false;
  }
  if (product.sale_price_end_date) {
    if (new Date(product.sale_price_end_date).getTime() < now) return false;
  }
  return true;
}

export default function ProductCard({ product }: ProductCardProps) {
  const preorder = product.availability === "preorder";
  const outOfStock = product.availability === "out of stock" || (product.inventory <= 0 && !preorder);

  const badgeLabel = preorder
    ? "Pre-order"
    : outOfStock
      ? "Out of stock"
      : product.inventory <= 3 && product.inventory > 0
        ? `Only ${product.inventory} left`
        : undefined;

  const saleActive = isSaleActive(product);
  const displayPrice = saleActive ? Number(product.sale_price) : product.price;
  const originalPrice = saleActive ? product.price : undefined;

  const description = product.short_description || product.description;
  const whatsAppHref = buildWhatsAppProductLink(product);

  return (
    <article
      className={`product-card ${outOfStock ? "product-card--out" : ""} ${preorder ? "product-card--pre" : ""}`}
    >
      <a
        href={whatsAppHref}
        target="_blank"
        rel="noreferrer"
        className="product-card__media"
        aria-label={`${product.name} — enquire on WhatsApp`}
      >
        <div className="product-card__frame">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card__img"
            loading="lazy"
          />
          <div className="product-card__shade" />
        </div>

        <div className="product-card__badges">
          {badgeLabel && (
            <span className={`product-card__badge ${preorder ? "product-card__badge--pre" : ""}`}>
              {badgeLabel}
            </span>
          )}
          {saleActive && (
            <span className="product-card__badge product-card__badge--sale">
              Sale
            </span>
          )}
        </div>

        <div className="product-card__hover">
          <span className="product-card__hover-text">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinejoin="round" />
            </svg>
            DM to order
          </span>
        </div>
      </a>

      <div className="product-card__body">
        <div className="product-card__divider">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="product-card__meta">
          {product.mangai?.tags?.[0] && (
            <span className="product-card__tag">{product.mangai.tags[0]}</span>
          )}
          {product.size && (
            <span className="product-card__size">{product.size}</span>
          )}
        </div>

        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__desc">{description}</p>

        <div className="product-card__foot">
          <div className="product-card__prices">
            {saleActive && originalPrice !== undefined && (
              <span className="product-card__price product-card__price--strike">
                {formatPrice(originalPrice, product.currency)}
              </span>
            )}
            <span className={`product-card__price ${saleActive ? "product-card__price--sale" : ""}`}>
              {formatPrice(displayPrice, product.currency)}
            </span>
          </div>
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noreferrer"
            className="product-card__cta"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            Enquire
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
