import React from "react";
import Image from "next/image";
import styles from "./CartProductCard.module.css";
import { Product } from "@/utils/types";

interface CartProductCardProps extends Product {
  imageSizes?: string;
  isOrderSummaryCard?: boolean;
  crossButtonWidth?: string;
  crossButtonHeight?: string;
  incrementCallback?: (id: string) => void;
  decrementCallback?: (id: string) => void;
  deleteCartItem?: (id: string) => void;
}

const CartProductCard: React.FC<CartProductCardProps> = ({
  id,
  name,
  quantity,
  price,
  imageSizes = "10vw",
  images,
  isOrderSummaryCard = false,
  incrementCallback,
  decrementCallback,
  deleteCartItem,
}) => {
  return (
    <div className={styles.contentsContainer}>
      <div className={styles.imageContainer}>
        {images && images.length > 0 && (
          <Image
            width={96}
            height={96}
            src={images[0].url}
            alt={name}
            sizes={imageSizes}
            unoptimized={images[0].url.includes("lh3.googleusercontent.com")}
          />
        )}
      </div>
      <div className={styles.detailsContainer}>
        <h3 className={styles.productTitle}>{name}</h3>
        <p className={styles.productPrice}>₹ {price}</p>

        {isOrderSummaryCard ? (
          <div className={styles.quantityWrapper}>
            <span className={styles.qtyValue}>Qty: {quantity}</span>
          </div>
        ) : (
          <div className={styles.quantityWrapper}>
            <button
              className={styles.qtyBtn}
              aria-label="Decrease quantity"
              onClick={() => decrementCallback && decrementCallback(id)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              aria-label="Increase quantity"
              onClick={() => incrementCallback && incrementCallback(id)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        )}
      </div>

      {!isOrderSummaryCard && (
        <button
          className={styles.crossButtonContainer}
          onClick={() => deleteCartItem && deleteCartItem(id)}
          aria-label="Remove item"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CartProductCard;
