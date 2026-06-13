"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Gulchharre from "@/assets/svgs/gulchharre.svg";
import styles from "./ComingSoon.module.css";
import NotifyForm from "./NotifyForm";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

// TODO(brand): fill with real photos / videos from the brand. When empty, neutral
// placeholders are rendered so the layout and animation remain visible.
const MEDIA: MediaItem[] = [];

type Phase = "entering" | "shown" | "out";
type TileState = { mediaIndex: number; phase: Phase };

interface TilePlacement {
  desktop: { col: string; row: string };
  mobile: { col: string; row: string };
  hideOnMobile?: boolean;
}

// Desktop: 12 cols x 6 rows. Mobile: 4 cols x 8 rows.
const TILES: TilePlacement[] = [
  {
    desktop: { col: "1 / 3", row: "1 / 4" },
    mobile: { col: "1 / 3", row: "1 / 3" },
  },
  {
    desktop: { col: "3 / 6", row: "1 / 3" },
    mobile: { col: "3 / 5", row: "1 / 3" },
  },
  {
    desktop: { col: "6 / 10", row: "1 / 3" },
    mobile: { col: "1 / 3", row: "3 / 5" },
  },
  {
    desktop: { col: "10 / 13", row: "1 / 4" },
    mobile: { col: "3 / 5", row: "3 / 5" },
  },
  {
    desktop: { col: "1 / 3", row: "4 / 7" },
    mobile: { col: "1 / 3", row: "5 / 7" },
  },
  {
    desktop: { col: "3 / 6", row: "3 / 5" },
    mobile: { col: "3 / 5", row: "5 / 7" },
  },
  {
    desktop: { col: "6 / 8", row: "3 / 5" },
    mobile: { col: "1 / 3", row: "7 / 9" },
  },
  {
    desktop: { col: "8 / 10", row: "3 / 5" },
    mobile: { col: "3 / 5", row: "7 / 9" },
  },
  {
    desktop: { col: "10 / 13", row: "4 / 7" },
    mobile: { col: "1 / 5", row: "1 / 2" },
  },
  {
    desktop: { col: "3 / 6", row: "5 / 7" },
    mobile: { col: "1 / 5", row: "8 / 9" },
  },
  {
    desktop: { col: "6 / 10", row: "5 / 7" },
    mobile: { col: "1 / 1", row: "1 / 1" },
    hideOnMobile: true,
  },
];

const TWINKLE_MIN_MS = 700;
const TWINKLE_RANGE_MS = 800;
const FADE_OUT_MS = 520;
const STAGGER_MS = 120;
const STAGGER_OFFSET_MS = 150;
const PLAQUE_DELAY_AFTER_TILES_MS = 350;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ga = (name: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
};

const fbq = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
};

// TODO(brand): real handles / number.
const INSTAGRAM_URL = "https://www.instagram.com/studio.gulchharre";
const WHATSAPP_URL = "https://wa.me/918769931749";
// TODO(brand): final tagline copy.
const TAGLINE = "Handcrafted joy, launching soon.";

