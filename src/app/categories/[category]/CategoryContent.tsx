"use client";

import ProductCard from "@/components/card/ProductCard";
import React, { useState } from "react";
import styles from "./page.module.css";
import { SimpleGrid } from "@mantine/core";
import { Product } from "@/utils/types";

export default function CategoryContent({
  products,
  category,
}: {
  products: Product[];
  category: string;
}) {
  const [sortOption, setSortOption] = useState("featured");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    return 0; // featured / newest: preserve API order
  });

  const displayCategory = category;
  const titleCategory =
    displayCategory === "all"
      ? "The Artisan"
      : displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1);

  return (
    <div className={styles.page}>
      {/* EDITORIAL HEADER */}
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
              stroke="#D82788"
              strokeWidth="0.5"
              opacity="0.11"
            />
            <circle
              cx="720"
              cy="190"
              r="145"
              stroke="#D82788"
              strokeWidth="0.5"
              opacity="0.08"
            />
            <circle
              cx="720"
              cy="190"
              r="90"
              stroke="#D82788"
              strokeWidth="0.5"
              opacity="0.06"
            />
            <polygon
              points="720,10 900,190 720,370 540,190"
              stroke="#D82788"
              strokeWidth="0.5"
              opacity="0.08"
              fill="none"
            />
            <line
              x1="540"
              y1="10"
              x2="900"
              y2="370"
              stroke="#D82788"
              strokeWidth="0.3"
              opacity="0.05"
            />
            <line
              x1="900"
              y1="10"
              x2="540"
              y2="370"
              stroke="#D82788"
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
              <div className={styles.pillCount}>{products.length}</div>
            </div>
            <div className={styles.scrollIndicator}>
              <div className={styles.scrollLine} />
              Scroll
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className={styles.content}>
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
      </div>
    </div>
  );
}
