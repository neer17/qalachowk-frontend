"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  HeroGlyph,
  StageSketch,
  StageRightScale,
  StageMould,
  StageColors,
  StageJewelryDesign,
  StageFinish,
  FinalPiece,
} from "./stages";

const STAGES = [
  {
    id: "i",
    roman: "I",
    kicker: "Stage One",
    title: "The Sketch",
    sub: "Inspiration to motifs",
    Comp: StageSketch,
    body: [
      "Living in Jaipur means living inside a museum that never closes — colour and craft are simply in the air I breathe. One afternoon, I sat with a Blue Pottery vase and found myself tracing its patterns with my fingertip before I even reached for a sketchbook. I began drawing — florals, geometric loops, the symmetry that Jaipur's potters have carried for centuries. ",
    ],
  },
  {
    id: "ii",
    roman: "II",
    kicker: "Stage Two",
    title: "Finding the Right Scale",
    sub: "Carving the form",
    Comp: StageRightScale,
    body: [
      "Blue pottery pieces are usually made large and decorative.Turning them into wearable jewellery meant starting all over again, at a smaller scale. We searched, tested, and kept refining until the form began to feel just right.",
    ],
  },
  {
    id: "iii",
    roman: "III",
    kicker: "Stage Three",
    title: "Mould making and iteration",
    sub: "The hardest part wasn't making it beautiful. It was making it small enough to wear.",
    Comp: StageMould,
    body: [
      "This stage was full of trial, error, and patience.Many moulds did not work the way we hoped, but each failure taught us something new. Slowly, the process became clearer, and the tiny forms started taking shape.",
    ],
  },
  {
    id: "iv",
    roman: "IV",
    kicker: "Stage Four",
    title: "Choosing the colors",
    sub: "Some colors don't belong to trends. They belong to time.",
    Comp: StageColors,
    body: [
      "The colors came from the traditional palette of Jaipur blue pottery itself.We wanted the collection to feel rooted in the craft, not just inspired by it. So every shade was chosen to carry that familiar, timeless spirit.",
    ],
  },
  {
    id: "v",
    roman: "V",
    kicker: "Stage Five",
    title: "Jewelry design",
    sub: "The pottery told the story. The jewellery gave it a home.",
    Comp: StageJewelryDesign,
    body: [
      "Once the motifs were ready, the next step was to build the jewellery around them. We had to find the right balance between beauty, wearability, and structure. Each piece was designed to let the motif breathe and still feel complete.",
    ],
  },
  {
    id: "vi",
    roman: "VI",
    kicker: "Stage Six",
    title: "The Finish",
    sub: "We chose silver because it was the most truthful choice we could make.",
    Comp: StageFinish,
    body: [
      "We experimented with silver and brass finishes before settling on silver polish. It felt cleaner, softer, and more aligned with the final look we wanted. This step gave the jewellery its final quiet elegance.",
    ],
  },
];

function Divider({ label }: { label: string }) {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerL} />
      <span className={styles.dividerGlyph}>{"\u2766"}</span>
      <span>{label}</span>
      <span className={styles.dividerGlyph}>{"\u2766"}</span>
      <span className={styles.dividerR} />
    </div>
  );
}

function Rail({
  activeIdx,
  onJump,
}: {
  activeIdx: number;
  onJump: (i: number) => void;
}) {
  return (
    <nav className={styles.rail} aria-label="Craft stages">
      {STAGES.map((s, i) => (
        <div
          key={s.id}
          className={`${styles.railItem} ${activeIdx === i ? styles.railItemActive : ""}`}
          onClick={() => onJump(i)}
        >
          <span className={styles.railDot} />
          <span className={styles.railNum}>{s.roman}.</span>
          <span>{s.title.replace("The ", "")}</span>
        </div>
      ))}
    </nav>
  );
}

