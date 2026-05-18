"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CIRCULAR_CARD_IMAGES } from "@/utils/constants";
import styles from "./CircularCards.module.css";

const ARC_SPAN_DEG = 70;
const MAX_ROTATION_DEG = 20;

export function CircularCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(1000);
  const [containerTop, setContainerTop] = useState(0);

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
  // Positive → negative rotation so the cluster drifts right-to-left during scroll.
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [MAX_ROTATION_DEG, -MAX_ROTATION_DEG],
  );

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
