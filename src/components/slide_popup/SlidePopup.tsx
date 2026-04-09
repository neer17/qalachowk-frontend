import React, { useEffect } from "react";
import styles from "./SlidePopup.module.css";
import { useCart } from "@/context/CartContext";
import CartProductCard from "../card/CartProductCard";
import { useRouter } from "next/navigation";

interface SlidePopupProps {
  isOpen: boolean;
  backdropClickCallback: () => void;
}

const SlidePopup: React.FC<SlidePopupProps> = ({
  isOpen,
  backdropClickCallback,
}) => {
  const {
    cartData,
    setCartData,
    deleteCartData,
    removeCartData,
    getTotalPrice,
  } = useCart();

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const handleDeleteCartItem = async (itemId: string) => {
    await deleteCartData(itemId);
  };

  const handleIncrementItemQuantity = async (id: string) => {
    const item = cartData.get(id);
    if (item === undefined) {
      console.error(`Item does not exists for id: ${id}`);
      return;
    }

    await setCartData(item);
  };

  const handleDecrementItemQuantity = async (itemId: string) => {
    await removeCartData(itemId);
  };

  const navigateToCheckoutPage = () => {
    backdropClickCallback();
    router.push("/checkout");
  };

  useEffect(() => {
    console.info("Cart data changed:", cartData);
  }, [cartData]);

  const cartTotal = getTotalPrice();

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          aria-hidden="true"
          onClick={backdropClickCallback}
        />
      )}
      <div
        className={`${styles.slidePanel} ${isOpen ? styles.open : ""}`}
        aria-expanded={isOpen}
      >
        <div className={styles.topSection}>
          <header className={styles.panelHeader}>
            <h2>Your Cart</h2>
            <button onClick={backdropClickCallback} aria-label="Close cart">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>

          <main className={styles.productsList}>
            {Array.from(cartData.values()).map(
              ({
                id,
                name,
                price,
                originalPrice,
                quantity,
                images,
                category,
                slug,
                material,
                description,
              }) => (
                <CartProductCard
                  key={id}
                  id={id}
                  name={name}
                  price={price}
                  originalPrice={originalPrice}
                  quantity={quantity}
                  images={images}
                  slug={slug}
                  material={material}
                  description={description}
                  category={category}
                  incrementCallback={handleIncrementItemQuantity}
                  decrementCallback={handleDecrementItemQuantity}
                  deleteCartItem={handleDeleteCartItem}
                  imageSizes="10vw"
                />
              ),
            )}
          </main>
        </div>

        <footer className={styles.checkoutContainer}>
          <div className={styles.amountRow}>
            <p className={styles.amountLabel}>Total Amount</p>
            <p className={styles.amountValue}>₹ {cartTotal}</p>
          </div>
          <button
            className={styles.checkoutButton}
            onClick={navigateToCheckoutPage}
          >
            <span className={styles.checkoutBtnText}>Proceed to Checkout</span>
            <span className={styles.checkoutBtnPrice}>₹ {cartTotal}</span>
          </button>
        </footer>
      </div>
    </>
  );
};

export default SlidePopup;