export default function CraftJourney() {
  const [activeIdx, setActiveIdx] = useState(0);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);

  const registerRef = useCallback((i: number, el: HTMLElement | null) => {
    stageRefs.current[i] = el;
  }, []);

  const jumpTo = (i: number) => {
    const el = stageRefs.current[i];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroCenter}>
          <div>
            <div className={styles.heroKicker}>From hand to heirloom</div>
            <h1 className={styles.heroTitle}>
              Blue
              <br />
              <em>Pottery</em>
              <br />
            </h1>
          </div>
          <div className={styles.heroSide}>
            <p>
              &ldquo;Blue Pottery is a traditional craft of Jaipur. A piece of
              blue pottery jewelry find it&apos;s roots in 14th century. It was
              revived by Maharajah Sawai Ram Singh II in the 19th
              century.&rdquo;
            </p>
            <div className={styles.heroMeta}>
              <span>Six stages &middot; 90+ days</span>
              <span>1 finished piece</span>
            </div>
          </div>
        </div>
        <div className={styles.heroFoot}>
          <HeroGlyph />
          <div className={styles.scrollCue}>
            <span>Scroll to begin</span>
            <span className={styles.scrollLine} />
          </div>
        </div>
      </header>

      {/* Side rail */}
      <Rail activeIdx={activeIdx} onJump={jumpTo} />

      {/* Stages */}
      <main className={styles.journey}>
        {STAGES.map((stage, i) => {
          const Comp = stage.Comp;
          return (
            <div key={stage.id}>
              <StageSection
                stage={stage}
                index={i}
                onActive={setActiveIdx}
                registerRef={registerRef}
              >
                <Comp />
              </StageSection>
              {i < STAGES.length - 1 && (
                <Divider
                  label={`Then, ${STAGES[i + 1].title.replace("The ", "").toLowerCase()}`}
                />
              )}
            </div>
          );
        })}
      </main>

      {/* Finale */}
      <section className={styles.finale}>
        <div className={styles.finaleKicker}>
          Stage Seven &middot; The Heirloom
        </div>
        <h2 className={styles.finaleTitle}>
          An <em>heirloom</em>,<br />
          at last.
        </h2>
        <p className={styles.finaleSub}>
          90+ days, countless iterations, a single piece. It will outlive us
          &mdash; and that, exactly, is the point.
        </p>
        <FinalPiece />
        <div className={styles.ctaRow}>
          <Link href="/shop" className={styles.btnPrimary}>
            Shop the Collection
          </Link>
          <Link href="/contact" className={styles.btn}>
            Commission a piece
          </Link>
        </div>
        <div className={styles.signature}>
          <span>Signed</span>
          <hr />
          <span className={styles.sigMark}>Gulchharre</span>
          <hr />
          <span>QC &middot; 916</span>
        </div>
      </section>
    </div>
  );
}

function StageSection({
  stage,
  index,
  onActive,
  registerRef,
  children,
}: {
  stage: (typeof STAGES)[number];
  index: number;
  onActive: (i: number) => void;
  registerRef: (i: number, el: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerRef(index, ref.current);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.45) {
          onActive(index);
        }
      },
      { threshold: [0.45, 0.6] },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [index, onActive, registerRef]);

  const flip = index % 2 === 1;
  const Comp = children;

  return (
    <>
      <section
        ref={ref}
        id={`stage-${stage.id}`}
        className={`${styles.stage} ${flip ? styles.stageFlip : ""}`}
      >
        <div className={styles.stageText}>
          <div className={styles.stageNum}>
            <span>{stage.roman}</span>
          </div>
          <div className={styles.stageKicker}>{stage.sub}</div>
          <h2 className={styles.stageTitle}>
            <em>The</em>{" "}
            <span className={styles.stageTitleBlock}>
              {stage.title.replace("The ", "")}
              <span className={styles.ornament}>.</span>
            </span>
          </h2>
          {stage.body.map((p, j) => (
            <p key={j} className={styles.stageBody}>
              {p}
            </p>
          ))}
        </div>
        {Comp}
      </section>
    </>
  );
}
