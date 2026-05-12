"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import ProductCard from "@/components/card/ProductCard";
import { SimpleGrid } from "@mantine/core";
import { Product } from "@/utils/types";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function ShopContent({ products }: { products: Product[] }) {
  const [sortOption, setSortOption] = useState("featured");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category.slug))),
  ];

  const filtered =
    categoryFilter === "all"
      ? products
      : products.filter((p) => p.category.slug === categoryFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.eyebrow}>All Collections</div>
          <h1 className={styles.pageTitle}>
            The Artisan <em>Shop</em>
          </h1>
          <p className={styles.pageSubtitle}>
            Every piece handcrafted by master artisans — ancient Indian folk
            arts worn on the skin of the modern woman.
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.glassPill}>
            <div className={styles.pillLabel}>Pieces</div>
            <div className={styles.pillCount}>{products.length}</div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className={styles.content}>
        {/* Category tabs */}
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${categoryFilter === cat ? styles.categoryTabActive : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort + count bar */}
        <div className={styles.sortBar}>
          <span className={styles.pieceCount}>
            {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
          </span>
          <div className={styles.sortControl}>
            <label className={styles.sortLabel} htmlFor="shop-sort">
              Sort By
            </label>
            <select
              id="shop-sort"
              className={styles.sortSelect}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className={styles.emptyState}>
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
            {sorted.map((product) => (
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
