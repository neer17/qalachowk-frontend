"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import WishlistSVG from "@/assets/svgs/wishlist.svg";
import WishlistRedSVG from "@/assets/svgs/wishlist-red.svg";
import CartSVG from "@/assets/svgs/cart.svg";
import { useCart, useWishlist } from "@/context/CartContext";
import SlidePopup from "@/components/slide_popup/SlidePopup";
import { Product } from "@/utils/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ProductCardProps extends Product {}

export default function ProductCard({
  slug,
  images,
  name,
  imageSizes,
  price,
  id,
  category,
  material,
  description,
}: ProductCardProps) {
  const router = useRouter();
  const { setCartData } = useCart();
  const { wishlistData, addWishlistItem, removeWishlistItem } = useWishlist();
  const [isSlidePopupOpen, setIsSlidePopupOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const filteredImages = images
    .map((image) => image.url)
    .filter((imageSrc) => !imageSrc.includes(".mp4"));

  // Check if item is in wishlist on mount and when wishlist changes
  useEffect(() => {
    setIsInWishlist(wishlistData.has(id));
  }, [wishlistData, id]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const navigateToProductDetailsPage = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    router.push(`/categories/rings/${slug}`);
  };

  const handleDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();
    scrollTo(index);
  };

  const handleItemAddToCart = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const productToAdd = {
      id,
      name,
      price,
      quantity: 1,
      images,
      category,
      slug,
      material: material || "",
      description: description || "",
    };

    await setCartData(productToAdd);
    setIsSlidePopupOpen(true);
  };

  const handleWishlistToggle = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const productToWishlist = {
      id,
      name,
      price,
      quantity: 1,
      images,
      category,
      slug,
      material: material || "",
      description: description || "",
    };

    if (isInWishlist) {
      await removeWishlistItem(id);
    } else {
      await addWishlistItem(productToWishlist);
    }
  };

  const handleCloseSlidePopup = () => {
    setIsSlidePopupOpen(false);
  };

  return (
    <>
      <div
        className={styles.productContainer}
        onClick={navigateToProductDetailsPage}
      >
        <div className={styles.imageContainer}>
          <div className={styles.embla} ref={emblaRef}>
            <div className={styles.emblaContainer}>
              {filteredImages.map((imageSrc, index) => (
                <div className={styles.emblaSlide} key={`${imageSrc}-${index}`}>
                  <Image
                    src={imageSrc}
                    alt={name}
                    width={1920}
                    height={1080}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    sizes={imageSizes}
                    priority={index === 0}
                    className={styles.productImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {filteredImages.length > 1 && (
            <div className={styles.emblaDots}>
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.emblaDot} ${
                    index === selectedIndex ? styles.emblaDotSelected : ""
                  }`}
                  type="button"
                  onClick={(e) => handleDotClick(e, index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.productDetailsContainer}>
          <div className={styles.textContainer}>
            <span className={styles.productTitle}>{name}</span>
            <span className={styles.productPrice}>
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className={styles.productGstNote}>Incl. 3% GST</span>
          </div>

          <div className={styles.buyContainer}>
            <div
              className={styles.wishlistSvgContainer}
              onClick={handleWishlistToggle}
            >
              <Image
                src={isInWishlist ? WishlistRedSVG : WishlistSVG}
                alt={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                width={20}
                height={20}
              />
            </div>
            <div
              className={styles.bagSvgContainer}
              onClick={handleItemAddToCart}
            >
              <Image src={CartSVG} alt="Add to Cart" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>

      <SlidePopup
        isOpen={isSlidePopupOpen}
        backdropClickCallback={handleCloseSlidePopup}
      />
    </>
  );
}
