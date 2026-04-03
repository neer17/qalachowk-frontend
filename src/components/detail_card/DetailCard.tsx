import React from "react";
import Image from "next/image";

import styles from "./DetailCard.module.css";

interface DetailCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

export default function DetailCard(props: DetailCardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={props.imageSrc}
          width={0}
          height={0}
          alt={props.title}
          sizes="(max-width: 1024px) 100vw 30vw"
        />
      </div>
      <div className={styles.textContainer}>
        <span>{props.title}</span>
        <span>{props.description}</span>
      </div>
    </div>
  );
}
