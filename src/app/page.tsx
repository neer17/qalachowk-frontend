"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, useWishlist } from "@/context/CartContext";
import styles from "./page.module.css";
import Image from "next/image";
import { Product } from "@/utils/types";
import { API_ENDPOINTS } from "@/utils/constants";

/* ════ STATIC PRODUCT DATA (fallback) ════ */
interface HomeProduct {
  id: string;
  name: string;
  tag: string;
  desc: string;
  price: number;
  cat: string;
  art: "warli" | "madhubani" | "mandana";
  isNew?: boolean;
  imageUrl?: string;
  slug?: string;
}

const FALLBACK_PRODUCTS: HomeProduct[] = [
  {
    id: "hp-1",
    name: "Warli Whispers Earrings",
    tag: "Warli Line Art · Silver Finish",
    desc: "Geometric folk motifs in oxidised silver — the village square on your ear.",
    price: 1500,
    cat: "earrings",
    art: "warli",
    isNew: true,
  },
  {
    id: "hp-2",
    name: "Madhubani Meadows Pendant",
    tag: "Madhubani Botanical · Hand Painted",
    desc: "Vinca blossoms and fish motifs from Mithila, suspended in silver.",
    price: 2000,
    cat: "necklaces",
    art: "madhubani",
  },
  {
    id: "hp-3",
    name: "Mandana Ring",
    tag: "Mandana Grid · Jaipur Blue",
    desc: "Protective Rajasthani symmetry, translated into a statement ring.",
    price: 1200,
    cat: "rings",
    art: "mandana",
  },
];

function apiProductToHomeProduct(p: Product): HomeProduct {
  const mainImage = p.images.find((img) => img.isMain) ?? p.images[0];
  return {
    id: p.id,
    name: p.name,
    tag: p.material ? `${p.material}` : p.category.name,
    desc: p.description,
    price: p.price,
    cat: p.category.slug,
    art: "mandana",
    imageUrl: mainImage?.url,
    slug: p.slug,
  };
}

const MARQUEE_ITEMS = [
  "Warli Line Art",
  "Madhubani Botanicals",
  "Mandana Geometry",
  "Handcrafted in Jaipur",
  "Blue Pottery Technique",
  "Living Craft Lineage",
  "Art You Can Wear",
];

