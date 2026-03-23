"use client";

import ProductCard from "@/components/card/ProductCard";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import { API_ENDPOINTS } from "@/utils/constants";
import { SimpleGrid } from "@mantine/core";
import { Product } from "@/utils/types";

const ProductCatalog = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${API_ENDPOINTS.PRODUCTS_BY_CATEGORY.URL}/${category}`,
          {
            method: API_ENDPOINTS.PRODUCTS_BY_CATEGORY.METHOD,
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    return 0; // featured / newest: preserve API order
  });

  const displayCategory =
    typeof category === "string" ? category : "Collection";
  const titleCategory =
    displayCategory === "all"
      ? "The Artisan"
      : displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1);

  return (
    <div className={styles.page}>
      {/* ═══════ EDITORIAL HEADER ═══════ */}
      <section className={styles.header}>
        <div className={styles.headerBg}>
          <svg
            className={styles.headerBgSvg}
            viewBox="0 0 900 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="720"
              cy="190"
              r="200"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.11"
            />
            <circle
              cx="720"
              cy="190"
              r="145"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.08"
            />
            <circle
              cx="720"
              cy="190"
              r="90"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.06"
            />
            <polygon
              points="720,10 900,190 720,370 540,190"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.08"
              fill="none"
            />
            <line
              x1="540"
              y1="10"
              x2="900"
              y2="370"
              stroke="#C8956C"
              strokeWidth="0.3"
              opacity="0.05"
            />
            <line
              x1="900"
              y1="10"
              x2="540"
              y2="370"
              stroke="#C8956C"
              strokeWidth="0.3"
              opacity="0.05"
            />
          </svg>
        </div>

        <div className={styles.headerScrim} />

        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>
              {displayCategory.toUpperCase()} Collection
            </div>
            <h1 className={styles.pageTitle}>
              {titleCategory} <em>Collection</em>
            </h1>
            <p className={styles.pageSubtitle}>
              Each piece handcrafted by master artisans — ancient Indian folk
              arts worn on the skin of the modern woman.
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.glassPill}>
              <div className={styles.pillLabel}>Pieces</div>
              <div className={styles.pillCount}>
                {loading ? "—" : products.length}
              </div>
            </div>
            <div className={styles.scrollIndicator}>
              <div className={styles.scrollLine} />
              Scroll
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MANDANA BAR ═══ */}
      <div className={styles.mandanaBar} />

      {/* ═══════ CONTENT ═══════ */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingDot} />
            <p className={styles.loadingText}>
              Loading {displayCategory} collection&hellip;
            </p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <div className={styles.errorBox}>
              <p className={styles.errorText}>
                Could not load this collection. Please try again.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Sort bar */}
            <div className={styles.sortBar}>
              <span className={styles.pieceCount}>
                {sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "piece" : "pieces"}
              </span>
              <div className={styles.sortControl}>
                <label className={styles.sortLabel} htmlFor="sort-select">
                  Sort By
                </label>
                <select
                  id="sort-select"
                  className={styles.sortSelect}
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {sortedProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyOrnament} aria-hidden="true" />
                <p className={styles.emptyText}>
                  No pieces found yet. Check back soon.
                </p>
              </div>
            ) : (
              <SimpleGrid
                cols={{ base: 2, md: 3, xl: 4 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "md", sm: "xl" }}
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    images={product.images}
                    name={product.name}
                    imageSizes="(max-width: 768px) 50vw, 25vw"
                    price={product.price}
                    description={product.description}
                    category={product.category}
                    id={product.id}
                    material={product.material}
                    quantity={product.quantity}
                  />
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
