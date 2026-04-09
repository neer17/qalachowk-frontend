"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import ScrollbarCarouselCards from "@/components/card/ScrollbarCarouselCards";
import RegularCard from "@/components/card/Card";
import SlidePopup from "@/components/slide_popup/SlidePopup";
import { SimpleGrid } from "@mantine/core";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { BundleOffer, MerchandisingProduct, Product } from "@/utils/types";
import { environments } from "@/utils/constants";
import { useCart, useWishlist } from "@/context/CartContext";
import { sendGAEvent } from "@next/third-parties/google";
import { ProductService } from "@/lib/api/productService";

const isProduction =
  process.env.NEXT_PUBLIC_ENVIRONMENT === environments.PRODUCTION;

export default function ProductDetails() {
  const params = useParams();
  const slug = params.productName as string;
  const { setCartData } = useCart();
  const { wishlistData, addWishlistItem, removeWishlistItem } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [productCollectionId, setProductCollectionId] = useState<string | null>(
    null,
  );
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showCartPopup, setShowCartPopup] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
    if (product) setIsInWishlist(wishlistData.has(product.id));
  }, [wishlistData, product]);

  useEffect(() => {
    if (!product || !isProduction) return;

    sendGAEvent("event", "view_item", {
      currency: "INR",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category?.name,
        },
      ],
    });

    const fbq = (window as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", "ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: "INR",
      });
    }
  }, [product]);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductsBySlug(slug);
        if (!data?.length) return;

        const [product] = data;
        setProduct(product);
        setProductCollectionId(product.collectionId ?? null);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const data = await ProductService.getProductsByCollection(
          productCollectionId!,
        );
        if (!data) return;
        setSimilarProducts(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productCollectionId) fetchSimilarProducts();
  }, [productCollectionId]);

  const handleAddToCart = async () => {
    if (!product) return;

    const productToAdd: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
      category: product.category,
      slug: product.slug,
      material: product.material || "",
      description: product.description || "",
    };

    await setCartData(productToAdd);

    if (isProduction) {
      sendGAEvent("event", "add_to_cart", {
        currency: "INR",
        value: product.price * quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            quantity,
            item_category: product.category?.name,
          },
        ],
      });

      const fbq = (window as { fbq?: (...args: unknown[]) => void }).fbq;
      if (typeof fbq === "function") {
        fbq("track", "AddToCart", {
          content_ids: [product.id],
          content_name: product.name,
          value: product.price * quantity,
          currency: "INR",
          num_items: quantity,
        });
      }
    }

    toggleCartPopup();
  };

  const addMerchandisingItemToCart = async (
    item: MerchandisingProduct,
    source:
      | "upsell_add_to_cart"
      | "silver_upgrade_click" = "upsell_add_to_cart",
  ) => {
    await setCartData({
      id: item.id,
      name: item.name,
      price: item.discountedPrice ?? item.price,
      originalPrice: item.discountedPrice ? item.price : undefined,
      quantity: 1,
      images: item.images,
      category: item.category,
      slug: item.slug,
      material: "",
      description: item.description || "",
    });

    if (isProduction) {
      sendGAEvent("event", source, {
        currency: "INR",
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_category: item.category?.name,
          },
        ],
      });
    }

    setShowCartPopup(true);
  };

  const handleAddBundle = async (bundle: BundleOffer) => {
    for (const item of bundle.products) {
      await addMerchandisingItemToCart(item);
    }

    if (isProduction) {
      sendGAEvent("event", "add_bundle_to_cart", {
        currency: "INR",
        value: bundle.finalAmount,
        bundle_id: bundle.id,
        bundle_name: bundle.name,
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (isInWishlist) {
      await removeWishlistItem(product.id);
    } else {
      await addWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        images: product.images,
        category: product.category,
        slug: product.slug,
        material: product.material || "",
        description: product.description || "",
      });
    }
  };

  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup);
  };

  if (!product) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        Curating this piece…
      </div>
    );
  }

  return (
    <div className={styles.productDetailsContainer}>
      {/* Product Overview Section */}
      <section className={styles.overviewGrid}>
        {/* Left: Product Image */}
        <div className={styles.productImageFocus}>
          {product.images && product.images.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className={styles.desktopImageGrid}>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  {product.images.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        minHeight: "400px",
                      }}
                    >
                      {img.url.includes(".mp4") ? (
                        <video
                          width={1920}
                          height={1080}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                          src={img.url}
                          autoPlay
                          muted
                          loop
                        />
                      ) : (
                        <Image
                          src={img.url}
                          alt={img.alt || product.name}
                          className={styles.productImageCover}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      )}
                    </div>
                  ))}
                </SimpleGrid>
              </div>

              {/* Mobile Carousel */}
              <div className={styles.mobileImageCarousel}>
                <div className={styles.embla} ref={emblaRef}>
                  <div className={styles.emblaContainer}>
                    {product.images.map((img) => (
                      <div className={styles.emblaSlide} key={img.id}>
                        {img.url.includes(".mp4") ? (
                          <video
                            width={1920}
                            height={1080}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                            src={img.url}
                            autoPlay
                            muted
                            loop
                          />
                        ) : (
                          <Image
                            src={img.url}
                            alt={img.alt || product.name}
                            className={styles.productImageCover}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {product.images.length > 1 && (
                  <div className={styles.emblaDots}>
                    {scrollSnaps.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.emblaDot} ${
                          index === selectedIndex ? styles.emblaDotSelected : ""
                        }`}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.placeholderImg}></div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className={styles.productInfoPanel}>
          <header>
            <p className={styles.breadcrumb}>{product.category?.name}</p>
            <h1 className={`${styles.fontSerif} ${styles.productTitle}`}>
              {product.name}
            </h1>
            <p className={styles.productPrice}>₹ {product.price}</p>
          </header>

          <div className={styles.productProse}>
            <p>{product.description}</p>
          </div>

          <div className={styles.actionsContainer}>
            <div className={styles.quantityRow}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className={styles.actionBtns}>
              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <span>ADD TO CART</span>
                <span className={styles.dot}></span>
              </button>
              <button
                className={`${styles.wishlistBtn} ${isInWishlist ? styles.wishlistBtnActive : ""}`}
                onClick={handleWishlistToggle}
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill={isInWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M15.5 3.7a4 4 0 0 0-5.7 0L9 4.5l-.8-.8a4 4 0 0 0-5.7 5.7l.8.8L9 16l5.7-5.8.8-.8a4 4 0 0 0 0-5.7z" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.handmadeGrid}>
            <div>Handmade in India</div>
            <div>Sustainable Sourcing</div>
            <div>Authenticity Certified</div>
            <div>Artisan Signature Included</div>
          </div>

          {product.merchandising?.upgradeOption && (
            <div className={styles.promoPanel}>
              <span className={styles.promoBadge}>
                {product.merchandising.upgradeOption.badgeText}
              </span>
              <h3 className={`${styles.fontSerif} ${styles.promoTitle}`}>
                {product.merchandising.upgradeOption.name}
              </h3>
              <p className={styles.promoText}>
                Step up to silver for ₹{" "}
                {product.merchandising.upgradeOption.priceDelta.toLocaleString(
                  "en-IN",
                )}{" "}
                more.
              </p>
              <button
                className={styles.secondaryActionBtn}
                onClick={() =>
                  addMerchandisingItemToCart(
                    product.merchandising!.upgradeOption!,
                    "silver_upgrade_click",
                  )
                }
              >
                Add silver version
              </button>
            </div>
          )}
        </div>
      </section>

      {product.merchandising?.bundleOffers?.length ? (
        <section className={styles.bundleSection}>
          <div className={styles.bundleHeader}>
            <span className={styles.bundleEyebrow}>Set building</span>
            <h2 className={`${styles.fontSerif} ${styles.bundleTitle}`}>
              Complete the look
            </h2>
            <p className={styles.bundleSubtitle}>
              Artisan-selected pieces chosen to complement your style.
            </p>
          </div>

          <div className={styles.bundleGrid}>
            {product.merchandising.bundleOffers.map((bundle) => (
              <article className={styles.bundleCard} key={bundle.id}>
                <div
                  className={styles.bundleImageStrip}
                  style={{
                    gridTemplateColumns: `repeat(${bundle.products.length}, 1fr)`,
                  }}
                >
                  {bundle.products.map((item) => (
                    <div className={styles.bundleImageTile} key={item.id}>
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0].url}
                          alt={item.images[0].alt || item.name}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className={styles.bundleImageFallback}>
                          {item.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className={styles.promoBadge}>{bundle.badgeText}</span>
                <h3 className={`${styles.fontSerif} ${styles.bundleCardTitle}`}>
                  {bundle.headline}
                </h3>
                <p className={styles.bundleCardText}>{bundle.subheadline}</p>
                <div className={styles.bundlePieces}>
                  {bundle.products.map((item) => (
                    <div className={styles.bundlePiece} key={item.id}>
                      <span className={styles.bundlePieceName}>
                        {item.name}
                      </span>
                      <div className={styles.bundlePiecePrice}>
                        {item.discountedPrice !== undefined ? (
                          <>
                            <span className={styles.bundleItemStrike}>
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            <strong className={styles.bundleItemDiscounted}>
                              ₹{item.discountedPrice.toLocaleString("en-IN")}
                            </strong>
                            <span className={styles.bundleItemBadge}>
                              {item.bundleDiscountPct}% OFF
                            </span>
                          </>
                        ) : (
                          <strong>₹{item.price.toLocaleString("en-IN")}</strong>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.bundlePriceRow}>
                  <div>
                    <div className={styles.bundleStrikePrice}>
                      ₹{" "}
                      {bundle.products
                        .reduce((sum, item) => sum + item.price, 0)
                        .toLocaleString("en-IN")}
                    </div>
                    <div className={styles.bundlePrice}>
                      ₹ {bundle.finalAmount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <button
                    className={styles.secondaryActionBtn}
                    onClick={() => handleAddBundle(bundle)}
                  >
                    Add set
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Mandana Divider */}
      <div className={styles.mandanaDividerWrapper}>
        <div className={styles.dashedLine}></div>
        <div className={styles.dividerIcon}>
          <svg fill="currentColor" height="40" viewBox="0 0 40 40" width="40">
            <path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16L20 0Z"></path>
          </svg>
        </div>
        <div className={styles.dashedLine}></div>
      </div>

      {/* The Craft Section */}
      <section className={styles.craftSection}>
        <div className={styles.craftHeader}>
          <h2 className={`${styles.fontSerif} ${styles.craftTitle}`}>
            The Craft Behind This Piece
          </h2>
          <p className={styles.craftSubtitle}>
            Discover the ritualistic art of Madhubani and the traditional
            methods used to bring this artifact to life.
          </p>
        </div>
        <div className={styles.craftGrid}>
          {/* Step 1 */}
          <div className={styles.craftStep}>
            <div className={styles.craftImageWrapper}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChrCnrlht4n95Jil_Y4to3qvtkva4yxZ-tG9VZX3GS_4R1IuqgUq3DweMdRmhB08jvA6GaClIGOIz0GcK4oOy8ldxYn4BUi0mWACpqqqA2bc3QTKxBDb1wQyPYhv1rc0BHAprmyi1B-Wy69p_s5LluIzq9wJzAZryOJsVIrNQyHr1HkDqN4VuhD9KdlSnzAjm381WkB0q67TNOaTIS9svap_OzOz2UlmrByMi7fYQIponhIJdPZgAwCIcQaS1SVI0If0LWIiWjZkb7"
                alt="Sketching the Soul"
                className={styles.craftImage}
              />
            </div>
            <h3 className={`${styles.fontSerif} ${styles.craftStepTitle}`}>
              I. Sketching the Soul
            </h3>
            <p className={styles.craftStepDesc}>
              Artisans trace the geometric patterns passed down through
              generations, ensuring every line honors the original folk
              narrative.
            </p>
          </div>
          {/* Step 2 */}
          <div className={styles.craftStep}>
            <div className={styles.craftImageWrapper}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbKm63x5JhoixYXKDl9UfZ9zAjKxJtBgSjv0f5iDCTxCZGGs3kFEm29t7FyhYotK5PKcj99Oi-KkPr05_0BTvRw43HwqW5Aa8gMJNpAAJh1SosxWNIBwAH2tTshP-CDjYu4dzequxAr5TsOSmFcbMybl5KEUL9kuGZ07IaJt7ymAv9YcioPagQfL3-plJe5v5nCoI5Qy8BHjGV8YilO_R9CtmI70lCOgCGkxrIeIYoXRBNfWVxDB78l8LZtVm8hIe3pu4cAwB-P3x0"
                alt="Clay Tempering"
                className={styles.craftImage}
              />
            </div>
            <h3 className={`${styles.fontSerif} ${styles.craftStepTitle}`}>
              II. Clay Tempering
            </h3>
            <p className={styles.craftStepDesc}>
              Local earth is kneaded and shaped by hand, creating a lightweight
              yet durable base that breathes with natural imperfections.
            </p>
          </div>
          {/* Step 3 */}
          <div className={styles.craftStep}>
            <div className={styles.craftImageWrapper}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5-ESxiDVBqTY67S4-g5KZkodr4X2FR7mMTYyu5UiQoc62s5xVdtD0saAjBKFSAWiATq-3dlF_SqiiPaV8SJiIlLp2XQMg3bqpk4NLmhHT9diPLYSf_f4v4LdmxtEENFdbsVcYXKWzNDlXowJmLwAHyCZAyoih-QRowg8Kua_w_BJ8JffiGLQ7lqhxAlXc3BwhZhBHyx2q_3uzEP5_vBLz80gtP5MUo0xq2JunsbqAS9tTqTXKTFTYmJGNFMZdR3jB5qohu0ephPgX"
                alt="Pigmenting History"
                className={styles.craftImage}
              />
            </div>
            <h3 className={`${styles.fontSerif} ${styles.craftStepTitle}`}>
              III. Pigmenting History
            </h3>
            <p className={styles.craftStepDesc}>
              Using dyes extracted from turmeric, indigo, and minerals, the
              piece is painted with brushes made from twigs and cotton.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Mandana Separator */}
      <div className={styles.mandanaFooterDivider}>
        <div className={styles.mandanaFooterIcons}>
          <span>❈</span>
          <span>❈</span>
          <span>❈</span>
          <span>❈</span>
          <span>❈</span>
        </div>
      </div>

      {product.merchandising?.completeTheLook?.length ? (
        <section className={styles.completeLookSection}>
          <div className={styles.bundleHeader}>
            <span className={styles.bundleEyebrow}>Style pairing</span>
            <h2 className={`${styles.fontSerif} ${styles.bundleTitle}`}>
              Style it with
            </h2>
          </div>
          <div className={styles.completeLookGrid}>
            {product.merchandising.completeTheLook.map((item) => (
              <article className={styles.completeLookCard} key={item.id}>
                {item.images?.[0] ? (
                  <div className={styles.completeLookImage}>
                    <Image
                      src={item.images[0].url}
                      alt={item.images[0].alt || item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : null}
                <div className={styles.completeLookContent}>
                  <h3 className={styles.completeLookName}>{item.name}</h3>
                  <p className={styles.completeLookPrice}>
                    ₹ {item.price.toLocaleString("en-IN")}
                  </p>
                  <button
                    className={styles.secondaryActionBtn}
                    onClick={() => addMerchandisingItemToCart(item)}
                  >
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {similarProducts.filter(
        (p) => p.id !== product?.id && p.images?.length > 0,
      ).length > 0 && (
        <div className={styles.moreProductsLargerScreen}>
          <h2>More from this collection</h2>
          <div className={styles.moreProductsCardsWrapper}>
            {similarProducts
              .filter((p) => p.id !== product?.id && p.images?.length > 0)
              .map((similarProduct) => (
                <div
                  className={styles.moreProductsCardContainer}
                  key={similarProduct.id}
                >
                  <Link
                    href={`/categories/${similarProduct.category.slug}/${similarProduct.slug}`}
                  >
                    <RegularCard
                      productDescription={similarProduct.name}
                      price={similarProduct.price}
                      sizes="20vw"
                      imageName={similarProduct.name}
                      imageSrc={similarProduct.images[0].url}
                    />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      {similarProducts.filter((p) => p.id !== product?.id).length > 0 && (
        <div className={styles.moreProductsSmallerScreen}>
          <h2>More from this collection</h2>
          <ScrollbarCarouselCards
            products={similarProducts.filter((p) => p.id !== product?.id)}
            imageSizes="(min-width: 768px) 100vw 50vw"
          />
        </div>
      )}

      <SlidePopup
        isOpen={showCartPopup}
        backdropClickCallback={toggleCartPopup}
      />
    </div>
  );
}
