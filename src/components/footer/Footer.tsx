import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footerContainer} data-purpose="main-footer">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo */}
          <div className={styles.brandColumn}>
            <h2 className={styles.logoText}>Gulchharre</h2>
          </div>

          {/* Shop Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.heading}>Explore</h4>
            <ul className={styles.list}>
              <li>
                <Link href="/categories/earrings">Earrings</Link>
              </li>
              <li>
                <Link href="/categories/necklaces">Necklaces</Link>
              </li>
              <li>
                <Link href="/categories/rings">Rings</Link>
              </li>
              <li>
                <Link href="/categories/collections">Collections</Link>
              </li>
            </ul>
          </div>

          {/* Brand Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.heading}>Company</h4>
            <ul className={styles.list}>
              <li>
                <Link href="/craft">Our Craft</Link>
              </li>
              <li>
                <Link href="/return-policy">Returns &amp; Refunds</Link>
              </li>
              <li>
                <Link href="/shipping-policy">Shipping</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2026 Gulchharre Handcrafted. All Rights Reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping-policy">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