/* ════ ART ICON SVGs per craft type ════ */
function ArtIcon({ art }: { art: "warli" | "madhubani" | "mandana" }) {
  if (art === "warli") {
    return (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        stroke="#C8956C"
        strokeWidth=".75"
      >
        <circle cx="18" cy="9" r="5" fill="none" />
        <line x1="18" y1="14" x2="18" y2="26" />
        <line x1="12" y1="19" x2="24" y2="19" />
        <polygon points="12,26 18,21 24,26" fill="none" />
      </svg>
    );
  }
  if (art === "madhubani") {
    return (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        stroke="#C8956C"
        strokeWidth=".75"
      >
        <ellipse cx="22" cy="18" rx="10" ry="7" fill="none" />
        <path d="M12 18 L4 11 L4 25 Z" fill="none" />
        <circle cx="28" cy="15" r="2" fill="#C8956C" />
      </svg>
    );
  }
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="#C8956C"
      strokeWidth=".75"
    >
      <rect x="8" y="8" width="20" height="20" fill="none" />
      <polygon points="18,10 28,18 18,26 8,18" fill="none" />
      <circle cx="18" cy="18" r="4" fill="none" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const { setCartData } = useCart();
  const { wishlistData, addWishlistItem, removeWishlistItem } = useWishlist();
  const [featuredProducts, setFeaturedProducts] =
    useState<HomeProduct[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}`,
        );
        if (!res.ok) return;
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data.slice(0, 3).map(apiProductToHomeProduct));
        }
      } catch {
        // keep fallback products
      }
    };
    fetchFeatured();
  }, []);

  /* Intersection Observer for fade-ups */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.vis);
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(`.${styles.fu}`)
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddToBag = (p: HomeProduct) => {
    setCartData({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      images: p.imageUrl
        ? [{ id: "img-0", url: p.imageUrl, alt: p.name, isMain: true }]
        : [],
      category: { id: "", name: p.cat, slug: p.cat, description: "" },
      slug: p.slug ?? p.id,
      material: "",
      description: p.desc,
    });
  };

  const handleToggleWish = (p: HomeProduct) => {
    const product = {
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      images: p.imageUrl
        ? [{ id: "img-0", url: p.imageUrl, alt: p.name, isMain: true }]
        : [],
      category: { id: "", name: p.cat, slug: p.cat, description: "" },
      slug: p.slug ?? p.id,
      material: "",
      description: p.desc,
    };
    if (wishlistData.has(p.id)) {
      removeWishlistItem(p.id);
    } else {
      addWishlistItem(product);
    }
  };

  const handleCardClick = (p: HomeProduct) => {
    router.push(`/categories/${p.cat}/${p.slug ?? p.id}`);
  };

  return (
    <div className={styles.page}>
      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <div className={styles.heroPh}>
          <Image
            alt="hero image"
            src="https://res.cloudinary.com/makerinc/c_fill,g_auto,f_auto,q_auto:best,fl_preserve_transparency,dpr_1,w_1944,h_926/maker-live/uploads/3160743cc156315bbac0e5488ba25081/2c868688d5086e14a6703420c81b079c/FF.png"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
        <div className={styles.heroScrim} />
        <div className={styles.heroContent}>
          <div>
            <div className={styles.hEyebrow}>Handcrafted in Jaipur</div>
            <h1 className={styles.hHeadline}>
              Where ancient
              <br />
              walls become
              <br />
              <em>jewels</em>
            </h1>
            <p className={styles.hSub}>
              Three living folk arts — Warli, Madhubani, Mandana — worn on the
              skin of the modern woman.
            </p>
            <div className={styles.hActions}>
              <Link href="/categories/all" className={styles.btnLight}>
                Explore Collections
              </Link>
              <Link href="/craft" className={styles.btnGl}>
                The Craft →
              </Link>
            </div>
          </div>
          <div className={styles.hSide}>
            <div className={styles.hPill}>
              <div className={styles.pillLbl}>Blue Pottery · Jaipur</div>
              <div className={styles.pillV}>
                Three folk traditions,
                <br />
                one lineage
              </div>
            </div>
            <div className={styles.scrollH}>
              <div className={styles.scrollL} />
              Scroll
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MANDANA ═══ */}
      <div className={styles.mb} />

      {/* ═══ MARQUEE ═══ */}
      <div className={styles.mqWrap}>
        <div className={styles.mqTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className={styles.mqItem}>
              <div className={styles.mqDot} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ FEATURED COLLECTIONS ═══════ */}
      <section className={styles.sec}>
        <div className={`${styles.secHdr} ${styles.fu}`}>
          <div>
            <div className={styles.secLabel}>Featured Collections</div>
            <h2 className={styles.secTitle}>
              Folk art, <em>worn daily</em>
            </h2>
          </div>
          <Link href="/categories/all" className={styles.linkArrow}>
            View All →
          </Link>
        </div>
        <div className={styles.grid3}>
          {featuredProducts.map((p) => {
            const inWish = wishlistData.has(p.id);
            return (
              <div
                key={p.id}
                className={`${styles.pcard} ${styles.fu}`}
                onClick={() => handleCardClick(p)}
              >
                {/* Image area */}
                <div className={styles.pcImg}>
                  {p.isNew && <span className={styles.tagNew}>New</span>}
                  <button
                    className={`${styles.pcWish} ${inWish ? styles.pcWishActive : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWish(p);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill={inWish ? "#C8956C" : "none"}
                      stroke="#6A2901"
                      strokeWidth="1"
                    >
                      <path d="M15.5 3.7a4 4 0 0 0-5.7 0L9 4.5l-.8-.8a4 4 0 0 0-5.7 5.7l.8.8L9 16l5.7-5.8.8-.8a4 4 0 0 0 0-5.7z" />
                    </svg>
                  </button>
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className={styles.pcPh}>
                      {p.art && <ArtIcon art={p.art} />}
                      Photo coming soon
                    </div>
                  )}
                </div>
                {/* Body */}
                <div className={styles.pcBody}>
                  <div className={styles.pcTag}>{p.tag}</div>
                  <div className={styles.pcName}>{p.name}</div>
                  <div className={styles.pcDesc}>{p.desc}</div>
                  <div className={styles.pcFoot}>
                    <span className={styles.pcPrice}>
                      ₹ {p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      className={styles.pcCta}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToBag(p);
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.mb} />

      {/* ═══════ EDITORIAL ═══════ */}
      <section className={styles.editorial}>
        <div className={styles.edPh}>
          <video
            src="https://player.vimeo.com/progressive_redirect/playback/1175431967/rendition/720p/file.mp4%20(720p).mp4?loc=external&log_user=0&signature=98d2c7062cb147ed82601f6798d076789456db8685478ca02a53d7120735785b"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
        <div className={styles.edScrim} />
        <div className={`${styles.edContent} ${styles.fu}`}>
          <div className={styles.edEyebrow}>The Craft Origin</div>
          <h2 className={styles.edHeadline}>
            Where the chowk
            <br />
            meets <em>the skin</em>
          </h2>
          {/* Fish motif */}
          <svg
            className={styles.fish}
            width="52"
            height="26"
            viewBox="0 0 52 26"
            fill="none"
          >
            <ellipse
              cx="32"
              cy="13"
              rx="16"
              ry="8"
              stroke="#C8956C"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M16 13 L4 5 L4 21 Z"
              stroke="#C8956C"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="42" cy="10" r="2.5" fill="#C8956C" />
            <path
              d="M22 8 Q32 5 40 8"
              stroke="#C8956C"
              strokeWidth=".8"
              fill="none"
            />
            <path
              d="M22 18 Q32 21 40 18"
              stroke="#C8956C"
              strokeWidth=".8"
              fill="none"
            />
          </svg>
          <blockquote className={styles.edQuote}>
            &ldquo;We don&rsquo;t wear jewellery.
            <br />
            We wear the memory of the earth.&rdquo;
          </blockquote>
          <p className={styles.edBody}>
            Each piece begins not on a workbench, but in the oral tradition —
            passed through artisan families who have guarded these folk arts for
            generations.
          </p>
          <Link href="/craft" className={styles.btnGl}>
            Read the Full Story →
          </Link>
        </div>
      </section>

      <div className={styles.mb} />

      {/* ═══════ PILLARS ═══════ */}
      <section className={styles.pillarsSec}>
        <div className={styles.fu}>
          <div className={styles.secLabel} style={{ color: "#c8956c" }}>
            Our Ancestral Alphabet
          </div>
          <h2 className={styles.secTitle} style={{ color: "#f5efe6" }}>
            Three arts, <em>one lineage</em>
          </h2>
        </div>
        <div className={styles.pillarsGrid}>
          <div className={`${styles.pillar} ${styles.fu}`}>
            <div className={styles.pillarIcon}>
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                stroke="#C8956C"
                strokeWidth=".85"
              >
                <circle cx="19" cy="8" r="5" />
                <line x1="19" y1="13" x2="19" y2="26" />
                <line x1="12" y1="19" x2="26" y2="19" />
                <polygon points="12,26 19,21 26,26" fill="none" />
                <line x1="12" y1="26" x2="9" y2="34" />
                <line x1="26" y1="26" x2="29" y2="34" />
              </svg>
            </div>
            <div className={styles.pillarName}>Warli</div>
            <div className={styles.pillarOrigin}>
              Sahyadri Range, Maharashtra
            </div>
            <p className={styles.pillarDesc}>
              Circles, triangles, lines — encoding the harmony of nature in its
              purest geometric form.
            </p>
          </div>
          <div
            className={`${styles.pillar} ${styles.fu}`}
            style={{ transitionDelay: ".1s" }}
          >
            <div className={styles.pillarIcon}>
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                stroke="#C8956C"
                strokeWidth=".85"
              >
                <ellipse cx="24" cy="19" rx="12" ry="7" />
                <path d="M12 19 L4 12 L4 26 Z" />
                <circle cx="31" cy="16" r="2" fill="#C8956C" />
                <path d="M16 13 Q24 10 31 13" strokeWidth=".75" />
                <path d="M16 25 Q24 28 31 25" strokeWidth=".75" />
              </svg>
            </div>
            <div className={styles.pillarName}>Madhubani</div>
            <div className={styles.pillarOrigin}>Mithila Region, Bihar</div>
            <p className={styles.pillarDesc}>
              Organic complexity celebrating divinity and the wild flora of the
              Indian landscape.
            </p>
          </div>
          <div
            className={`${styles.pillar} ${styles.fu}`}
            style={{ transitionDelay: ".2s" }}
          >
            <div className={styles.pillarIcon}>
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                stroke="#C8956C"
                strokeWidth=".85"
              >
                <rect x="8" y="8" width="22" height="22" />
                <polygon points="19,10 30,19 19,30 8,19" />
                <circle cx="19" cy="19" r="4" />
                <line x1="8" y1="8" x2="30" y2="30" strokeWidth=".5" />
                <line x1="30" y1="8" x2="8" y2="30" strokeWidth=".5" />
              </svg>
            </div>
            <div className={styles.pillarName}>Mandana</div>
            <div className={styles.pillarOrigin}>Rajasthan</div>
            <p className={styles.pillarDesc}>
              Protective geometry from Rajasthan&rsquo;s walls — radial symmetry
              inviting auspiciousness.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.mb} style={{ background: "#6a2901" }} />

      {/* ═══════ PROMISE ═══════ */}
      <div className={styles.promise}>
        <div className={`${styles.prItem} ${styles.fu}`}>
          <div className={styles.prLabel}>Truly Handcrafted</div>
          <p className={styles.prText}>
            Every piece made by hand by artisans in Jaipur
          </p>
        </div>
        <div
          className={`${styles.prItem} ${styles.fu}`}
          style={{ transitionDelay: ".1s" }}
        >
          <div className={styles.prLabel}>3-Day Delivery</div>
          <p className={styles.prText}>
            Across India, in luxury bamboo packaging
          </p>
        </div>
        <div
          className={`${styles.prItem} ${styles.fu}`}
          style={{ transitionDelay: ".2s" }}
        >
          <div className={styles.prLabel}>Living Craft</div>
          <p className={styles.prText}>
            Traditions passed through generations of artisan families
          </p>
        </div>
        <div
          className={`${styles.prItem} ${styles.fu}`}
          style={{ transitionDelay: ".3s" }}
        >
          <div className={styles.prLabel}>Made with Intention</div>
          <p className={styles.prText}>
            Not decoration — every piece is a canvas of storytelling
          </p>
        </div>
      </div>

      <div className={styles.mb} />

      {/* ═══════ EMAIL ═══════ */}
      <section className={styles.emailSec}>
        <div className={styles.secLabel}>Join the Circle</div>
        <h2 className={styles.secTitle} style={{ marginBottom: "12px" }}>
          Be the first to know
        </h2>
        <p className={styles.eSub}>
          Artisan stories, first access to new collections,
          <br />
          and the occasional letter from Jaipur.
        </p>
        <div className={styles.eForm}>
          <input
            className={styles.eInput}
            type="email"
            placeholder="your@email.com"
          />
          <button className={styles.eBtn}>Notify Me</button>
        </div>
        <p className={styles.eNote}>No spam. Just craft.</p>
      </section>
    </div>
  );
}
