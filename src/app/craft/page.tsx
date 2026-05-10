"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  HeroGlyph,
  StageSketch,
  StageWax,
  StagePour,
  StageStone,
  StageEngrave,
  StagePolish,
  FinalPiece,
} from "./stages";

const STAGES = [
  {
    id: "i",
    roman: "I",
    kicker: "Stage One",
    title: "The Sketch",
    sub: "Pencil to vellum",
    Comp: StageSketch,
    body: [
      "Every piece begins as a thought, then a line, then a quiet conversation between the designer and the page.",
      "The first drawing is rarely the last \u2014 proportions are tested, weights re-imagined, until the silhouette feels inevitable.",
    ],
    meta: {
      Material: "Graphite, vellum",
      Time: "2\u20134 days",
      Tool: "No. 4 pencil",
    },
    prompt: "Hover to watch the sketch draw itself",
  },
  {
    id: "ii",
    roman: "II",
    kicker: "Stage Two",
    title: "The Wax",
    sub: "Carving the form",
    Comp: StageWax,
    body: [
      "A block of jeweller\u2019s wax becomes the negative of a future heirloom. Cut, scraped, warmed, and breathed upon.",
      "It must be exact: every gram removed here will be a gram of gold cast in its place.",
    ],
    meta: { Material: "Blue wax", Time: "1 week", Tool: "Spatula, blade" },
    prompt: "Drag across to carve",
  },
  {
    id: "iii",
    roman: "III",
    kicker: "Stage Three",
    title: "The Cast",
    sub: "Molten gold meets mould",
    Comp: StagePour,
    body: [
      "At 1,064\u00B0C, gold becomes a slow, honey-bright liquid. It is poured in a single, held breath \u2014 once, only once.",
      "What emerges from the plaster is rough and hot, but it is, at last, a thing of metal.",
    ],
    meta: {
      Material: "22kt yellow gold",
      Temp: "1064 \u00B0C",
      Time: "45 minutes",
    },
    prompt: "Press and hold to pour",
  },
  {
    id: "iv",
    roman: "IV",
    kicker: "Stage Four",
    title: "The Stone",
    sub: "A single gemstone, set",
    Comp: StageStone,
    body: [
      "A 2.4-carat Burmese ruby is chosen from a tray of forty. Each prong is bent, tested, bent again.",
      "When the bezel closes, the stone is held by hands that will never let go.",
    ],
    meta: { Stone: "Burmese ruby", Carats: "2.40 ct", Cut: "Rose / cabochon" },
    prompt: "Drag the ruby into the bezel",
  },
  {
    id: "v",
    roman: "V",
    kicker: "Stage Five",
    title: "The Hand",
    sub: "Filigree, by candlelight",
    Comp: StageEngrave,
    body: [
      "The finest line on a piece is no thicker than a human hair. It is engraved, not printed; felt, not specified.",
      "Forty hours of slow, patient hand-work, the kind that is becoming rare in the world.",
    ],
    meta: {
      Tool: "Burin No. 2",
      Hours: "14\u201340",
      Margin: "\u00B1 0.05 mm",
    },
    prompt: "Press and trace the path",
  },
  {
    id: "vi",
    roman: "VI",
    kicker: "Stage Six",
    title: "The Finish",
    sub: "From rouge to mirror",
    Comp: StagePolish,
    body: [
      "Three rouges, four buffs, a final wash in soft water. The piece is held to the light and turned, slowly, until it answers back.",
      "Only then is it stamped, signed, and tucked into a box that smells faintly of cedar.",
    ],
    meta: {
      Compound: "Tripoli \u2192 rouge",
      Buffs: "4 stages",
      Stamp: "QC \u00B7 916",
    },
    prompt: "Drag the seam to compare",
  },
];

function Divider({ label }: { label: string }) {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerL} />
      <span className={styles.dividerGlyph}>\u2766</span>
      <span>{label}</span>
      <span className={styles.dividerGlyph}>\u2766</span>
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
              Six
              <br />
              <em>quiet</em>
              <br />
              hands<span className={styles.ornament}>.</span>
            </h1>
          </div>
          <div className={styles.heroSide}>
            <p>
              &ldquo;To make a piece of jewellery is to spend a hundred small
              hours teaching gold a single, deliberate shape.&rdquo;
            </p>
            <div className={styles.heroMeta}>
              <span>&mdash; Master Atelier</span>
              <span>Six stages &middot; 60+ days</span>
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
                  label={`Then, the ${STAGES[i + 1].title.replace("The ", "").toLowerCase()}`}
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
          Sixty-three days, six pairs of hands, a single piece. It will outlive
          us &mdash; and that, exactly, is the point.
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
          <span className={styles.sigMark}>Qala Chowk</span>
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
            <span className={styles.stageOf}>/ VI &middot; {stage.kicker}</span>
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
          <dl className={styles.stageMeta}>
            {Object.entries(stage.meta).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.stagePrompt}>
            <span className={styles.promptArrow} />
            {stage.prompt}
          </div>
        </div>
        {Comp}
      </section>
    </>
  );
}
