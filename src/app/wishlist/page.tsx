"use client";

import React from "react";
import styles from "./page.module.css";
import { useCart, useWishlist } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LeftArrow from "@/app/svgs/left_arrow.svg";

export default function Wishlist() {
  const { wishlistData, removeWishlistItem } = useWishlist();
  const { setCartData } = useCart();
  const router = useRouter();

  const handleAddToCart = async (id: string) => {
    const item = wishlistData.get(id);

    if (item === undefined) {
      console.error(`${id} does not exist in the wishlist`);
      return;
    }

    await removeWishlistItem(id);
    await setCartData(item);
  };

  const handleRemoveItem = async (id: string) => {
    const item = wishlistData.get(id);

    if (item === undefined) {
      console.error(`${id} does not exist in the wishlist`);
      return;
    }

    await removeWishlistItem(id);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.goBackContainer} onClick={handleGoBack}>
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

        {/* Wishlist Grid */}
        <div className={styles.wishlistGrid}>
          {Array.from(wishlistData.values()).map(
            ({ id, name, price, images, description }) => {
              return (
                <div key={id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <button
                      aria-label="Remove from wishlist"
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
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
                    <div className={styles.titleRow}>
                      <h3 className={styles.productTitle}>{name}</h3>
                      <span className={styles.productPrice}>₹ {price}</span>
                    </div>
                    <p className={styles.productDescription}>
                      {description || "Handcrafted Qala Chowk heirloom."}
                    </p>
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleAddToCart(id)}
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              );
            },
          )}
        </div>

        {wishlistData.size === 0 && (
          <div className={styles.emptyState}>
            <p>Your wishlist is currently empty.</p>
          </div>
        )}

        <div className={styles.mandanaDivider}></div>
      </div>
    </main>
  );
}
