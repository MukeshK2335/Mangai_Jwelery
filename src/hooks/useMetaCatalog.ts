import { useEffect, useMemo, useState } from "react";
import localCatalog from "../data/products.json";
import type { MetaProductItem } from "../types/product";

export type CatalogSource = "local" | "graph";

export interface UseMetaCatalogOptions {
  source?: CatalogSource;
  graphEndpoint?: string;
}

export interface UseMetaCatalogResult {
  products: MetaProductItem[];
  loading: boolean;
  error: string | null;
  source: CatalogSource;
  fallbackUsed: boolean;
  refetch: () => void;
}

const DEFAULT_GRAPH_ENDPOINT = "/api/catalog";

function resolveSource(option?: CatalogSource): CatalogSource {
  if (option) return option;
  const env = (import.meta.env.VITE_CATALOG_SOURCE as string | undefined)?.trim();
  if (env === "graph" || env === "local") return env;
  return "local";
}

async function fetchFromGraph(endpoint: string): Promise<MetaProductItem[]> {
  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Catalog request failed (${res.status}). ${text.slice(0, 180)}`,
    );
  }
  const json = await res.json();

  const list: unknown[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : [];

  return list as MetaProductItem[];
}

async function fetchFromLocal(): Promise<MetaProductItem[]> {
  await new Promise<void>((r) => setTimeout(r, 120));
  return localCatalog as MetaProductItem[];
}

export function useMetaCatalog(
  options: UseMetaCatalogOptions = {},
): UseMetaCatalogResult {
  const requestedSource: CatalogSource = useMemo(
    () => resolveSource(options.source),
    [options.source],
  );
  const graphEndpoint = options.graphEndpoint ?? DEFAULT_GRAPH_ENDPOINT;

  const [products, setProducts] = useState<MetaProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualSource, setActualSource] = useState<CatalogSource>(requestedSource);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setFallbackUsed(false);
      setActualSource(requestedSource);

      try {
        let list: MetaProductItem[];
        if (requestedSource === "graph") {
          try {
            list = await fetchFromGraph(graphEndpoint);
            setActualSource("graph");
          } catch (graphErr) {
            const msg = graphErr instanceof Error ? graphErr.message : "Graph request failed";
            setError(msg);
            list = await fetchFromLocal();
            setActualSource("local");
            setFallbackUsed(true);
          }
        } else {
          list = await fetchFromLocal();
          setActualSource("local");
        }
        if (cancelled) return;
        setProducts(list);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Failed to load catalog";
        setError(msg);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [requestedSource, graphEndpoint, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { products, loading, error, source: actualSource, fallbackUsed, refetch };
}
