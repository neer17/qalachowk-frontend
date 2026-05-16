"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1010);
    const hideTimer = setTimeout(() => setVisible(false), 1710);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.wrapper} ${exiting ? styles.exiting : ""}`}
      aria-hidden="true"
    >
      <div className={styles.clip}>
        <h1 className={`${styles.name} ${styles.item}`}>Gulchharre</h1>
      </div>
    </div>
  );
}
