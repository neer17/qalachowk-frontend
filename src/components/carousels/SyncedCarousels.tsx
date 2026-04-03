"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./SyncedCarousels.module.css";
import { images } from "@/utils/constants";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Main carousel with proper options
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    ...options,
  });

  // Thumbnail carousel - modified to show one at a time
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: false,
    axis: "x",
    align: "center",
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const newIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    emblaThumbsApi.scrollTo(newIndex);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;

    // Set initial state
    onSelect();

    // Add event listeners
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);

    // Cleanup function
    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  return (
    <section className={styles.embla}>
      {/* Screen-reader live region announcing current slide */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {`Image ${selectedIndex + 1} of ${images.length}`}
      </div>

      {/* Main Carousel */}
      <div className={styles.embla__viewport} ref={emblaMainRef}>
        <div className={styles.embla__container}>
          {images.map((src, index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={styles.embla__slide__img}>
                <Image
                  width={500}
                  height={600}
                  src={src}
                  alt={`Product image ${index + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className={styles.productImagesContainer}>
        <div className={styles.embla__thumbs__viewport} ref={emblaThumbsRef}>
          <div
            className={styles.embla__thumbs__container}
            aria-label="Product image thumbnails"
          >
            {images.map((src, index) => (
              <div
                className={`${styles.embla__thumbs__slide} ${
                  index === selectedIndex
                    ? styles.embla__thumbs__slide__selected
                    : ""
                }`}
                key={index}
              >
                <button
                  onClick={() => onThumbClick(index)}
                  className={styles.embla__thumbs__slide__button}
                  type="button"
                  aria-pressed={index === selectedIndex}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    width={50}
                    height={50}
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
