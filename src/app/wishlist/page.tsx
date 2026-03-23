"use client";

import React from "react";
import styles from "./page.module.css";
import { useCart, useWishlist } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Wishlist() {
  const { wishlistData, removeWishlistItem, isLoading } = useWishlist();
  const { setCartData } = useCart();
  const router = useRouter();

  const handleMoveToCart = async (id: string) => {
    const item = wishlistData.get(id);
    if (!item) return;
    await removeWishlistItem(id);
    await setCartData(item);
  };

  const handleRemoveItem = async (id: string) => {
    await removeWishlistItem(id);
  };

  return (
    <main className={styles.pageWrapper}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backLink} onClick={() => router.back()}>
          ← Continue Shopping
        </button>
        <span className={styles.eyebrow}>YOUR WISHLIST</span>
        <h1 className={styles.pageTitle}>Curated for You</h1>
      </div>

      {/* Content */}
      <div className={styles.contentArea}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <p className={styles.loadingText}>Loading your wishlist…</p>
          </div>
        ) : wishlistData.size === 0 ? (
          <div className={styles.emptyState}>
            {/* Mandana Diamond Icon */}
            <svg
              className={styles.emptyIcon}
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="24"
                y="2"
                width="16"
                height="16"
                transform="rotate(45 24 2)"
                stroke="#c8956c"
                strokeWidth="0.5"
                fill="none"
              />
              <rect
                x="24"
                y="6"
                width="10"
                height="10"
                transform="rotate(45 24 6)"
                stroke="#c8956c"
                strokeWidth="0.5"
                fill="none"
              />
              <line
                x1="24"
                y1="2"
                x2="24"
                y2="46"
                stroke="#c8956c"
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />
              <line
                x1="2"
                y1="24"
                x2="46"
                y2="24"
                stroke="#c8956c"
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />
            </svg>
            <p className={styles.emptyText}>Your wishlist is empty.</p>
            <Link href="/categories/all" className={styles.exploreButton}>
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className={styles.wishlistGrid}>
            {Array.from(wishlistData.values()).map(
              ({ id, name, price, images }) => (
                <div key={id} className={styles.productCard}>
                  {/* Image Area */}
                  <div className={styles.imageArea}>
                    {images && images.length > 0 ? (
                      <Image
                        src={images[0].url}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.productImage}
                        unoptimized={images[0].url.includes(
                          "lh3.googleusercontent.com",
                        )}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder} />
                    )}

                    {/* Remove Button */}
                    <button
                      aria-label="Remove from wishlist"
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16px"
                        viewBox="0 -960 960 960"
                        width="16px"
                        fill="currentColor"
                      >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className={styles.productInfo}>
                    <div className={styles.productInfoRow}>
                      <div>
                        <h3 className={styles.productName}>{name}</h3>
                        <span className={styles.productPrice}>
                          ₹ {price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <button
                        aria-label="Move to cart"
                        className={styles.cartIconBtn}
                        onClick={() => handleMoveToCart(id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 -960 960 960"
                          width="18px"
                          fill="currentColor"
                        >
                          <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Mandana Decorative Bar */}
      <div className={styles.mandanaBar} />
    </main>
  );
}
