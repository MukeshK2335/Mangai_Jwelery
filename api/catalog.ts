/**
 * Mangai Jewelry — Live Meta Commerce Catalog proxy endpoint
 *
 *   GET /api/catalog
 *
 * Runs on Vercel EDGE RUNTIME (Web Fetch API style: Request -> Response).
 * NEVER expose META_CATALOG_TOKEN in the frontend bundle. This file runs only
 * on the SERVER (Vercel Edge) only.
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

export const config = { runtime: "edge" };

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const metaUrl =
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${catalogId}/products` +
      `?fields=${encodeURIComponent(FIELDS)}&limit=500`;

    const metaRes = await fetch(metaUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const metaJson = (await metaRes.json()) as any;

    if (!metaRes.ok) {
      return new Response(JSON.stringify({ error: metaJson }), {
        status: metaRes.status,
        headers: corsHeaders({ "Content-Type": "application/json" }),
      });
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
    clearTimeout(timeoutId);
    const isAbort = err?.name === "AbortError";
    return new Response(
      JSON.stringify({
        error: isAbort
          ? "Request to Meta Graph API timed out after 15s."
          : err?.message || String(err) || "Unknown proxy error",
      }),
      {
        status: isAbort ? 504 : 502,
        headers: corsHeaders({ "Content-Type": "application/json" }),
      },
    );
  }
}

function fallbackCustom(metaProductTypeOrCategory: string): MangaiCustom {
  const s = String(metaProductTypeOrCategory || "").toLowerCase();
  let category_slug: MangaiCustom["category_slug"] = "necklaces";
  if (/ring/.test(s)) category_slug = "rings";
  else if (/necklace|chain|pendant|har|m/.test(s)) category_slug = "necklaces";
  else if (/earring|stud|hoop|drop|jhum/.test(s)) category_slug = "earrings";
  else if (/bangle|bracelet|kada|cuff/.test(s)) category_slug = "bangles";
  return { category_slug, featured: false };
}

function corsHeaders(extras: Record<string, string> = {}): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    ...extras,
  };
}