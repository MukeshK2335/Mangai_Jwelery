/**
 * Mangai Jewelry — Meta Commerce Catalog aligned types
 *
 * These types mirror the Facebook / Meta Graph API Commerce Catalog
 * "Product Item" object (catalog_products / product_items fields).
 *
 * Reference: https://developers.facebook.com/docs/marketing-api/catalog/reference/#product-item-fields
 *
 * Fields are grouped by:
 *   - REQUIRED_CORE   : required to create a Product Item via the API
 *   - REQUIRED_SHOPPING: required for Instagram / Facebook Shop surfaces
 *   - OPTIONAL         : standard Meta fields, recommended
 *   - MANGAI_EXTENSION : custom columns specific to Mangai Jewelry
 */

export type MetaAvailability = "in stock" | "out of stock" | "preorder" | "available for order";

export type MetaCondition = "new" | "refurbished" | "used";

export type MetaGender = "female" | "male" | "unisex";

export type MetaProductCategory = string;

/**
 * Standard Meta Commerce Catalog Product Item.
 *
 * When we later fetch from the Graph API (via a backend proxy), the
 * response shape from `/{catalog-id}/products` should land as-is into
 * this interface so no transformation is needed in the UI layer.
 */
export interface MetaProductItem {
  /* ============================================================
   * REQUIRED_CORE
   * ============================================================ */
  id: string;
  retailer_id: string;
  name: string;
  description: string;
  image_url: string;
  url: string;
  currency: string;
  price: number;
  availability: MetaAvailability;
  brand: string;
  condition: MetaCondition;

  /* ============================================================
   * REQUIRED_SHOPPING  (required for IG / FB Shop checkout)
   * ============================================================ */
  inventory: number;
  /** ISO 4217 amount with 2 decimals, e.g. "1890.00" */
  sale_price?: string;
  sale_price_start_date?: string;
  sale_price_end_date?: string;

  /* ============================================================
   * OPTIONAL — sizing, categorization, attributes
   * ============================================================ */
  category?: MetaProductCategory;
  product_type?: string;
  google_product_category?: string;

  size?: string;
  variant?: {
    option_name?: string;
    option_value?: string;
    product_group_id?: string;
  };
  gender?: MetaGender;
  age_group?: "adult" | "kids" | "toddler" | "infant";
  material?: string;
  color?: string;
  pattern?: string;
  weight?: number;
  weight_unit?: "g" | "kg" | "oz" | "lb";

  /** Additional image assets */
  additional_image_url?: string[];

  /** Rich / structured description */
  short_description?: string;

  /** Shipping */
  shipping_costs?: Array<{
    shipping_country: string;
    shipping_region?: string;
    shipping_service?: string;
    shipping_cost_currency: string;
    shipping_cost_amount: number;
    min_delivery_days?: number;
    max_delivery_days?: number;
  }>;
  shipping_weight?: number;
  shipping_weight_unit?: "g" | "kg" | "oz" | "lb";

  /** Returns / warranty */
  return_policy_days?: number;
  warranty_info?: string;

  /** GTIN / MPN — identity fields */
  gtin?: string;
  mpn?: string;

  /* ============================================================
   * MANGAI_EXTENSION  (custom columns kept in sync locally)
   * ============================================================ */
  mangai: {
    /** Mirrors the locally-used category slug used for filter tabs */
    category_slug: "rings" | "necklaces" | "earrings" | "bangles";
    /** Whether the piece is featured (default sort) */
    featured: boolean;
    /** Craftsmanship / story blurb used on cards */
    craftsmanship_note?: string;
    /** Tags used for internal search (not sent to Meta) */
    tags?: string[];
  };

  /* ============================================================
   * Graph API metadata
   * ============================================================ */
  created_time?: string;
  updated_time?: string;
  /** e.g. "approved" / "pending" / "rejected" */
  review_status?: string;
}

/**
 * ProductCategory used by the Catalog filter tabs.
 * `all` is a virtual filter; the rest are `mangai.category_slug` values.
 */
export type ProductCategory = MetaProductItem["mangai"]["category_slug"] | "all";

/**
 * Back-compat alias — ProductCard still imports `Product` from this file.
 * With this alias we can swap the catalog source (local JSON -> Graph API)
 * without touching the UI components.
 */
export type Product = MetaProductItem;
