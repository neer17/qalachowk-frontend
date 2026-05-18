"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, useWishlist } from "@/context/CartContext";
import styles from "./page.module.css";
import Image from "next/image";
import { Product } from "@/utils/types";
import { getProductImageUrl } from "@/utils/productImages";
import { ReviewsMarquee } from "@/components/reviews/ReviewsMarquee";
import { CircularCards } from "@/components/circular_cards/CircularCards";
import { ArtisanStories } from "@/components/artisan_stories/ArtisanStories";
import type { PublicReview } from "@/types/reviews";
import { WaitlistService } from "@/lib/api/waitlistService";

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
  {
    id: "hp-4",
    name: "Warli Bracelet",
    tag: "Warli Folk Art · Oxidised Silver",
    desc: "A village harvest scene wraps your wrist in hand-etched silver.",
    price: 1800,
    cat: "bracelets",
    art: "warli",
    isNew: true,
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
    imageUrl: mainImage ? getProductImageUrl(mainImage, "medium") : undefined,
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
        stroke="#1A1A1A"
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
        stroke="#1A1A1A"
        strokeWidth=".75"
      >
        <ellipse cx="22" cy="18" rx="10" ry="7" fill="none" />
        <path d="M12 18 L4 11 L4 25 Z" fill="none" />
        <circle cx="28" cy="15" r="2" fill="#D82788" />
      </svg>
    );
  }
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="#1A1A1A"
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
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistHoney, setWaitlistHoney] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [waitlistError, setWaitlistError] = useState("");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistStatus === "loading") return;
    setWaitlistStatus("loading");
    setWaitlistError("");
    const { ok, error } = await WaitlistService.signup({
      email: waitlistEmail,
      website: waitlistHoney,
    });
    if (!ok) {
      setWaitlistStatus("error");
      setWaitlistError(error || "Something went wrong.");
      return;
    }
    setWaitlistStatus("success");
    setWaitlistEmail("");
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/reviews?limit=50`,
        );
        if (!res.ok) return;
        const { data } = await res.json();
        if (Array.isArray(data)) setReviews(data);
      } catch {
        // keep empty
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/collections/favourites/products`,
        );
        if (!res.ok) return;
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data.slice(0, 4).map(apiProductToHomeProduct));
        }
      } catch {
        // keep fallback products
      }
    };
    fetchFeatured();
  }, []);

  /* Intersection Observer for fade-ups — re-runs when products load so new cards are observed */
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
  }, [featuredProducts]);

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

      {/* ═══════ FAVOURITES ═══════ */}
      <section className={styles.sec}>
        <div className={`${styles.secHdr} ${styles.fu}`}>
          <div>
            <div className={styles.secLabel}>Favourites</div>
            <h2 className={styles.secTitle}>
              Pieces our patrons <em>cherish most</em>
            </h2>
          </div>
        </div>
        <div className={styles.grid4}>
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
                      fill={inWish ? "#D82788" : "none"}
                      stroke="#1A1A1A"
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
          <div className={styles.prLabel}>Free Delivery</div>
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

      {/* ═══════ ARTISAN STORIES ═══════ */}
      <ArtisanStories />

      {/* ═══════ CIRCULAR CARDS ═══════ */}
      <CircularCards />

      {/* ═══════ REVIEWS MARQUEE ═══════ */}
      <ReviewsMarquee reviews={reviews} />

      {/* ═══════ EMAIL ═══════ */}
      <section className={styles.emailSec}>
        {waitlistStatus === "success" ? (
          <>
            <div className={styles.secLabel}>You&rsquo;re In</div>
            <h2 className={styles.secTitle}>
              Welcome to the <em>founding circle</em>.
            </h2>
          </>
        ) : (
          <>
            <div className={styles.secLabel}>Join the Circle</div>
            <h2 className={styles.secTitle} style={{ marginBottom: "12px" }}>
              Expect silence — unless we create something extraordinary.
            </h2>
            <p className={styles.eSub}>
              Artisan stories, first access to new collections,
              <br />
              and the occasional letter from Jaipur.
            </p>
            <form
              className={styles.eForm}
              onSubmit={handleWaitlistSubmit}
              noValidate
            >
              <input
                className={styles.eInput}
                type="email"
                placeholder="your@email.com"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                disabled={waitlistStatus === "loading"}
                required
                aria-label="Email address"
              />
              <input
                className={styles.eHoneypot}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={waitlistHoney}
                onChange={(e) => setWaitlistHoney(e.target.value)}
              />
              <button
                className={styles.eBtn}
                type="submit"
                disabled={waitlistStatus === "loading"}
              >
                {waitlistStatus === "loading" ? "Sending..." : "Notify Me"}
              </button>
            </form>
            {waitlistError ? (
              <p className={styles.eError}>{waitlistError}</p>
            ) : (
              <p className={styles.eNote}>No spam. Just craft.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
