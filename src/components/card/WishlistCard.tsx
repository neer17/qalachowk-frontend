// TODO: FEATURE: Add progress bar when the product is added and slight delay if possible
import React from "react";
import styles from "./WishlistCard.module.css";
import Image from "next/image";
import CrossButton from "@/components/buttons/Cross";

interface WishlistCardProps {
  id: string;
  imageSrc: string;
  imageSizes?: string;
  name: string;
  price: number;
  quantity: number;
  addToCardCallback: (id: string) => void;
  incrementInQuantityCallback: (id: string) => void;
  decrementInQuantityCallback: (id: string) => void;
  removeItemCallback: (id: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  id,
  name,
  quantity,
  price,
  imageSrc,
  imageSizes = "20vw",
  addToCardCallback,
  removeItemCallback,
  incrementInQuantityCallback,
  decrementInQuantityCallback,
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <Image
          width={0}
          height={0}
          src={imageSrc}
          alt="Default image name"
          sizes={imageSizes}
        />

        <span
          className={styles.crossButtonContainer}
          onClick={() => removeItemCallback(id)}
        >
          <CrossButton
            width="5px"
            height="5px"
            onClickCallback={() => removeItemCallback(id)}
          />
        </span>
        <div className={styles.addToCartButtonContainer}>
          <button onClick={() => addToCardCallback(id)}>Add to cart</button>
        </div>
      </div>

      <div className={styles.detailsWrapper}>
        <div className={styles.detailsContainer}>
          <h5>{name}</h5>
          <h5>₹{price.toLocaleString("en-IN")}</h5>
          <span className={styles.gstNote}>Incl. 3% GST</span>
        </div>

        <div className={styles.quantityContainer}>
          <span onClick={() => incrementInQuantityCallback(id)}>+</span>
          <span>{quantity}</span>
          <span onClick={() => decrementInQuantityCallback(id)}>-</span>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
