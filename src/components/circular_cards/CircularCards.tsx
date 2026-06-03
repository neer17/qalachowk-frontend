"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { CIRCULAR_CARD_IMAGES } from "@/utils/constants";
import styles from "./CircularCards.module.css";

const ARC_SPAN_DEG = 70;
const MAX_ROTATION_DEG = 20;
const MAX_DRAG_ROTATION_DEG = 36;
const MOBILE_BREAKPOINT_PX = 768;
const DRAG_DEG_PER_PX = 0.15;

export function CircularCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(1000);
  const [containerTop, setContainerTop] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const update = () => {
      if (!holderRef.current || !itemRef.current) return;
      const holderRect = holderRef.current.getBoundingClientRect();
      const itemRect = itemRef.current.getBoundingClientRect();
      const arcSpanRad = (ARC_SPAN_DEG * Math.PI) / 180;
      const maxRotationRad = (MAX_ROTATION_DEG * Math.PI) / 180;
      // Pick radius so the rightmost card sits just past the holder edge at
      // start-of-scroll rotation — it stays hidden until the user scrolls.
      const r =
        (holderRect.width + itemRect.width) /
        (2 * Math.sin(arcSpanRad / 2 + maxRotationRad));
      const topInset = Math.min(30, holderRect.height * 0.05);
      setRadius(r);
      setContainerTop(
        topInset + itemRect.height / 2 + r - holderRect.height / 2,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Desktop: leftmost-visible → rightmost-visible across the section.
  // Mobile: rightmost-visible by default → leftmost-visible as user scrolls past.
  const scrollRotate = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? [-MAX_ROTATION_DEG, MAX_ROTATION_DEG]
      : [MAX_ROTATION_DEG, -MAX_ROTATION_DEG],
  );

  const dragOffset = useMotionValue(0);
  const rotate = useTransform([scrollRotate, dragOffset], (values) => {
    const [s, d] = values as [number, number];
    return Math.max(
      -MAX_DRAG_ROTATION_DEG,
      Math.min(MAX_DRAG_ROTATION_DEG, s + d),
    );
  });

  useEffect(() => {
    if (!isMobile) return;
    const el = holderRef.current;
    if (!el) return;

    let startX = 0;
    let startOffset = 0;
    let activeId: number | null = null;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      activeId = e.pointerId;
      startX = e.clientX;
      startOffset = dragOffset.get();
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== activeId) return;
      const dx = e.clientX - startX;
      const s = scrollRotate.get();
      // Clamp so combined rotation stays within ±MAX_DRAG (wider than scroll range).
      const minD = -MAX_DRAG_ROTATION_DEG - s;
      const maxD = MAX_DRAG_ROTATION_DEG - s;
      const next = Math.max(
        minD,
        Math.min(maxD, startOffset + dx * DRAG_DEG_PER_PX),
      );
      dragOffset.set(next);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== activeId) return;
      activeId = null;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [isMobile, dragOffset, scrollRotate]);

  const N = CIRCULAR_CARD_IMAGES.length;
  const arcSpan = (ARC_SPAN_DEG * Math.PI) / 180;
  const startAngle = -Math.PI / 2 - arcSpan / 2;
  const step = N > 1 ? arcSpan / (N - 1) : 0;

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header}>
        <div className={`${styles.label} fade-up`}>The process</div>
        <h2 className={`${styles.heading} fade-up`}>
          Failures <em>to Finish</em>
        </h2>
      </div>
      <div className={styles.holder} ref={holderRef}>
        <motion.div
          className={styles.container}
          style={{ rotate, top: containerTop }}
        >
          {CIRCULAR_CARD_IMAGES.map((card, i) => {
            const theta = startAngle + i * step;
            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius;
            const rot = (theta * 180) / Math.PI + 90;
            return (
              <div
                key={card.id}
                ref={i === 0 ? itemRef : undefined}
                className={styles.item}
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                }}
              >
                <div className={styles.card}>
                  <img
                    className={styles.cardImage}
                    src={card.imageUrl}
                    alt=""
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
