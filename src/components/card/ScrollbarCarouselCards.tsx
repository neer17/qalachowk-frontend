import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./ScrollbarCarouselCards.module.css";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/utils/types";

interface ScrollbarCarouselCardsProps {
  products: Product[];
  imageSizes: string;
}

const ScrollbarCarouselCards: React.FC<ScrollbarCarouselCardsProps> = ({
  products,
  imageSizes,
}) => {
  // CHANGE: Initialize Embla carousel with responsive options
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 768px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  return (
    <div className={styles.carouselContainer}>
      {/* CHANGE: Replace Swiper with Embla carousel structure */}
      <div className={styles.emblaContainer} ref={emblaRef}>
        <div className={styles.emblaSlides}>
          {products
            .filter((product) => product.images && product.images.length > 0)
            .map((product) => (
              <div className={styles.emblaSlide} key={product.id}>
                <Link
                  href={`/categories/${product.category.slug}/${product.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className={styles.productCard}>
                    <div className={styles.productImage}>
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={0}
                        height={0}
                        sizes={imageSizes}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h3>{product.name}</h3>
                      <p className={styles.price}>{product.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollbarCarouselCards;