const ComingSoon: React.FC = () => {
  const [tiles, setTiles] = useState<TileState[]>(() =>
    TILES.map((_, i) => ({
      mediaIndex: MEDIA.length > 0 ? i % MEDIA.length : i,
      phase: "entering" as Phase,
    })),
  );
  const [plaqueVisible, setPlaqueVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const timersRef = useRef<Set<number>>(new Set());
  const twinkleTimerRef = useRef<number | null>(null);
  const pausedRef = useRef<boolean>(false);
  const reducedMotionRef = useRef<boolean>(false);

  const addTimer = (id: number) => {
    timersRef.current.add(id);
    return id;
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current.clear();
    if (twinkleTimerRef.current !== null) {
      window.clearTimeout(twinkleTimerRef.current);
      twinkleTimerRef.current = null;
    }
  };

  // Body scroll lock + Navbar hide while mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Analytics: page view event on mount
  useEffect(() => {
    ga("coming_soon_view");
    fbq("ViewContent", { content_name: "coming_soon" });
  }, []);

  // Staggered entrance + plaque reveal
  useEffect(() => {
    TILES.forEach((_, i) => {
      const id = window.setTimeout(
        () => {
          setTiles((prev) => {
            const next = prev.slice();
            if (next[i]) next[i] = { ...next[i], phase: "shown" };
            return next;
          });
        },
        i * STAGGER_MS + STAGGER_OFFSET_MS,
      );
      addTimer(id);
    });
    const plaqueId = window.setTimeout(
      () => setPlaqueVisible(true),
      TILES.length * STAGGER_MS +
        STAGGER_OFFSET_MS +
        PLAQUE_DELAY_AFTER_TILES_MS,
    );
    addTimer(plaqueId);

    return clearAllTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reduced motion + visibility listeners + twinkle loop
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    setReducedMotion(mql.matches);

    const onMqlChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      setReducedMotion(e.matches);
      if (e.matches) {
        if (twinkleTimerRef.current !== null) {
          window.clearTimeout(twinkleTimerRef.current);
          twinkleTimerRef.current = null;
        }
      } else if (!pausedRef.current) {
        scheduleTwinkle();
      }
    };

    const onVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      pausedRef.current = hidden;
      if (hidden) {
        if (twinkleTimerRef.current !== null) {
          window.clearTimeout(twinkleTimerRef.current);
          twinkleTimerRef.current = null;
        }
      } else if (!reducedMotionRef.current) {
        scheduleTwinkle();
      }
    };

    const scheduleTwinkle = () => {
      if (twinkleTimerRef.current !== null) return;
      const delay = TWINKLE_MIN_MS + Math.random() * TWINKLE_RANGE_MS;
      twinkleTimerRef.current = window.setTimeout(() => {
        twinkleTimerRef.current = null;
        if (pausedRef.current || reducedMotionRef.current) return;
        doTwinkle();
        scheduleTwinkle();
      }, delay);
    };

    const doTwinkle = () => {
      setTiles((prev) => {
        const shownIdxs = prev
          .map((t, i) => (t.phase === "shown" ? i : -1))
          .filter((i) => i >= 0);
        if (shownIdxs.length === 0) return prev;
        const pick = shownIdxs[Math.floor(Math.random() * shownIdxs.length)];
        const next = prev.slice();
        const tile = next[pick];
        if (!tile) return prev;
        next[pick] = { ...tile, phase: "out" };

        const swapId = window.setTimeout(() => {
          setTiles((curr) => {
            const after = curr.slice();
            const t = after[pick];
            if (!t) return curr;
            const newMediaIndex =
              MEDIA.length > 0
                ? (t.mediaIndex + 1) % MEDIA.length
                : t.mediaIndex;
            after[pick] = { mediaIndex: newMediaIndex, phase: "shown" };
            return after;
          });
        }, FADE_OUT_MS);
        addTimer(swapId);

        return next;
      });
    };

    mql.addEventListener("change", onMqlChange);
    document.addEventListener("visibilitychange", onVisibility);

    // Start loop once entrance settles (after last stagger).
    if (!mql.matches) {
      const kickId = window.setTimeout(
        () => scheduleTwinkle(),
        TILES.length * STAGGER_MS +
          STAGGER_OFFSET_MS +
          PLAQUE_DELAY_AFTER_TILES_MS,
      );
      addTimer(kickId);
    }

    return () => {
      mql.removeEventListener("change", onMqlChange);
      document.removeEventListener("visibilitychange", onVisibility);
      clearAllTimers();
    };
  }, []);

  const renderTileContent = (tile: TileState, placeholderIndex: number) => {
    if (MEDIA.length === 0) {
      return (
        <div
          className={styles.placeholder}
          data-placeholder-index={placeholderIndex}
          aria-hidden="true"
        />
      );
    }
    const item = MEDIA[tile.mediaIndex % MEDIA.length];
    if (!item) return null;
    if (item.type === "video") {
      return (
        <video
          className={styles.media}
          src={item.src}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-label={item.alt}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={styles.media}
        src={item.src}
        alt={item.alt ?? ""}
        loading="eager"
      />
    );
  };

  const onSocialClick = (label: "instagram" | "whatsapp") => {
    ga("social_click", { label });
  };

  return (
    <div className={styles.root} data-reduced-motion={reducedMotion}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.frame}>
        <div className={styles.wall}>
          {TILES.map((placement, i) => {
            const tile = tiles[i];
            if (!tile) return null;
            return (
              <div
                key={i}
                className={styles.tile}
                data-phase={tile.phase}
                data-mobile-hidden={placement.hideOnMobile ? "true" : "false"}
                style={
                  {
                    gridColumn: placement.desktop.col,
                    gridRow: placement.desktop.row,
                    "--cs-mobile-col": placement.mobile.col,
                    "--cs-mobile-row": placement.mobile.row,
                  } as React.CSSProperties
                }
              >
                {renderTileContent(tile, i)}
              </div>
            );
          })}
        </div>

        <div className={styles.plaque} data-visible={plaqueVisible}>
          <Image
            src={Gulchharre}
            alt="Gulchharre"
            priority
            className={styles.wordmark}
          />
          <h1 className={styles.title}>Coming Soon</h1>
          <p className={styles.tagline}>{TAGLINE}</p>
          <p className={styles.launchDate}>
            <span className={styles.launchDateLabel}>Launching</span>
            <span className={styles.launchDateSep} aria-hidden="true">
              ·
            </span>
            <time dateTime="2026-11-08">08 November 2026</time>
          </p>
          <NotifyForm />
          <div className={styles.socialRow}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.socialLink}
              onClick={() => onSocialClick("instagram")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={styles.socialLink}
              onClick={() => onSocialClick("whatsapp")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-12.6 7.23L3 20.5l1.85-5.18A8.38 8.38 0 1 1 21 11.5z" />
                <path d="M9.4 8.6c.15-.36.35-.36.55-.36h.45c.15 0 .35.05.55.45l.7 1.7c.05.15.05.3-.05.45l-.3.4c-.1.15-.2.3-.05.55a6.3 6.3 0 0 0 2.85 2.5c.25.1.4.05.55-.1l.45-.5c.1-.15.25-.15.4-.05l1.6.85c.2.1.3.2.3.35a2 2 0 0 1-.7 1.5 2.3 2.3 0 0 1-1.6.45 6.3 6.3 0 0 1-2.4-.7 9.4 9.4 0 0 1-3.45-3.05 4 4 0 0 1-.75-2.05 2.3 2.3 0 0 1 .7-1.6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
