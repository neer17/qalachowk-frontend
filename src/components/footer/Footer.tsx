import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footerContainer} data-purpose="main-footer">
      {/* Top Mandana Border */}
      <div aria-hidden="true" className={styles.mandanaPattern}></div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo & Tagline */}
          <div className={styles.brandColumn}>
            <h2 className={styles.logoText}>Qala Chowk</h2>
            <p className={styles.tagline}>
              Preserving heritage through handcrafted excellence.
            </p>
          </div>

          {/* Shop Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.heading}>Explore</h4>
            <ul className={styles.list}>
              <li>
                <Link href="#">Earrings</Link>
              </li>
              <li>
                <Link href="#">Necklaces</Link>
              </li>
              <li>
                <Link href="#">Bracelets</Link>
              </li>
              <li>
                <Link href="#">Collections</Link>
              </li>
            </ul>
          </div>

          {/* Brand Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.heading}>Company</h4>
            <ul className={styles.list}>
              <li>
                <Link href="#">Our Craft</Link>
              </li>
              <li>
                <Link href="#">The Story</Link>
              </li>
              <li>
                <Link href="#">Sustainability</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className={styles.newsletterColumn}>
            <h4 className={styles.heading}>Join the Circle</h4>
            <p className={styles.newsletterText}>
              Subscribe for artisan stories and exclusive launches.
            </p>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email Address"
                className={styles.input}
              />
              <button className={styles.button}>Join</button>
            </div>
            <div className={styles.socialLinks}>
              <Link href="#">Instagram</Link>
              <Link href="#">Pinterest</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2026 Qala Chowk Handcrafted. All Rights Reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
