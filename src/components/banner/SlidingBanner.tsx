"use client";

import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import styles from "./SlidingBanner.module.css";

const SlidingBanner = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const textItems = [
    "Welcome to our website!",
    "Discover amazing products.",
    "Enjoy seamless shopping.",
    "Contact us for more info.",
  ];

  const autoplayPlugin = Autoplay({ delay: 2000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 8000,
    },
    [autoplayPlugin],
  );

  const togglePlayPause = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  return (
    <div className={styles.slidingBannerContainer}>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {textItems.map((text, index) => (
            <div key={index} className={styles.emblaSlide}>
              <div className={styles.textContainer}>{text}</div>
            </div>
          ))}
        </div>
      </div>
      <button
        className={styles.pausePlayButton}
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause banner" : "Play banner"}
      >
        {isPlaying ? (
          // Pause icon
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          // Play icon
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SlidingBanner;
