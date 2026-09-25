/**
 * Mangai Jewelry — Live Meta Commerce Catalog proxy endpoint
 *
 *   GET /api/catalog
 *
 * What it does:
 *   1. Attaches META_CATALOG_TOKEN (a Meta Business System User Token)
 *      from SERVER env to Meta Graph API request.
 *   2. Asks Meta for ALL product-item fields from the catalog
 *      (retailer_id, name, image_url, price, inventory, sale_price, shipping, ...)
 *   3. Unwraps the `{ data: [...] }` wrapper and injects the Mangai custom
 *      custom columns (category_slug, featured, tags) from the
 *      `MANGAI_CUSTOM_COLUMNS` env map keyed by `retailer_id`
 *   4. Caches the result with SWR for 30 min + 24h stale for instant next hit.
 *
 * NEVER expose META_CATALOG_TOKEN in the frontend bundle. This file runs only
 * on the SERVER (Vercel / Netlify / Node) only.
 */

type MangaiCustom = {
  category_slug: "rings" | "necklaces" | "earrings" | "bangles";
  featured?: boolean;
  craftsmanship_note?: string;
  tags?: string[];
};

const META_GRAPH_VERSION = "v22.0";

const FIELDS = [
  "id",
  "retailer_id",
  "name",
  "description",
  "short_description",
  "image_url",
  "additional_image_url",
  "url",
  "currency",
  "price",
  "sale_price",
  "sale_price_start_date",
  "sale_price_end_date",
  "availability",
  "brand",
  "condition",
  "inventory",
  "category",
  "product_type",
  "google_product_category",
  "size",
  "variant",
  "gender",
  "age_group",
  "material",
  "color",
  "pattern",
  "weight",
  "weight_unit",
  "shipping_costs",
  "shipping_weight",
  "shipping_weight_unit",
  "return_policy_days",
  "warranty_info",
  "gtin",
  "mpn",
  "created_time",
  "updated_time",
  "review_status",
].join(",");

export const config = { runtime: "nodejs" };

export default async function handler(req: Request): Promise<Response> {
  const token = process.env.META_CATALOG_TOKEN;
  const catalogId = process.env.META_CATALOG_ID;
  const customRaw = process.env.MANGAI_CUSTOM_COLUMNS || "{}";

  if (!token || !catalogId) {
    return new Response(
      JSON.stringify({
        error:
          "Missing META_CATALOG_TOKEN or META_CATALOG_ID. Add server env vars on the host (never in client code). See api/catalog.ts for details.",
      }),
      { status: 500, headers: corsHeaders({ "Content-Type": "application/json" }) },
    );
  }

  let customMap: Record<string, MangaiCustom> = {};
  try {
    customMap = JSON.parse(customRaw);
  } catch {
    customMap = {};
  }

  try {
    const metaUrl =
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${catalogId}/products` +
      `?fields=${encodeURIComponent(FIELDS)}&limit=500`;

    const metaRes = await fetch(metaUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      // Vercel Edge: do not cache for longer than graph respects freshness
      // Meta products mutate often in manager in sync
    });

    const metaJson = (await metaRes.json()) as any;

    if (!metaRes.ok) {
      return new Response(JSON.stringify({ error: metaJson }), {
        status: metaRes.status,
        headers: corsHeaders({ "Content-Type": "application/json" }),
      );
    }
    const list: any[] = Array.isArray(metaJson)
      ? metaJson
      : Array.isArray(metaJson.data)
        ? metaJson.data
        : [];

    const items = list.map((it) => {
      const retailerId = String(it.retailer_id ?? it.id ?? "");
      const custom = customMap[retailerId] ?? fallbackCustom(it.product_type || it.category || "");
      return {
        ...it,
        mangai: custom,
      };
    });

    const body = JSON.stringify(items);
    return new Response(body, {
      status: 200,
      headers: corsHeaders({
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      }),
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || String(err) || "Unknown proxy error" }),
      {
        status: 502,
        headers: corsHeaders({ "Content-Type": "application/json" }),
      },
    );
  }
}

/**
 * The Meta product_type / category string → Mangai category slug guess.
 * Used as fallback when a SKU isn't explicitly listed in MANGAI_CUSTOM_COLUMNS.
 */
function fallbackCustom(metaProductTypeOrCategory: string): MangaiCustom {
  const s = String(metaProductTypeOrCategory || "").toLowerCase();
  let category_slug: MangaiCustom["category_slug"] = "necklaces";
  if (/ring/.test(s)) category_slug = "rings";
  else if (/necklace|chain|pendant|har|m/.test(s)) category_slug = "necklaces";
  else if (/earring|stud|hoop|drop|jhum/.test(s)) category_slug = "earrings";
  else if (/bangle|bracelet|kada|cuff/.test(s)) category_slug = "bangles";
  return { category_slug, featured: false };
}

/**
 * CORS — browser direct hit from dev localhost:5173/5174 against the deployed /api/catalog
 * on a different port/origin. The dev path on same Vercel deploy (eploy will share
 * the same origin, but dev is different. Allow all since no secrets here the
 * returned list is public catalog data.
 */
function corsHeaders(extras: Record<string, string> = {}): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    ...extras,
  };
}
