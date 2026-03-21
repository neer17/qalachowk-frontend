"use client";

import React from "react";
import styles from "./page.module.css";
import { useCart, useWishlist } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import LeftArrow from "@/app/svgs/left_arrow.svg";
import Image from "next/image";

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
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.goBackContainer} onClick={() => router.back()}>
          <Image
            height={20}
            width={20}
            src={LeftArrow}
            alt="Go back"
            className={styles.goBackIcon}
          />
          <span>Go back to shopping</span>
        </div>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.headline}>Your Wishlist</h1>
          <p className={styles.subHeadline}>
            Curated pieces waiting to be yours.
          </p>
          <div className={styles.divider}></div>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <p>Loading your wishlist…</p>
          </div>
        ) : wishlistData.size === 0 ? (
          <div className={styles.emptyState}>
            <p>Your wishlist is currently empty.</p>
          </div>
        ) : (
          <div className={styles.wishlistGrid}>
            {Array.from(wishlistData.values()).map(
              ({ id, name, price, images }) => (
                <div key={id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <button
                      aria-label="Remove from wishlist"
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="currentColor"
                      >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>
                    </button>
                    <img
                      alt={name}
                      className={styles.productImage}
                      src={images[0]?.url || ""}
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>

                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{name}</h3>
                    <span className={styles.productPrice}>
                      ₹ {price.toLocaleString("en-IN")}
                    </span>
                    <button
                      className={styles.moveToCartButton}
                      onClick={() => handleMoveToCart(id)}
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <div className={styles.mandanaDivider}></div>
      </div>
    </main>
  );
}
