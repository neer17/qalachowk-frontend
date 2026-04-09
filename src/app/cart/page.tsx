/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";
import CartProductCard from "@/components/card/CartProductCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CartRecommendationsResponse,
  ProductService,
} from "@/lib/api/productService";

export default function CartPage() {
  const router = useRouter();
  const {
    cartData,
    setCartData,
    getTotalPrice,
    removeCartData,
    deleteCartData,
  } = useCart();
  const [recommendations, setRecommendations] =
    useState<CartRecommendationsResponse>({
      recommendations: [],
    });

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await ProductService.getCartRecommendations(
          Array.from(cartData.keys()),
        );
        setRecommendations(response);
      } catch (error) {
        console.error("Failed to load cart recommendations:", error);
      }
    };

    void loadRecommendations();
  }, [cartData]);

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

  const handleQuickAdd = async (
    recommendation: CartRecommendationsResponse["recommendations"][number],
  ) => {
    await setCartData({
      id: recommendation.id,
      name: recommendation.name,
      price: recommendation.price,
      quantity: 1,
      images: recommendation.images,
      category: recommendation.category,
      slug: recommendation.slug,
      description: recommendation.description,
      material: "",
    });
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

              {(recommendations.bundlePreview ||
                recommendations.recommendations.length > 0 ||
                recommendations.thresholdMessage) && (
                <div className={styles.recommendationPanel}>
                  <p className={styles.recommendationEyebrow}>
                    Complete your set
                  </p>

                  {recommendations.bundlePreview && (
                    <div className={styles.bundlePreview}>
                      <strong>{recommendations.bundlePreview.badgeText}</strong>
                      <p>
                        {recommendations.bundlePreview.name} available for ₹{" "}
                        {recommendations.bundlePreview.finalAmount.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  )}

                  {recommendations.thresholdMessage && (
                    <p className={styles.thresholdMessage}>
                      {recommendations.thresholdMessage}
                    </p>
                  )}

                  {recommendations.recommendations.slice(0, 1).map((item) => (
                    <div className={styles.quickAddCard} key={item.id}>
                      {item.images?.[0] ? (
                        <div className={styles.quickAddImage}>
                          <Image
                            src={item.images[0].url}
                            alt={item.images[0].alt || item.name}
                            fill
                            sizes="96px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : null}
                      <div className={styles.quickAddContent}>
                        <strong>{item.name}</strong>
                        <span>₹ {item.price.toLocaleString("en-IN")}</span>
                      </div>
                      <button
                        className={styles.quickAddButton}
                        onClick={() => handleQuickAdd(item)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
