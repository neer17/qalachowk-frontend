/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import React from "react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";
import CartProductCard from "@/components/card/CartProductCard";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    cartData,
    setCartData,
    getTotalPrice,
    removeCartData,
    deleteCartData,
  } = useCart();

  const handleQuantityIncrement = async (id: string) => {
    const item = cartData.get(id);

    if (item !== undefined) {
      await setCartData({ ...item, quantity: 1 });
    }
  };

  const handleQuantityDecrement = async (id: string) => {
    await removeCartData(id);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteCartData(id);
  };

  const handleGoBack = () => {
    router.back();
  };

  const navigateToCheckoutPage = () => {
    router.push("/checkout");
  };

  const itemCount = cartData.size;

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backLink} onClick={handleGoBack}>
          ← Continue Shopping
        </button>
        <span className={styles.eyebrow}>YOUR BAG</span>
        <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
        <p className={styles.itemCount}>
          {itemCount === 0
            ? "No items"
            : itemCount === 1
              ? "1 item"
              : `${itemCount} items`}
        </p>
      </div>

      {/* Main Content */}
      {itemCount === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Your bag is empty.</p>
          <button className={styles.emptyLink} onClick={handleGoBack}>
            ← Continue Shopping
          </button>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {/* Cart Items Column */}
          <div className={styles.cartItemsColumn}>
            {Array.from(cartData.values()).map(
              ({
                id,
                name,
                price,
                quantity,
                category,
                images,
                material,
                slug,
                description,
              }) => (
                <div key={id} className={styles.cartItemRow}>
                  <CartProductCard
                    id={id}
                    name={name}
                    price={price}
                    quantity={quantity}
                    images={images}
                    slug={slug}
                    material={material}
                    description={description}
                    category={category}
                    imageSizes="10vw"
                    incrementCallback={handleQuantityIncrement}
                    decrementCallback={handleQuantityDecrement}
                    deleteCartItem={handleDeleteItem}
                  />
                </div>
              ),
            )}
          </div>

          {/* Order Summary Column */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryPanel}>
              <h2 className={styles.summaryHeading}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>₹ {getTotalPrice()}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryShipping}>Complimentary</span>
              </div>

              <div className={styles.summaryDivider} />

              <div className={styles.summaryTotalRow}>
                <span className={styles.summaryTotalLabel}>Grand Total</span>
                <div>
                  <span className={styles.summaryTotalPrice}>
                    ₹ {getTotalPrice().toLocaleString("en-IN")}
                  </span>
                  <div className={styles.summaryGstNote}>Incl. 3% GST</div>
                </div>
              </div>

              <button
                className={styles.checkoutButton}
                onClick={navigateToCheckoutPage}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bar */}
      {itemCount > 0 && (
        <div className={styles.mobileBar}>
          <span className={styles.mobileTotalLabel}>
            Total{" "}
            <strong className={styles.mobileTotalPrice}>
              ₹ {getTotalPrice()}
            </strong>
          </span>
          <button
            className={styles.mobileCheckoutButton}
            onClick={navigateToCheckoutPage}
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Mandana Divider */}
      <div className={styles.mandanaBar} />
    </div>
  );
}
