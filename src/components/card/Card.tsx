import React from "react";
import styles from "./Card.module.css";
import Image from "next/image";

interface CardProps {
  productDescription: string;
  price: number;
  imageSrc: string;
  sizes: string;
  imageName: string;
}

const Card: React.FC<CardProps> = ({
  productDescription,
  price,
  imageSrc,
  sizes,
  imageName,
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <Image
          fill
          alt={imageName}
          src={imageSrc}
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.productDescription}>{productDescription}</div>
        <div className={styles.productPrice}>
          ₹ {price.toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
};

export default Card;
