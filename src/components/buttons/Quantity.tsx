import React from "react";
import styles from "./Quantity.module.css";

interface QuantityButtonProps {
  id: string;
  quantity: number;
  incrementCallback: (id: string) => void;
  decrementCallback: (id: string) => void;
}

const QuantityButton: React.FC<QuantityButtonProps> = ({
  id,
  quantity = 1,
  incrementCallback,
  decrementCallback,
}) => {
  return (
    <div className={styles.quantityButtonContainer}>
      <button
        className={styles.quantityBtn}
        onClick={() => incrementCallback(id)}
        aria-label="Increase quantity"
        type="button"
      >
        +
      </button>
      <h5>{quantity}</h5>
      <button
        className={styles.quantityBtn}
        onClick={() => decrementCallback(id)}
        aria-label="Decrease quantity"
        type="button"
      >
        -
      </button>
    </div>
  );
};

export default QuantityButton;
