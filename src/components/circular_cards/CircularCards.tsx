"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./CircularCards.module.css";

interface CircularCard {
  id: string;
  name: string;
  tag: string;
  price: number;
  cat: string;
  slug: string;
  imageUrl: string;
}

const CARDS: CircularCard[] = [
  {
    id: "cc-1",
    name: "Warli",
    tag: "Maharashtra",
    price: 2400,
    cat: "warli",
    slug: "warli-classic",
    imageUrl: "",
  },
  {
    id: "cc-2",
    name: "Madhubani",
    tag: "Mithila",
    price: 2800,
    cat: "madhubani",
    slug: "madhubani-classic",
    imageUrl: "",
  },
  {
    id: "cc-3",
    name: "Mandana",
    tag: "Rajasthan",
    price: 2200,
    cat: "mandana",
    slug: "mandana-classic",
    imageUrl: "",
  },
  {
    id: "cc-4",
    name: "Pattachitra",
    tag: "Odisha",
    price: 3200,
    cat: "pattachitra",
    slug: "pattachitra-classic",
    imageUrl: "",
  },
  {
    id: "cc-5",
    name: "Kalamkari",
    tag: "Andhra",
    price: 2600,
    cat: "kalamkari",
    slug: "kalamkari-classic",
    imageUrl: "",
  },
  {
    id: "cc-6",
    name: "Phad",
    tag: "Rajasthan",
    price: 3400,
    cat: "phad",
    slug: "phad-classic",
    imageUrl: "",
  },
  {
    id: "cc-7",
    name: "Kalighat",
    tag: "Bengal",
    price: 2500,
    cat: "kalighat",
    slug: "kalighat-classic",
    imageUrl: "",
  },
  {
    id: "cc-8",
    name: "Gond",
    tag: "Madhya Pradesh",
    price: 2700,
    cat: "gond",
    slug: "gond-classic",
    imageUrl: "",
  },
  {
    id: "cc-9",
    name: "Bhil",
    tag: "Madhya Pradesh",
    price: 2300,
    cat: "bhil",
    slug: "bhil-classic",
    imageUrl: "",
  },
  {
    id: "cc-10",
    name: "Tanjore",
    tag: "Tamil Nadu",
    price: 4200,
    cat: "tanjore",
    slug: "tanjore-classic",
    imageUrl: "",
  },
  {
    id: "cc-11",
    name: "Pichwai",
    tag: "Rajasthan",
    price: 3800,
    cat: "pichwai",
    slug: "pichwai-classic",
    imageUrl: "",
  },
  {
    id: "cc-12",
    name: "Cheriyal",
    tag: "Telangana",
    price: 2900,
    cat: "cheriyal",
    slug: "cheriyal-classic",
    imageUrl: "",
  },
  {
    id: "cc-13",
    name: "Sohrai",
    tag: "Jharkhand",
    price: 2400,
    cat: "sohrai",
    slug: "sohrai-classic",
    imageUrl: "",
  },
  {
    id: "cc-14",
    name: "Saura",
    tag: "Odisha",
    price: 2500,
    cat: "saura",
    slug: "saura-classic",
    imageUrl: "",
  },
  {
    id: "cc-15",
    name: "Bhuta",
    tag: "Karnataka",
    price: 3100,
    cat: "bhuta",
    slug: "bhuta-classic",
    imageUrl: "",
  },
  {
    id: "cc-16",
    name: "Mata Ni Pachedi",
    tag: "Gujarat",
    price: 3600,
    cat: "mata-ni-pachedi",
    slug: "mata-ni-pachedi-classic",
    imageUrl: "",
  },
  {
    id: "cc-17",
    name: "Thangka",
    tag: "Himalayas",
    price: 4400,
    cat: "thangka",
    slug: "thangka-classic",
    imageUrl: "",
  },
  {
    id: "cc-18",
    name: "Pithora",
    tag: "Gujarat",
    price: 2800,
    cat: "pithora",
    slug: "pithora-classic",
    imageUrl: "",
  },
];

export function CircularCards() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(1200);
  const [containerTop, setContainerTop] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!holderRef.current || !itemRef.current) return;
      const holderRect = holderRef.current.getBoundingClientRect();
      const itemRect = itemRef.current.getBoundingClientRect();
      const r = (holderRect.width - window.innerWidth / 10) * 0.93;
      const topInset = holderRect.height * 0.22;
      setRadius(r);
      setContainerTop(r - (holderRect.height - itemRect.height) / 2 + topInset);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const handleCardClick = (card: CircularCard) => {
    router.push(`/categories/${card.cat}/${card.slug}`);
  };

  const N = CARDS.length;
  const step = (2 * Math.PI) / N;

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header}>
        <div className={styles.label}>Heritage Crafts</div>
        <h2 className={styles.heading}>
          Spinning <em>stories</em>
        </h2>
      </div>
      <div className={styles.holder} ref={holderRef}>
        <motion.div
          className={styles.container}
          style={{ rotate, top: containerTop }}
        >
          {CARDS.map((card, i) => {
            const theta = i * step;
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
                onClick={() => handleCardClick(card)}
              >
                <div className={styles.card}>
                  <img
                    className={styles.cardImage}
                    src={card.imageUrl}
                    alt={card.name}
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
