"use client";

import styles from "./ReviewsMarquee.module.css";
import type { PublicReview } from "@/types/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="12" height="12" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={n <= rating ? "#D82788" : "#E5E5E5"}
            stroke={n <= rating ? "#D82788" : "#D5D5D5"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: PublicReview }) {
  const initials = (review.customerName ?? "A")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  const firstMedia = review.media[0];
  const isVideo = firstMedia?.mimeType.startsWith("video/");

  return (
    <div className={styles.card}>
      {/* ── Media top ── */}
      <div className={styles.mediaArea}>
        {firstMedia ? (
          isVideo ? (
            <video src={firstMedia.url} muted playsInline loop autoPlay />
          ) : (
            <img src={firstMedia.thumbnailUrl ?? firstMedia.url} alt="" />
          )
        ) : (
          <div className={styles.mediaPlaceholder}>
            <span className={styles.placeholderInitials}>{initials}</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <StarRating rating={review.rating} />
        <p className={styles.comment}>{review.comment}</p>
        <p className={styles.name}>{review.customerName ?? "Customer"}</p>
        {review.customerHandle && (
          <p className={styles.handle}>{review.customerHandle}</p>
        )}
        <hr className={styles.divider} />
        <p className={styles.productTag}>· {review.product.name}</p>
      </div>
    </div>
  );
}

function MarqueeRow({
  reviews,
  reverse,
}: {
  reviews: PublicReview[];
  reverse?: boolean;
}) {
  const items = [...reviews, ...reviews];
  return (
    <div className={styles.rowWrap}>
      <div className={`${styles.track} ${reverse ? styles.trackRev : ""}`}>
        {items.map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

interface ReviewsMarqueeProps {
  reviews: PublicReview[];
}

export function ReviewsMarquee({ reviews }: ReviewsMarqueeProps) {
  if (reviews.length < 4) return null;

  const twoRows = reviews.length > 10;
  const mid = Math.ceil(reviews.length / 2);
  const row1 = twoRows ? reviews.slice(0, mid) : reviews;
  const row2 = twoRows ? reviews.slice(mid) : [];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.label}>What Our Customers Say</div>
        <h2 className={styles.heading}>
          Worn with <em>love</em>
        </h2>
      </div>
      <div className={styles.marqueeWrap}>
        <MarqueeRow reviews={row1} />
        {twoRows && <MarqueeRow reviews={row2} reverse />}
      </div>
    </section>
  );
}
