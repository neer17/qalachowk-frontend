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
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const displayCategory =
    typeof category === "string" ? category : "Collection";
  const titleCategory =
    displayCategory === "all"
      ? "The Artisan"
      : `The ${displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)}`;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Loading {displayCategory} collection...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`page ${styles.pageWrapper}`}>
      <div className={styles.contentContainer}>
        <section className={styles.pageIntro}>
          <h1 className={styles.pageTitle}>{titleCategory} Collection</h1>
          <p className={styles.pageSubtitle}>
            Discover jewelry that tells a story. Each piece is handcrafted by
            master artisans, blending ancient Indian art forms with contemporary
            design.
          </p>
          <div className={styles.mandanaDivider}></div>
        </section>

        <div className={styles.mainLayout}>
          {/* BEGIN: Sidebar Filters - Implemented but Hidden per user request */}
          <aside className={styles.sidebarFilters}>
            <div style={{ position: "sticky", top: "7rem" }}>
              {/* Filter: Art Form */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterHeader}>Art Form</h3>
                <ul className={styles.filterList}>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Warli Art
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Madhubani
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Pattachitra
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Gond Engravings
                    </label>
                  </li>
                </ul>
              </div>

              {/* Filter: Material */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterHeader}>Material</h3>
                <ul className={styles.filterList}>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      22k Gold Plated
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Sterling Silver
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Terracotta
                    </label>
                  </li>
                </ul>
              </div>

              {/* Filter: Collection */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterHeader}>Collection</h3>
                <ul className={styles.filterList}>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Festive 2024
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Minimalist Heritage
                    </label>
                  </li>
                  <li>
                    <label className={styles.filterItem}>
                      <input
                        className={styles.filterCheckbox}
                        type="checkbox"
                      />{" "}
                      Tribal Roots
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          {/* END: Sidebar Filters */}

          {/* BEGIN: Product Grid */}
          <section className={styles.productGridArea}>
            <SimpleGrid
              cols={{ base: 2, md: 3, xl: 4 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  images={product.images}
                  name={product.name}
                  imageSizes="(max-width: 768px) 50vw, 33.3vw"
                  price={product.price}
                  description={product.description}
                  category={product.category}
                  id={product.id}
                  material={product.material}
                  quantity={product.quantity}
                />
              ))}
            </SimpleGrid>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
