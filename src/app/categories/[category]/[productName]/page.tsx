"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import ScrollbarCarouselCards from "@/components/card/ScrollbarCarouselCards";
import RegularCard from "@/components/card/Card";
import SlidePopup from "@/components/slide_popup/SlidePopup";
import { Product } from "@/utils/types";
import { API_ENDPOINTS } from "@/utils/constants";

export default function ProductDetails() {
  const params = useParams();
  const slug = params.productName as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [productCollectionId, setProductCollectionId] = useState<string | null>(
    null,
  );
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showCartPopup, setShowCartPopup] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}?slug=${slug}`,
        );
        const { data } = await response.json();
        if (!data) return;

        const [product] = data;
        setProduct(product);
        setProductCollectionId(product.collectionId);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        // Fetch similar products based on collectionId
        const similarResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}?collectionId=${productCollectionId}`,
        );
        const { data } = await similarResponse.json();
        if (!data) return;
        setSimilarProducts(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productCollectionId) fetchSimilarProducts();
  }, [productCollectionId]);

  const handleAddToCart = () => {
    toggleCartPopup();
  };

  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  console.info({
    product,
    productCollectionId,
    similarProducts,
  });

  return (
    <div className={styles.productDetailsContainer}>
      {/* Product Overview Section */}
      <section className={styles.overviewGrid}>
        {/* Left: Product Image */}
        <div className={styles.productImageFocus}>
          {product.images && product.images.length > 0 ? (
            product.images[0].url.includes(".mp4") ? (
              <video
                width={1920}
                height={1080}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={product.images[0].url}
                autoPlay
                muted
                loop
              />
            ) : (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className={styles.productImageCover}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )
          ) : (
            <div className={styles.placeholderImg}></div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className={styles.productInfoPanel}>
          <header>
            <nav className={styles.breadcrumb}>Home / Jewelry / Necklaces</nav>
            <h1 className={`${styles.fontSerif} ${styles.productTitle}`}>
              {product.name}
            </h1>
            <p className={styles.productPrice}>₹ {product.price}</p>
          </header>

          <div className={styles.productProse}>
            <p>{product.description}</p>
          </div>

          <div className={styles.actionsContainer}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <span>ADD TO CART</span>
              <span className={styles.dot}></span>
            </button>
            <button className={styles.enquireButton}>
              ENQUIRE ABOUT CUSTOMIZATION
            </button>
          </div>

          <div className={styles.handmadeGrid}>
            <div>Handmade in India</div>
            <div>Sustainable Sourcing</div>
            <div>Authenticity Certified</div>
            <div>Artisan Signature Included</div>
          </div>
        </div>
      </section>

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

      {/* Keep the original More Products component for state functionality */}
      <div className={styles.moreProductsLargerScreen}>
        <h1>More from this collection</h1>
        <div className={styles.moreProductsCardsWrapper}>
          {similarProducts
            ?.filter((product) => product.images && product.images.length > 0)
            ?.map((similarProduct) => similarProduct.images[0])
            ?.map((image) => (
              <div className={styles.moreProductsCardContainer} key={image.id}>
                <RegularCard
                  productDescription={product.description}
                  price={product.price}
                  sizes="20vw"
                  imageName={product.name}
                  imageSrc={image.url}
                />
              </div>
            ))}
        </div>
      </div>

      <div className={styles.moreProductsSmallerScreen}>
        <h1>More from this collection</h1>
        <ScrollbarCarouselCards
          products={similarProducts}
          imageSizes="(min-width: 768px) 100vw 50vw"
        />
      </div>

      <SlidePopup
        isOpen={showCartPopup}
        backdropClickCallback={handleAddToCart}
      />
    </div>
  );
}
