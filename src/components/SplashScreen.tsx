"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./SplashScreen.module.css";

const BRAND = "Gulchharre";
const ENTRY_DELAYS = [0.0, 0.18, 0.06, 0.25, 0.1, 0.3, 0.15, 0.22, 0.08, 0.32];
const EXIT_DELAYS = [0.05, 0.2, 0.0, 0.28, 0.12, 0.18, 0.32, 0.08, 0.24, 0.15];

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 2150);
    const hideTimer = setTimeout(() => setVisible(false), 3750);
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
        <h1 className={styles.name}>
          {BRAND.split("").map((char, i) => (
            <span
              key={i}
              className={styles.char}
              style={
                {
                  "--entry-delay": `${ENTRY_DELAYS[i] ?? 0}s`,
                  "--exit-delay": `${EXIT_DELAYS[i] ?? 0}s`,
                } as CSSProperties
              }
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
