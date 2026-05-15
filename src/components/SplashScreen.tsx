"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2650);
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
      {/* Logo */}
      <div className={styles.clip}>
        <div className={`${styles.item} ${styles.delay0}`}>
          <svg
            className={styles.logo}
            width="64"
            height="64"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Tail feather rays */}
            <line
              x1="30"
              y1="37"
              x2="8"
              y2="14"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="37"
              x2="15"
              y2="9"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="37"
              x2="23"
              y2="6"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="37"
              x2="30"
              y2="5"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="37"
              x2="37"
              y2="6"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="37"
              x2="45"
              y2="9"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="30"
              y1="37"
              x2="52"
              y2="14"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Feather-tip dots */}
            <circle cx="8" cy="13" r="2" fill="#C8956C" />
            <circle cx="15" cy="8" r="2" fill="#C8956C" />
            <circle cx="23" cy="5" r="2" fill="#C8956C" />
            <circle cx="30" cy="4" r="2" fill="#C8956C" />
            <circle cx="37" cy="5" r="2" fill="#C8956C" />
            <circle cx="45" cy="8" r="2" fill="#C8956C" />
            <circle cx="52" cy="13" r="2" fill="#C8956C" />
            {/* Body */}
            <ellipse
              cx="30"
              cy="38"
              rx="10"
              ry="8"
              stroke="#6A2901"
              strokeWidth="1.4"
              fill="none"
            />
            {/* Neck */}
            <line
              x1="30"
              y1="30"
              x2="30"
              y2="24"
              stroke="#6A2901"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Head */}
            <circle
              cx="30"
              cy="19"
              r="5"
              stroke="#6A2901"
              strokeWidth="1.4"
              fill="none"
            />
            {/* Crest */}
            <circle cx="27.5" cy="13.5" r="1.4" fill="#6A2901" />
            <circle cx="30" cy="12.5" r="1.4" fill="#6A2901" />
            <circle cx="32.5" cy="13.5" r="1.4" fill="#6A2901" />
            {/* Eye */}
            <circle cx="32" cy="18" r="1" fill="#6A2901" />
            {/* Legs */}
            <line
              x1="26"
              y1="46"
              x2="23"
              y2="54"
              stroke="#6A2901"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <line
              x1="34"
              y1="46"
              x2="37"
              y2="54"
              stroke="#6A2901"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            {/* Feet */}
            <line
              x1="23"
              y1="54"
              x2="19"
              y2="57"
              stroke="#6A2901"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <line
              x1="23"
              y1="54"
              x2="22"
              y2="58"
              stroke="#6A2901"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <line
              x1="37"
              y1="54"
              x2="41"
              y2="57"
              stroke="#6A2901"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <line
              x1="37"
              y1="54"
              x2="38"
              y2="58"
              stroke="#6A2901"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div className={styles.clip}>
        <p className={`${styles.name} ${styles.item} ${styles.delay1}`}>
          Qala Chowk
        </p>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Tagline */}
      <div className={styles.clip}>
        <p className={`${styles.tagline} ${styles.item} ${styles.delay2}`}>
          Preserving heritage through handcrafted excellence
        </p>
      </div>
    </div>
  );
}
