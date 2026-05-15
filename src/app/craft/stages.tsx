"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export function HeroGlyph() {
  return (
    <video
      src="https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/hero_video.MOV"
      className={styles.heroGlyph}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

export function StageSketch() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) setRevealed(true);
      },
      { threshold: [0.5] },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`${styles.stageArt} ${revealed ? styles.sketchOn : ""}`}
      ref={ref}
      onClick={() => setRevealed(true)}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />
      <img
        src="https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/the_sketch.png"
        className={styles.sketchSvg}
        alt="Sketch image"
      />
      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        Motif Sketch
      </div>
    </div>
  );
}

export function StageRightScale() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const lastX = useRef<number | null>(null);

  const onMove = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const xRel = (clientX - r.left) / r.width;
    if (lastX.current !== null) {
      const dx = Math.abs(xRel - lastX.current);
      setProgress((p) => Math.min(1, p + dx * 0.9));
    }
    lastX.current = xRel;
  };

  return (
    <div
      className={styles.stageArt}
      ref={ref}
      style={{ cursor: "ew-resize" }}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseLeave={() => {
        lastX.current = null;
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) onMove(e.touches[0].clientX);
      }}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />
      <img
        src="https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/right_scale.png"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        alt=""
      />
      <div className={styles.waxProgress}>
        <span>Carve</span>
        <div
          className={styles.waxTrack}
          style={
            { "--p": `${Math.round(progress * 100)}%` } as React.CSSProperties
          }
        />
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        Drag horizontally to carve
      </div>
    </div>
  );
}

export function StageMould() {
  const [pouring, setPouring] = useState(false);
  const [fill, setFill] = useState(0);
  const [heat, setHeat] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setHeat((h) => {
        const target = pouring ? 1 : 0;
        return h + (target - h) * Math.min(1, dt * 3);
      });
      if (pouring) {
        setFill((f) => Math.min(1, f + dt * 0.32));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pouring]);

  const start = () => setPouring(true);
  const stop = () => setPouring(false);

  return (
    <div
      className={styles.stageArt}
      style={{ cursor: "pointer" }}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={(e) => {
        e.preventDefault();
        start();
      }}
      onTouchEnd={stop}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />

      <img
        src="https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/molds.png"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        alt=""
      />

      <div className={styles.heatMeter}>
        <div>Crucible &middot; 1064&deg;C</div>
        <div
          className={styles.heatBar}
          style={{ "--h": `${Math.round(heat * 100)}%` } as React.CSSProperties}
        />
      </div>

      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        {fill >= 1
          ? "Cast complete"
          : pouring
            ? "Pouring molten gold\u2026"
            : "Press and hold to pour"}
      </div>
    </div>
  );
}

export function StageColors() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [placed, setPlaced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lit, setLit] = useState(false);
  const target = { x: 0.5, y: 0.42, r: 32 };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (placed) return;
    setDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const c = "touches" in e ? e.touches[0] : e;
      if (!ref.current || !c) return;
      const r = ref.current.getBoundingClientRect();
      const x = c.clientX - r.left - 27;
      const y = c.clientY - r.top - 27;
      setPos({
        x: Math.max(4, Math.min(r.width - 58, x)),
        y: Math.max(4, Math.min(r.height - 58, y)),
      });
    };
    const onUp = () => {
      setDragging(false);
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = pos.x + 27;
      const cy = pos.y + 27;
      const tx = target.x * r.width;
      const ty = target.y * r.height;
      const dist = Math.hypot(cx - tx, cy - ty);
      if (dist < target.r) {
        setPlaced(true);
        setPos({ x: tx - 27, y: ty - 27 });
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, pos]);

  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = pos.x + 27;
    const cy = pos.y + 27;
    const tx = target.x * r.width;
    const ty = target.y * r.height;
    setLit(Math.hypot(cx - tx, cy - ty) < target.r + 12);
  }, [pos]);

  return (
    <div className={styles.stageArt} ref={ref}>
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />

      <img
        src="https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/colors.jpeg"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        alt=""
      />

      {!placed && (
        <div
          className={`${styles.gemTarget} ${lit ? styles.gemTargetLit : ""}`}
          style={{
            left: `calc(${target.x * 100}% - 32px)`,
            top: `calc(${target.y * 100}% - 32px)`,
          }}
        >
          {lit ? "Set" : "Place"}
        </div>
      )}

      <div
        className={`${styles.gemPiece} ${placed ? styles.gemPlaced : ""}`}
        style={{ left: pos.x, top: pos.y }}
        onMouseDown={onDown}
        onTouchStart={onDown}
      >
        <img src="" width="54" height="54" alt="" />
      </div>

      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        {placed
          ? "Stone set \u00B7 2.4 ct Burmese ruby"
          : "Drag the ruby into the bezel"}
      </div>
    </div>
  );
}

export function StageJewelryDesign() {
  const [traced] = useState(0);

  return (
    <div className={styles.stageArt} style={{ cursor: "pointer" }}>
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />
      <img
        src=""
        style={{
          position: "absolute",
          inset: "14px",
          width: "calc(100% - 28px)",
          height: "calc(100% - 28px)",
          objectFit: "cover",
        }}
        alt=""
      />
      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        {traced >= 0.99
          ? "Engraved \u00B7 14 hours of handwork"
          : "Press and trace the dotted path"}
      </div>
    </div>
  );
}

export function StageFinish() {
  const ref = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(0.5);
  const [drag, setDrag] = useState(false);

  const onMove = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.max(0.04, Math.min(0.96, (clientX - r.left) / r.width)));
  };

  return (
    <div
      className={styles.stageArt}
      ref={ref}
      style={{ cursor: "ew-resize" }}
      onMouseDown={(e) => {
        setDrag(true);
        onMove(e.clientX);
      }}
      onMouseUp={() => setDrag(false)}
      onMouseLeave={() => setDrag(false)}
      onMouseMove={(e) => {
        if (drag) onMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setDrag(true);
        if (e.touches[0]) onMove(e.touches[0].clientX);
      }}
      onTouchEnd={() => setDrag(false)}
      onTouchMove={(e) => {
        if (drag && e.touches[0]) onMove(e.touches[0].clientX);
      }}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />

      {/* Rough side */}
      <img
        src=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          clipPath: `inset(0 ${(1 - split) * 100}% 0 0)`,
        }}
        alt=""
      />

      {/* Polished side */}
      <img
        src=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          clipPath: `inset(0 0 0 ${split * 100}%)`,
        }}
        alt=""
      />

      {/* Slider handle */}
      <div
        className={styles.polishHandle}
        style={{ left: `${split * 100}%` }}
      />

      <div className={styles.polishLabelL}>Rough</div>
      <div className={styles.polishLabelR}>Polished</div>

      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        Drag to compare
      </div>
    </div>
  );
}

export function FinalPiece() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
    setTilt({ x, y });
  };

  return (
    <div
      className={styles.finalePiece}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform .15s ease-out",
          transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        }}
      >
        <img
          src=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt=""
        />
      </div>
    </div>
  );
}
