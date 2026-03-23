import React from "react";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Mandana ornament */}
        <div className={styles.ornament} aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect
              x="10"
              y="10"
              width="44"
              height="44"
              stroke="#C8956C"
              strokeWidth="0.8"
            />
            <polygon
              points="32,12 54,32 32,54 10,32"
              stroke="#C8956C"
              strokeWidth="0.8"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="10"
              stroke="#C8956C"
              strokeWidth="0.8"
              fill="none"
            />
            <line
              x1="10"
              y1="10"
              x2="54"
              y2="54"
              stroke="#C8956C"
              strokeWidth="0.4"
            />
            <line
              x1="54"
              y1="10"
              x2="10"
              y2="54"
              stroke="#C8956C"
              strokeWidth="0.4"
            />
          </svg>
        </div>

        <div className={styles.codeLabel}>404</div>

        <h1 className={styles.headline}>
          This path has not been
          <br />
          <em>drawn yet</em>
        </h1>

        <p className={styles.subText}>
          The page you&apos;re looking for doesn&apos;t exist, or has been
          moved.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            Back to Home
          </Link>
          <Link href="/shop" className={styles.btnOutline}>
            Browse Collections →
          </Link>
        </div>
      </div>
    </div>
  );
}
