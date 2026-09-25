import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useMetaCatalog } from "../../hooks/useMetaCatalog";
import type { Product, ProductCategory } from "../../types/product";
import "./Catalog.css";

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "all", label: "All pieces" },
  { id: "rings", label: "Rings" },
  { id: "necklaces", label: "Necklaces" },
  { id: "earrings", label: "Earrings" },
  { id: "bangles", label: "Bangles & Bracelets" },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price — Low to High" },
  { id: "price-desc", label: "Price — High to Low" },
  { id: "name", label: "Name A–Z" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export default function Catalog() {
  const [category, setCategory] = useState<ProductCategory>("all");
  const [sort, setSort] = useState<SortId>("featured");

  const { products, loading, error, source, fallbackUsed, refetch } = useMetaCatalog();

  const visibleProducts = useMemo(() => {
    let list: Product[] = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.mangai.category_slug === category);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        list.sort((a, b) => {
          if (a.mangai.featured !== b.mangai.featured) {
            return a.mangai.featured ? -1 : 1;
          }
          return a.price - b.price;
        });
        break;
    }
    return list;
  }, [products, category, sort]);

  return (
    <main className="page catalog">
      <div className="container">
        <header className="page-header">
          <span className="section-label">The catalog</span>
          <h1 className="page-title">Current collection.</h1>
          <div className="gold-divider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="sparkle">
              <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="page-lead">
            Every design is made in small batches and sealed for lasting shine. DM on WhatsApp or Instagram
            to confirm availability, request custom sizing, or place an order.
          </p>
        </header>

        <section className="catalog__toolbar">
          <div className="catalog__filters" role="tablist" aria-label="Product categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={category === c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`catalog__filter ${category === c.id ? "catalog__filter--active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="catalog__sort">
            <label htmlFor="sort-select" className="catalog__sort-label">
              Sort
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="catalog__sort-select"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="catalog__toolbar-rule" />

        <div className="catalog__meta">
          <p className="catalog__count">
            Showing <span>{visibleProducts.length}</span> of <span>{products.length}</span> pieces
            {source === "local" && !fallbackUsed && <em className="catalog__source"> · previewing local catalog</em>}
            {source === "graph" && <em className="catalog__source"> · live from Meta catalog</em>}
            {fallbackUsed && <em className="catalog__source catalog__source--warn"> · live source unavailable — showing preview</em>}
          </p>
          {source === "graph" && (
            <button type="button" onClick={refetch} className="catalog__refresh" aria-label="Refresh catalog">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 1 1-3-6.7" strokeLinecap="round" />
                <path d="M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Refresh
            </button>
          )}
        </div>

        {error && !fallbackUsed && (
          <section className="catalog__error" role="alert">
            <div className="catalog__error-inner">
              <h3>Couldn't load the catalog.</h3>
              <p>{error}</p>
              <button type="button" onClick={refetch} className="btn-ghost">
                Try again
              </button>
            </div>
          </section>
        )}

        {error && fallbackUsed && (
          <section className="catalog__error catalog__error--warn" role="status">
            <div className="catalog__error-inner">
              <h3>Using cached preview.</h3>
              <p>{error}</p>
              <button type="button" onClick={refetch} className="btn-ghost">
                Retry live
              </button>
            </div>
          </section>
        )}

        {loading && !error && (
          <section className="catalog__grid catalog__grid--skeleton" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-card product-card--skeleton" aria-hidden="true">
                <div className="product-card__media product-card__media--skeleton" />
                <div className="product-card__body">
                  <div className="product-card__divider product-card__divider--skeleton" />
                  <div className="product-card__title product-card__title--skeleton" />
                  <div className="product-card__desc product-card__desc--skeleton" />
                  <div className="product-card__foot">
                    <div className="product-card__price product-card__price--skeleton" />
                    <div className="product-card__cta product-card__cta--skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && !error && visibleProducts.length > 0 && (
          <section className="catalog__grid">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
        )}

        {!loading && !error && visibleProducts.length === 0 && (
          <section className="catalog__empty">
            <div className="catalog__empty-sparkle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
              </svg>
            </div>
            <p>No pieces in this category yet. Check back shortly or DM us for custom requests.</p>
          </section>
        )}

        <div className="catalog__note">
          <div className="catalog__note-inner">
            <span className="section-label">Note</span>
            <p>
              Prices listed are inclusive of basic packaging within India. International shipping,
              insurance, and gift wrapping available on request. All pieces are dispatched within
              3–5 working days of confirmed payment.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
